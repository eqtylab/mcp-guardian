use std::sync::Arc;

use anyhow::{anyhow, Result};
use serde_json::{json, Value};

use crate::{
    dirs::AppSubDir::{MessageApprovalsApproved, MessageApprovalsDenied, MessageApprovalsPending},
    message::MessageDirection,
};

#[derive(strum::Display)]
pub enum MessageStatus {
    #[strum(serialize = "approved")]
    Approved,
    #[strum(serialize = "denied")]
    Denied,
    #[strum(serialize = "pending")]
    Pending,
    #[strum(serialize = "unknown")]
    Unknown,
}

pub async fn request_approval(
    id: &str,
    direction: MessageDirection,
    message: Value,
) -> Result<Arc<dyn Fn() -> MessageStatus + Send + Sync>> {
    let id = String::from(id);
    let filename = format!("{direction}_{id}");
    log::info!("Requesting approval for message '{id}'");

    let pending_path = MessageApprovalsPending.path()?.join(&filename);
    let approved_path = MessageApprovalsApproved.path()?.join(&filename);
    let denied_path = MessageApprovalsDenied.path()?.join(&filename);

    tokio::fs::write(
        MessageApprovalsPending.path()?.join(&filename),
        message.to_string(),
    )
    .await?;

    let poll_status_callback = Arc::new(move || {
        if pending_path.exists() {
            log::info!("Message '{id}' is pending approval");
            MessageStatus::Pending
        } else if approved_path.exists() {
            log::info!("Message '{id}' is approved");
            MessageStatus::Approved
        } else if denied_path.exists() {
            log::info!("Message '{id}' is denied");
            MessageStatus::Denied
        } else {
            log::warn!("Message '{id}' is an unknown status");
            MessageStatus::Unknown
        }
    });

    Ok(poll_status_callback)
}

pub async fn get_pending_messages() -> Result<Value> {
    log::info!("Getting pending messages");
    let mut pending = json!({});

    let mut read_dir = tokio::fs::read_dir(MessageApprovalsPending.path()?).await?;

    while let Some(entry) = read_dir.next_entry().await? {
        let file_name = entry.file_name();
        let file_name_str = file_name
            .to_str()
            .ok_or_else(|| anyhow!("Invalid filename"))?;
        let file_path = entry.path();

        let file_contents = tokio::fs::read_to_string(file_path).await?;
        let file_contents_json: Value = serde_json::from_str(&file_contents)?;

        pending[file_name_str] = file_contents_json;
    }

    Ok(pending)
}

pub async fn approve_message(id: String) -> Result<()> {
    log::info!("Approving message '{id}'");
    let pending_file_path = MessageApprovalsPending.path()?.join(&id);
    let approved_file_path = MessageApprovalsApproved.path()?.join(&id);

    if !pending_file_path.exists() {
        log::error!("No pending approval with id={id}");
        panic!("No pending approval with id={id}");
    }

    tokio::fs::rename(&pending_file_path, &approved_file_path).await?;
    log::info!("Message '{id}' approved");

    Ok(())
}

pub async fn deny_message(id: String) -> Result<()> {
    log::info!("Denying message '{id}'");
    let pending_file_path = MessageApprovalsPending.path()?.join(&id);
    let denied_file_path = MessageApprovalsDenied.path()?.join(&id);

    if !pending_file_path.exists() {
        log::error!("No pending approval with id={id}");
        panic!("No pending approval with id={id}");
    }

    tokio::fs::rename(&pending_file_path, &denied_file_path).await?;
    log::info!("Message '{id}' denied");

    Ok(())
}
