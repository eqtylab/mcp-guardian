use anyhow::{bail, Result};
use clap::Parser;
use mcp_guardian_core::proxy::proxy_mcp_server;
use mcp_guardian_proxy::cli;

#[tokio::main]
async fn main() -> Result<()> {
    let cli::Args {
        name,
        host_session_id,
        cmd,
    } = cli::Args::parse();

    mcp_guardian_core::dirs::create_all_dirs()?;

    let [command, args @ ..] = &cmd[..] else {
        bail!("No MCP server command provided.");
    };

    let args = args.iter().map(String::as_str).collect::<Vec<_>>();

    if let Err(e) = proxy_mcp_server(name, host_session_id, command, &args).await {
        eprint!("Error starting MCP server: {e}");
    }

    Ok(())
}
