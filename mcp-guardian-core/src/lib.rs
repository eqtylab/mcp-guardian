use std::{io::Write, time::SystemTime};

use anyhow::Result;
use humantime::format_rfc3339_millis;

pub mod config;
pub mod dirs;
pub mod guard_profile;
pub mod mcp_server;
pub mod message;
pub mod message_approval;
pub mod message_interceptor;
pub mod proxy;
pub mod request_cache;
pub mod server_collection;

static APP_NAME: &str = "mcp-guardian";

/// Initializes `mcp-core` and configures a logging.
///
/// # Arguments
///
/// * `name` - The name used for log file.
///
/// # Errors
///
/// Returns an error if directory creation or logging initialization fails.
pub fn init(name: &str) -> Result<()> {
    dirs::create_all_dirs()?;
    init_logging(name)?;
    Ok(())
}

fn init_logging(name: &str) -> Result<()> {
    let log_file = Box::new(std::fs::File::create(
        dirs::AppSubDir::Logs.path()?.join(format!("{name}.log")),
    )?);

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
        .target(env_logger::Target::Pipe(log_file))
        .init();

    Ok(())
}
