use std::fs;

use anyhow::Result;
use mcp_guardian_core::server_collection::{NamedServerCollection, ServerCollection};

use crate::cli;

pub fn cmd(args: cli::server_collections::Args) -> anyhow::Result<()> {
    let cli::server_collections::Args { cmd } = args;

    match cmd {
        cli::server_collections::SubCommand::Delete(args) => delete(args)?,
        cli::server_collections::SubCommand::Get(args) => get(args)?,
        cli::server_collections::SubCommand::Set(args) => set(args)?,
        cli::server_collections::SubCommand::List(args) => list(args)?,
        cli::server_collections::SubCommand::ExportClaudeConfig(args) => {
            export_claude_config(args)?
        }
        cli::server_collections::SubCommand::ApplyClaudeConfig(args) => apply_claude_config(args)?,
    }

    Ok(())
}

fn delete(args: cli::server_collections::delete::Args) -> Result<()> {
    let cli::server_collections::delete::Args { namespace, name } = args;
    mcp_guardian_core::server_collection::delete_server_collection(&namespace, &name)
}

fn get(args: cli::server_collections::get::Args) -> Result<()> {
    let cli::server_collections::get::Args { namespace, name } = args;

    let server_collection =
        mcp_guardian_core::server_collection::load_server_collection(&namespace, &name)?
            .ok_or_else(|| anyhow::anyhow!("mcp-server not found."))?;

    let server_collection = serde_json::to_string_pretty(&server_collection)?;

    println!("{server_collection}");

    Ok(())
}

fn set(args: cli::server_collections::set::Args) -> Result<()> {
    let cli::server_collections::set::Args {
        namespace,
        name,
        path,
    } = args;

    let server_collection = fs::read_to_string(&path)?;
    let server_collection = serde_json::from_str::<ServerCollection>(&server_collection)?;

    mcp_guardian_core::server_collection::save_server_collection(
        &namespace,
        &name,
        &server_collection,
    )?;

    Ok(())
}

fn list(args: cli::server_collections::list::Args) -> Result<()> {
    let _ = args;

    let server_collections = mcp_guardian_core::server_collection::list_server_collections()?;

    for NamedServerCollection {
        namespace, name, ..
    } in server_collections
    {
        println!("{namespace}.{name}");
    }

    Ok(())
}

fn export_claude_config(args: cli::server_collections::export_claude_config::Args) -> Result<()> {
    let cli::server_collections::export_claude_config::Args {
        namespace,
        name,
        proxy_path,
    } = args;

    let claude_config =
        mcp_guardian_core::server_collection::claude_config::generate_claude_config_for_server_collection(
            &namespace,
            &name,
            proxy_path,
        )?;

    let claude_config = serde_json::to_string_pretty(&claude_config)?;

    println!("{claude_config}");

    Ok(())
}

fn apply_claude_config(args: cli::server_collections::apply_claude_config::Args) -> Result<()> {
    let cli::server_collections::apply_claude_config::Args {
        namespace,
        name,
        proxy_path,
    } = args;

    mcp_guardian_core::server_collection::claude_config::apply_claude_config_for_server_collection(
        &namespace, &name, proxy_path,
    )?;

    println!("Claude Desktop config applied for '{namespace}.{name}'.");

    Ok(())
}
