// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    if let Err(e) = mcp_guardian_core::init("mcp-guardian") {
        eprintln!("Error initializing mcp-guardian-core: {e:?}");
        std::process::exit(1);
    }

    log::info!("Starting mcp-guardian");

    mcp_guardian_lib::run()
}
