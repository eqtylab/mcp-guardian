use mcp_guardian_core::mcp_server::{McpServer, NamedMcpServer};

use crate::Result;

#[tauri::command]
pub async fn list_mcp_servers() -> Result<Vec<NamedMcpServer>> {
    mcp_guardian_core::mcp_server::list_mcp_servers()
        .map_err(|e| format!("list_mcp_servers() failed: {}", e))
}

#[tauri::command]
pub async fn get_mcp_server(namespace: &str, name: &str) -> Result<McpServer> {
    mcp_guardian_core::mcp_server::load_mcp_server(namespace, name)
        .map_err(|e| {
            format!(
                "get_mcp_server(namespace={namespace}, name={name}) failed: {}",
                e
            )
        })?
        .ok_or_else(|| "error: mcp server not found".to_owned())
}

#[tauri::command]
pub async fn set_mcp_server(namespace: &str, name: &str, mcp_server: McpServer) -> Result<()> {
    mcp_guardian_core::mcp_server::save_mcp_server(namespace, name, &mcp_server).map_err(|e| {
        format!(
            "set_mcp_server(namespace={namespace}, name={name}, ..) failed: {}",
            e
        )
    })
}
