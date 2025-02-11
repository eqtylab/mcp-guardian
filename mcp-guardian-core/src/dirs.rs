use std::path::PathBuf;

use anyhow::{anyhow, Result};
use strum::VariantArray;

use crate::APP_NAME;

fn app_dir() -> Result<PathBuf> {
    let app_dir = dirs::home_dir()
        .ok_or_else(|| anyhow!("Failed to get home directory."))?
        .join(format!(".{APP_NAME}"));

    Ok(app_dir)
}

#[allow(clippy::all)]
#[derive(VariantArray)]
pub enum AppSubDir {
    Logs,
    GuardProfiles,
    McpServers,
    MessageApprovals,
    MessageApprovalsPending,
    MessageApprovalsApproved,
    MessageApprovalsDenied,
    ServerCollections,
}

impl AppSubDir {
    pub fn path(&self) -> Result<PathBuf> {
        let path = self._path(app_dir()?);

        Ok(path)
    }

    fn _path(&self, base_dir: PathBuf) -> PathBuf {
        match self {
            Self::Logs => base_dir.join("logs"),
            Self::GuardProfiles => base_dir.join("guard-profiles"),
            Self::McpServers => base_dir.join("mcp-servers"),
            Self::MessageApprovals => base_dir.join("message-approvals"),
            Self::MessageApprovalsPending => Self::MessageApprovals._path(base_dir).join("pending"),
            Self::MessageApprovalsApproved => {
                Self::MessageApprovals._path(base_dir).join("approved")
            }
            Self::MessageApprovalsDenied => Self::MessageApprovals._path(base_dir).join("denied"),
            Self::ServerCollections => base_dir.join("server-collections"),
        }
    }
}

pub fn create_all_dirs() -> Result<()> {
    for dir in AppSubDir::VARIANTS {
        std::fs::create_dir_all(dir.path()?)?;
    }

    Ok(())
}
