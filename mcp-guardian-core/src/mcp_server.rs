use std::{collections::HashMap, fs};

use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::dirs::AppSubDir::McpServers;

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct McpServer {
    pub cmd: String,
    pub args: Vec<String>,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    #[ts(skip)]
    pub env: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct NamedMcpServer {
    pub namespace: String,
    pub name: String,
    pub mcp_server: McpServer,
}

pub fn load_mcp_server(namespace: &str, name: &str) -> Result<Option<McpServer>> {
    let file_path = McpServers
        .path()?
        .join(namespace)
        .join(format!("{}.json", name));

    if !file_path.exists() {
        return Ok(None);
    }

    let mcp_server = fs::read_to_string(&file_path)?;
    let mcp_server = serde_json::from_str::<McpServer>(&mcp_server)?;

    Ok(Some(mcp_server))
}

pub fn save_mcp_server(namespace: &str, name: &str, mcp_server: &McpServer) -> Result<()> {
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
        return Err(anyhow!("MCP server file {} does not exist.", file_path.display()));
    }

    fs::remove_file(&file_path)?;

    log::info!("MCP server '{}' deleted successfully.", file_path.display());

    Ok(())
}
