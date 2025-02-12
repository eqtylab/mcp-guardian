use serde_json::Value;

use crate::Result;

#[tauri::command]
pub async fn get_pending_messages() -> Result<Value> {
    mcp_guardian_core::message_approval::get_pending_messages()
        .await
        .map_err(|e| format!("get_pending_messages() failed: {}", e))
}

#[tauri::command]
pub async fn approve_message(id: String) -> Result<()> {
    mcp_guardian_core::message_approval::approve_message(id.clone())
        .await
        .map_err(|e| format!("approve_message(id={id}) failed: {}", e))
}

#[tauri::command]
pub async fn deny_message(id: String) -> Result<()> {
    mcp_guardian_core::message_approval::deny_message(id.clone())
        .await
        .map_err(|e| format!("deny_message(id={id}) failed: {}", e))
}
