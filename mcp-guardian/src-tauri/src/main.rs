// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{io::Write, time::SystemTime};
use humantime::format_rfc3339_millis;

fn main() {
    let log_file = std::fs::File::create(
        mcp_guardian_core::dirs::AppSubDir::Logs
            .path()
            .expect("Log directory not found")
            .join("mcp-guardian.log"),
    );

    if let Ok(log_file) = log_file {
        env_logger::Builder::new()
            .filter_level(log::LevelFilter::Info)
            .format(|buf, record| {
                writeln!(
                    buf,
                    "[{}] {}",
                    format_rfc3339_millis(SystemTime::now()),
                    record.args()
                )
            })
            .target(env_logger::Target::Pipe(Box::new(log_file)))
            .init();
    }

    log::info!("Starting mcp-guardian");

    mcp_guardian_lib::run()
}
