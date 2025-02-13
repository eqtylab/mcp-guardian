use std::{collections::HashMap, io::Write, time::SystemTime};

use anyhow::{bail, Result};
use clap::Parser;
use humantime::format_rfc3339_millis;
use mcp_guardian_core::{mcp_server::McpServer, proxy::proxy_mcp_server};
use mcp_guardian_proxy::cli;

#[tokio::main]
async fn main() -> Result<()> {
    let cli::Args {
        name,
        host_session_id,
        guard_profile,
        mcp_server,
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

    let (command, args, env) = match (mcp_server, &cmd[..]) {
        // Using mcp-server configuration
        (Some(mcp_server), []) => {
            let [namespace, name] = &mcp_server.split('.').collect::<Vec<_>>()[..] else {
                log::error!("Invalid MCP server format. Expected \"{{namespace}}.{{name}}\".");
                bail!("Invalid MCP server format. Expected \"{{namespace}}.{{name}}\".");
            };
            let McpServer { cmd, args, env } =
                mcp_guardian_core::mcp_server::load_mcp_server(namespace, name)?
                    .ok_or_else(|| anyhow::anyhow!("MCP server not found."))?;

            (cmd, args, env)
        }
        // Using provided command
        (None, [command, args @ ..]) => (command.clone(), args.to_vec(), HashMap::new()),
        // Both provided
        (Some(_), [..]) => {
            log::error!("Cannot specify both an MCP server configuration and a command to run. Use one or the other.");
            bail!("Cannot specify both an MCP server configuration and a command to run. Use one or the other.")
        }
        // Neither provided
        (None, []) => {
            log::error!("No MCP server configuration or command provided.");
            bail!("No MCP server configuration or command provided.")
        }
    };

    log::info!("Name: {name}");
    log::info!("Command: {command}");
    log::info!("Args: {}", args.join(" "));

    let args = args.iter().map(String::as_str).collect::<Vec<_>>();

    let guard_profile = {
        let [namespace, profile_name] = &guard_profile.split('.').collect::<Vec<_>>()[..] else {
            log::error!(
                "Invalid guard profile format. Expected \"{{namespace}}.{{profile_name}}\"."
            );
            bail!("Invalid guard profile format. Expected \"{{namespace}}.{{profile_name}}\".");
        };

        mcp_guardian_core::guard_profile::load_guard_profile(namespace, profile_name)?
            .ok_or_else(|| anyhow::anyhow!("Guard profile not found."))?
    };

    let message_interceptor = guard_profile
        .primary_message_interceptor
        .try_into_message_interceptor(name.clone())?;

    let _ = env; // TODO: add env to the process

    if let Err(e) =
        proxy_mcp_server(name, host_session_id, &command, &args, message_interceptor).await
    {
        log::error!("Error starting MCP server: {e}");
        eprint!("Error starting MCP server: {e}");
    }

    Ok(())
}
