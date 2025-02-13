use anyhow::Result;
use clap::Parser;
use mcp_guardian_cli::{cli, guard_profiles, mcp_servers, server_collections};

#[tokio::main]
async fn main() -> Result<()> {
    let cli::Args { cmd } = cli::Args::parse();

    mcp_guardian_core::init("mcp-guardian-cli")?;

    match cmd {
        cli::SubCommand::GuardProfiles(args) => guard_profiles::cmd(args)?,
        cli::SubCommand::McpServers(args) => mcp_servers::cmd(args)?,
        cli::SubCommand::ServerCollections(args) => server_collections::cmd(args)?,
    }

    Ok(())
}
