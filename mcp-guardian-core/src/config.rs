use anyhow::Result;
use clap::crate_version;
use serde::{Deserialize, Serialize};

use crate::APP_NAME;

#[derive(Serialize, Deserialize)]
pub struct Config {
    version: String,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            version: crate_version!().to_owned(),
        }
    }
}

pub fn load() -> Result<Config> {
    let config = confy::load(APP_NAME, None)?;

    Ok(config)
}

pub fn save(config: Config) -> Result<()> {
    confy::store(APP_NAME, None, config)?;

    Ok(())
}
