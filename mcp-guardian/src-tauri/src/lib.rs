pub mod guard_profiles;
pub mod mcp_servers;
pub mod pending_messages;
pub mod server_collections;

use guard_profiles::{
    delete_guard_profile, get_guard_profile, list_guard_profiles, set_guard_profile,
};
use mcp_servers::{delete_mcp_server, get_mcp_server, list_mcp_servers, set_mcp_server};
use pending_messages::{approve_message, deny_message, get_pending_messages};
use server_collections::{
    apply_claude_config_for_server_collection, delete_server_collection,
    generate_claude_config_for_server_collection, get_server_collection, list_server_collections,
    set_server_collection,
};

pub type Result<T> = std::result::Result<T, String>;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            delete_mcp_server,
            list_mcp_servers,
            get_mcp_server,
            set_mcp_server,
            delete_guard_profile,
            list_guard_profiles,
            get_guard_profile,
            set_guard_profile,
            delete_server_collection,
            list_server_collections,
            get_server_collection,
            set_server_collection,
            generate_claude_config_for_server_collection,
            apply_claude_config_for_server_collection,
            get_pending_messages,
            approve_message,
            deny_message
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
