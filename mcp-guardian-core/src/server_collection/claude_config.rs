use std::{collections::HashMap, fs, fs::File, io::BufReader, path::PathBuf};

use anyhow::{anyhow, bail, Result};
use serde::{Deserialize, Serialize};

use crate::server_collection::{load_server_collection, Server};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClaudeConfig {
    pub mcp_servers: HashMap<String, ClaudeMcpServer>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClaudeMcpServer {
    pub command: String,
    pub args: Vec<String>,
    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub env: HashMap<String, String>,
}

pub fn generate_claude_config_for_server_collection(
    namespace: &str,
    name: &str,
    proxy_path: Option<PathBuf>,
) -> Result<ClaudeConfig> {
    log::info!("Getting server collections for {namespace}.{name}");
    let server_collection = load_server_collection(namespace, name)?
        .ok_or_else(|| anyhow!("Server collection not found"))?;

    let mut mcp_servers = HashMap::new();

    for Server {
        mcp_server,
        guard_profile,
    } in server_collection.servers
    {
        let [namespace, name] = &mcp_server.split('.').collect::<Vec<_>>()[..] else {
            bail!("Invalid mcp-server format");
        };

        let command = match proxy_path.clone() {
            Some(proxy_path) => proxy_path.to_string_lossy().to_string(),
            None => "mcp-guardian-proxy".to_owned(),
        };
        let args = vec![
            "--mcp-server".to_owned(),
            format!("{namespace}.{name}"),
            "--guard-profile".to_owned(),
            guard_profile,
        ];

        mcp_servers.insert(
            (*name).to_owned(),
            ClaudeMcpServer {
                command,
                args,
                env: HashMap::new(),
            },
        );
    }

    log::info!("{} server collections found.", mcp_servers.keys().len());

    Ok(ClaudeConfig { mcp_servers })
}

pub fn apply_claude_config_for_server_collection(
    namespace: &str,
    name: &str,
    proxy_path: Option<PathBuf>,
) -> Result<()> {
    log::info!("Applying server configuration to Claude");
    let claude_config = generate_claude_config_for_server_collection(namespace, name, proxy_path)?;
    let claude_config = serde_json::to_string_pretty(&claude_config)?;

    // This should work on Linux, MacOS, and Windows
    //
    // linux:    ~/.config/Claude/claude_desktop_config.json
    // macos:    ~/Library/Application Support/Claude/claude_desktop_config.json
    // windows:  %APPDATA%\Roaming\Claude\claude_desktop_config.json
    let claude_config_dir = dirs::config_dir()
        .ok_or_else(|| anyhow!("Failed to determine config directory."))?
        .join("Claude");

    if !(fs::exists(&claude_config_dir)?) {
        let err = "The Claude desktop config directory was not found.";
        log::error!("{err}");
        return Err(anyhow!(err));
    }

    let claude_config_path = claude_config_dir.join("claude_desktop_config.json");

    if fs::exists(&claude_config_path)? {
        log::info!("Backing up current claude config");
        let backup_path = claude_config_path.with_file_name(format!(
            "claude_desktop_config.json.{}.bk",
            chrono::Local::now().format("%Y%m%d%H%M%S")
        ));

        fs::rename(&claude_config_path, &backup_path)?;
        log::info!(
            "Current configuration backed up to {}",
            backup_path.display()
        );
    }

    fs::write(claude_config_path, claude_config)?;

    log::info!("Claude server configuration update complete.");

    Ok(())
}

pub fn import_claude_config() -> Result<ClaudeConfig> {
    let claude_config_dir = dirs::config_dir()
        .ok_or_else(|| anyhow!("Failed to determine config directory."))?
        .join("Claude");

    if !(fs::exists(&claude_config_dir)?) {
        let err = "The Claude desktop config directory was not found.";
        log::error!("{err}");
        return Err(anyhow!(err));
    }

    let claude_config_path = claude_config_dir.join("claude_desktop_config.json");

    if !(fs::exists(&claude_config_path)?) {
        log::error!(
            "The Claude config '{}' does not exist",
            claude_config_path.display()
        );
        return Err(anyhow!("The Claude config does not exist"));
    }

    let file = File::open(claude_config_path)?;
    let reader = BufReader::new(file);
    let claude_config = serde_json::from_reader(reader)?;

    log::info!("Claude config loaded: {claude_config:?}");

    Ok(claude_config)
}
