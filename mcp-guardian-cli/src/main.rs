use std::{io::Write, time::SystemTime};

use anyhow::Result;
use clap::Parser;
use humantime::format_rfc3339_millis;
use mcp_guardian_cli::{cli, guard_profiles, mcp_servers, server_collections};

#[tokio::main]
async fn main() -> Result<()> {
    let cli::Args { cmd } = cli::Args::parse();

    mcp_guardian_core::dirs::create_all_dirs()?;

    let log_file = Box::new(std::fs::File::create(
        mcp_guardian_core::dirs::AppSubDir::Logs
            .path()?
            .join("mcp-guardian-cli.log"),
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

    match cmd {
        cli::SubCommand::GuardProfiles(args) => guard_profiles::cmd(args)?,
        cli::SubCommand::McpServers(args) => mcp_servers::cmd(args)?,
        cli::SubCommand::ServerCollections(args) => server_collections::cmd(args)?,
    }

    Ok(())
}
