pub mod claude_config;

use std::fs;

use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::dirs::AppSubDir::ServerCollections;

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct ServerCollection {
    pub servers: Vec<Server>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Server {
    pub mcp_server: String,
    pub guard_profile: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct NamedServerCollection {
    pub namespace: String,
    pub name: String,
    pub server_collection: ServerCollection,
}

pub fn load_server_collection(namespace: &str, name: &str) -> Result<Option<ServerCollection>> {
    log::info!("Loading server collections.");
    let file_path = ServerCollections
        .path()?
        .join(namespace)
        .join(format!("{}.json", name));

    if !file_path.exists() {
        return Ok(None);
    }

    let server_collection = fs::read_to_string(&file_path)?;
    let server_collection = serde_json::from_str::<ServerCollection>(&server_collection)?;

    log::info!(
        "{} servers found in collection '{name}'.",
        server_collection.servers.len()
    );

    Ok(Some(server_collection))
}

pub fn save_server_collection(
    namespace: &str,
    name: &str,
    server_collection: &ServerCollection,
) -> Result<()> {
    log::info!("Saving server collection.");
    let json_str = serde_json::to_string_pretty(server_collection)?;

    let dir_path = ServerCollections.path()?.join(namespace);
    let file_path = dir_path.join(format!("{}.json", name));
    log::info!("Server collection saved to {file_path:?}.");

    fs::create_dir_all(&dir_path)?;
    fs::write(&file_path, json_str)?;

    Ok(())
}

pub fn list_server_collections() -> Result<Vec<NamedServerCollection>> {
    log::info!("Getting server collections");
    let mut server_collections = Vec::new();

    for entry in fs::read_dir(ServerCollections.path()?)? {
        let entry = entry?;
        let namespace_dir = entry.path();

        if !namespace_dir.is_dir() {
            log::warn!(
                "Encountered non-directory entry in server-collections directory: {namespace_dir:?}"
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
                    "Encountered non-file entry in server-collections namespace directory: {file_path:?}"
                );
                continue;
            }

            let name = file_path
                .file_stem()
                .ok_or_else(|| anyhow!("Failed to get file stem."))?
                .to_str()
                .ok_or_else(|| anyhow!("Failed to convert file stem to string."))?;

            let server_collection =
                load_server_collection(namespace_str, name)?.ok_or_else(|| {
                    anyhow!(
                        "Failed to load server collection that should exist: {namespace_str}.{name}"
                    )
                })?;

            server_collections.push(NamedServerCollection {
                namespace: namespace_str.to_owned(),
                name: name.to_owned(),
                server_collection,
            });
        }
    }

    Ok(server_collections)
}

pub fn delete_server_collection(namespace: &str, name: &str) -> Result<()> {
    log::info!("Deleting server collection {namespace}.{name}");

    let file_path = ServerCollections
        .path()?
        .join(namespace)
        .join(format!("{}.json", name));

    if !file_path.exists() {
        return Err(anyhow!(
            "Server collection {} does not exist",
            file_path.display()
        ));
    }

    fs::remove_file(&file_path)?;

    log::info!(
        "Server collection '{}' deleted successfull.",
        file_path.display()
    );
    Ok(())
}
