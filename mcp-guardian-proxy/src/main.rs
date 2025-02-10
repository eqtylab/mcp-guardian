use std::{io::Write, time::SystemTime};

use anyhow::{bail, Result};
use clap::Parser;
use humantime::format_rfc3339_millis;
use mcp_guardian_core::proxy::proxy_mcp_server;
use mcp_guardian_proxy::cli;

#[tokio::main]
async fn main() -> Result<()> {
    let cli::Args {
        name,
        host_session_id,
        cmd,
    } = cli::Args::parse();

    let name = name.unwrap_or("unnamed".to_owned());

    mcp_guardian_core::dirs::create_all_dirs()?;

    let log_file = Box::new(std::fs::File::create(
        mcp_guardian_core::dirs::AppSubDir::Logs
            .path()?
            .join(format!("mcp-guardian-proxy.{name}.log")),
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

    log::info!("Starting mcp-guardian-proxy");

    let [command, args @ ..] = &cmd[..] else {
        bail!("No MCP server command provided.");
    };

    log::info!("Name: {name}");
    log::info!("Command: {command}");
    log::info!("Args: {}", args.join(" "));

    let args = args.iter().map(String::as_str).collect::<Vec<_>>();

    let guard_profile =
        mcp_guardian_core::guard_profile::load_guard_profile("mcp-guardian", "default")?
            .ok_or_else(|| anyhow::anyhow!("Guard profile not found."))?;

    let message_interceptor = guard_profile
        .primary_message_interceptor
        .try_into_message_interceptor(name.clone())?;

    if let Err(e) =
        proxy_mcp_server(name, host_session_id, command, &args, message_interceptor).await
    {
        eprint!("Error starting MCP server: {e}");
    }

    Ok(())
}
