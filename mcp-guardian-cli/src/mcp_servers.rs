use std::fs;

use anyhow::Result;
use mcp_guardian_core::mcp_server::{McpServer, NamedMcpServer};

use crate::cli;

pub fn cmd(args: cli::mcp_servers::Args) -> anyhow::Result<()> {
    let cli::mcp_servers::Args { cmd } = args;

    match cmd {
        cli::mcp_servers::SubCommand::Get(args) => get(args)?,
        cli::mcp_servers::SubCommand::Set(args) => set(args)?,
        cli::mcp_servers::SubCommand::List(args) => list(args)?,
    }

    Ok(())
}

fn get(args: cli::mcp_servers::get::Args) -> Result<()> {
    let cli::mcp_servers::get::Args { namespace, name } = args;

    let mcp_server = mcp_guardian_core::mcp_server::load_mcp_server(&namespace, &name)?
        .ok_or_else(|| anyhow::anyhow!("mcp-server not found."))?;

    let mcp_server = serde_json::to_string_pretty(&mcp_server)?;

    println!("{mcp_server}");

    Ok(())
}

fn set(args: cli::mcp_servers::set::Args) -> Result<()> {
    let cli::mcp_servers::set::Args {
        namespace,
        name,
        path,
    } = args;

    let mcp_server = fs::read_to_string(&path)?;
    let mcp_server = serde_json::from_str::<McpServer>(&mcp_server)?;

    mcp_guardian_core::mcp_server::save_mcp_server(&namespace, &name, &mcp_server)?;

    Ok(())
}

fn list(args: cli::mcp_servers::list::Args) -> Result<()> {
    let _ = args;

    let mcp_servers = mcp_guardian_core::mcp_server::list_mcp_servers()?;

    for NamedMcpServer {
        namespace, name, ..
    } in mcp_servers
    {
        println!("{namespace}.{name}");
    }

    Ok(())
}
