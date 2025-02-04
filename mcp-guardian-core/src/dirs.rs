use std::path::PathBuf;

use anyhow::{anyhow, Result};
use strum::VariantArray;

use crate::APP_NAME;

fn app_dir() -> Result<PathBuf> {
    let app_dir = dirs::home_dir()
        .ok_or_else(|| anyhow!("Failed to get home directory."))?
        .join(format!(".{APP_NAME}"));

    Ok(app_dir)
}

#[allow(clippy::all)]
#[derive(VariantArray)]
pub enum AppSubDir {
    MessageApprovals,
    MessageApprovalsPending,
    MessageApprovalsApproved,
    MessageApprovalsDenied,
}

impl AppSubDir {
    pub fn path(&self) -> Result<PathBuf> {
        let path = match self {
            Self::MessageApprovals => app_dir()?.join("message-approvals"),
            Self::MessageApprovalsPending => Self::MessageApprovals.path()?.join("pending"),
            Self::MessageApprovalsApproved => Self::MessageApprovals.path()?.join("approved"),
            Self::MessageApprovalsDenied => Self::MessageApprovals.path()?.join("denied"),
        };

        Ok(path)
    }
}

pub fn create_all_dirs() -> Result<()> {
    for dir in AppSubDir::VARIANTS {
        std::fs::create_dir_all(dir.path()?)?;
    }

    Ok(())
}
