pub mod servers;

use std::{collections::HashMap, fs};

use anyhow::{anyhow, bail, Result};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{
    dirs::AppSubDir::McpServers,
    mcp_server::servers::{CORE_NAMESPACE, CORE_SERVERS},
    server_collection::claude_config::{ClaudeConfig, ClaudeMcpServer},
};

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct McpServer {
    pub cmd: String,
    pub args: Vec<String>,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    #[ts(skip)]
    pub env: HashMap<String, String>,
}

impl From<&ClaudeMcpServer> for McpServer {
    fn from(value: &ClaudeMcpServer) -> Self {
        McpServer {
            cmd: value.command.clone(),
            args: value.args.clone(),
            env: value.env.clone(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct NamedMcpServer {
    pub namespace: String,
    pub name: String,
    pub mcp_server: McpServer,
}

pub fn load_mcp_server(namespace: &str, name: &str) -> Result<Option<McpServer>> {
    log::info!("Loading MCP server '{name}'.");

    let json_str = if namespace == CORE_NAMESPACE {
        if let Some(json_str) = CORE_SERVERS
            .iter()
            .find(|(n, _)| n == &name)
            .map(|(_, json_str)| *json_str)
        {
            json_str.to_owned()
        } else {
            return Ok(None);
        }
    } else {
        let file_path = McpServers
            .path()?
            .join(namespace)
            .join(format!("{}.json", name));

        if !file_path.exists() {
            return Ok(None);
        }

        fs::read_to_string(&file_path)?
    };

    let mcp_server = serde_json::from_str::<McpServer>(&json_str)?;

    Ok(Some(mcp_server))
}

pub fn save_mcp_server(namespace: &str, name: &str, mcp_server: &McpServer) -> Result<()> {
    if namespace == CORE_NAMESPACE {
        log::error!("Failed to save MCP server. The `{CORE_NAMESPACE}` namespace is reserved for built-in MCP servers.");
        bail!("Failed to save MCP server. The `{CORE_NAMESPACE}` namespace is reserved for built-in MCP servers.")
    }

    log::info!("Saving MCP server '{name}'.");
    let json_str = serde_json::to_string_pretty(mcp_server)?;

    let dir_path = McpServers.path()?.join(namespace);
    let file_path = dir_path.join(format!("{}.json", name));

    fs::create_dir_all(&dir_path)?;
    fs::write(&file_path, json_str)?;

    Ok(())
}

pub fn list_mcp_servers() -> Result<Vec<NamedMcpServer>> {
    log::info!("Listing MCP servers.");
    let mut mcp_servers = Vec::new();

    for (name, json_str) in CORE_SERVERS {
        mcp_servers.push(NamedMcpServer {
            namespace: CORE_NAMESPACE.to_owned(),
            name: (*name).to_owned(),
            mcp_server: serde_json::from_str(json_str)?,
        });
    }

    for entry in fs::read_dir(McpServers.path()?)? {
        let entry = entry?;
        let namespace_dir = entry.path();

        if !namespace_dir.is_dir() {
            log::warn!(
                "Encountered non-directory entry in mcp-servers directory: {namespace_dir:?}"
            );
            continue;
        }

        let namespace_str = namespace_dir
            .file_name()
            .ok_or_else(|| anyhow!("Failed to get file name."))?
            .to_str()
            .ok_or_else(|| anyhow!("Failed to convert file name to string."))?;

        for entry in fs::read_dir(&namespace_dir)? {
            let entry = entry?;
            let file_path = entry.path();

            if !file_path.is_file() {
                log::warn!(
                    "Encountered non-file entry in mcp-servers namespace directory: {file_path:?}"
                );
                continue;
            }

            let name = file_path
                .file_stem()
                .ok_or_else(|| anyhow!("Failed to get file stem."))?
                .to_str()
                .ok_or_else(|| anyhow!("Failed to convert file stem to string."))?;

            let mcp_server = load_mcp_server(namespace_str, name)?.ok_or_else(|| {
                anyhow!("Failed to load mcp server that should exist: {namespace_str}.{name}")
            })?;

            mcp_servers.push(NamedMcpServer {
                namespace: namespace_str.to_owned(),
                name: name.to_owned(),
                mcp_server,
            });
        }
    }

    log::info!("Found {} mcp servers.", mcp_servers.len());
    Ok(mcp_servers)
}

pub fn delete_mcp_server(namespace: &str, name: &str) -> Result<()> {
    log::info!("Deleting MCP server '{namespace}.{name}'.");

    let dir_path = McpServers.path()?.join(namespace);
    let file_path = dir_path.join(format!("{}.json", name));

    if !(fs::exists(&file_path)?) {
        log::error!("MCP server file {} does not exist.", file_path.display());
        return Err(anyhow!(
            "MCP server file {} does not exist.",
            file_path.display()
        ));
    }

    fs::remove_file(&file_path)?;

    log::info!("MCP server '{}' deleted successfully.", file_path.display());

    Ok(())
}

/// Saves every mcp server defined in the ClaudeConfig to the claude-import namespace
pub fn save_claude_config(claude_config: &ClaudeConfig) -> Result<()> {
    claude_config
        .mcp_servers
        .iter()
        .try_for_each(|(name, config)| {
            log::info!("Saving Claude mcp server '{name}'");
            save_mcp_server("claude-import", name, &config.into())
        })?;

    Ok(())
}
