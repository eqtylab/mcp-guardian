use serde_json::Value;

#[tauri::command]
async fn get_pending_messages() -> Value {
    mcp_guardian_core::proxy::message_approval::get_pending_messages()
        .await
        .expect("get_pending_messages() failed.")
}

#[tauri::command]
async fn approve_message(id: String) {
    mcp_guardian_core::proxy::message_approval::approve_message(id)
        .await
        .expect("approve_message(id: String) failed.");
}

#[tauri::command]
async fn deny_message(id: String) {
    mcp_guardian_core::proxy::message_approval::deny_message(id)
        .await
        .expect("deny_message(id: String) failed.");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_pending_messages])
        .invoke_handler(tauri::generate_handler![approve_message])
        .invoke_handler(tauri::generate_handler![deny_message])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
