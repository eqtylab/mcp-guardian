pub mod mcp_servers;
pub mod pending_messages;

use mcp_servers::{get_mcp_server, list_mcp_servers, set_mcp_server};
use pending_messages::{approve_message, deny_message, get_pending_messages};

pub type Result<T> = std::result::Result<T, String>;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            list_mcp_servers,
            get_mcp_server,
            set_mcp_server,
            get_pending_messages,
            approve_message,
            deny_message
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
