pub mod chain;
pub mod filter;
pub mod manual_approval;
pub mod message_log;

use std::{fs, sync::Arc};

use anyhow::{anyhow, bail, Result};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{dirs::AppSubDir::GuardProfiles, message_interceptor::MessageInterceptor};

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct GuardProfile {
    pub primary_message_interceptor: MessageInterceptorGuardConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(tag = "type")]
#[ts(export)]
pub enum MessageInterceptorGuardConfig {
    Chain(chain::ChainGuardConfig),
    Filter(filter::FilterGuardConfig),
    MessageLog(message_log::MessageLogGuardConfig),
    ManualApproval(manual_approval::ManualApprovalGuardConfig),
}

impl MessageInterceptorGuardConfig {
    pub fn try_into_message_interceptor(
        self,
        mcp_server_name: String,
    ) -> Result<Arc<dyn MessageInterceptor>> {
        let message_interceptor = match self {
            MessageInterceptorGuardConfig::Chain(config) => {
                config.try_into_message_interceptor(mcp_server_name)?
            }
            MessageInterceptorGuardConfig::Filter(config) => {
                config.try_into_message_interceptor(mcp_server_name)?
            }
            MessageInterceptorGuardConfig::MessageLog(config) => {
                config.try_into_message_interceptor(mcp_server_name)?
            }
            MessageInterceptorGuardConfig::ManualApproval(config) => {
                config.try_into_message_interceptor(mcp_server_name)?
            }
        };

        Ok(message_interceptor)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct NamedGuardProfile {
    pub namespace: String,
    pub profile_name: String,
    pub guard_profile: GuardProfile,
}

pub fn load_guard_profile(namespace: &str, profile_name: &str) -> Result<Option<GuardProfile>> {
    let json_str = if namespace == "mcp-guardian" {
        // TODO: one source of truth for default guard profiles (also needed by `list_guard_profiles`)
        match profile_name {
            "default" => include_str!("./guard_profile/profiles/default.json").to_owned(),
            "log-only" => include_str!("./guard_profile/profiles/log-only.json").to_owned(),
            _ => return Ok(None),
        }
    } else {
        let file_path = GuardProfiles
            .path()?
            .join(namespace)
            .join(format!("{}.json", profile_name));

        if !file_path.exists() {
            return Ok(None);
        }

        fs::read_to_string(&file_path)?
    };

    let guard_profile = serde_json::from_str::<GuardProfile>(&json_str)?;

    Ok(Some(guard_profile))
}

pub fn save_guard_profile(
    namespace: &str,
    profile_name: &str,
    guard_profile: &GuardProfile,
) -> Result<()> {
    if namespace == "mcp-guardian" {
        bail!("Failed to save guard profile. The `mcp-guardian` namespace is reserved for built-in guard profiles.")
    }

    let json_str = serde_json::to_string_pretty(guard_profile)?;

    let dir_path = GuardProfiles.path()?.join(namespace);
    let file_path = dir_path.join(format!("{}.json", profile_name));

    fs::create_dir_all(&dir_path)?;
    fs::write(&file_path, json_str)?;

    Ok(())
}

pub fn list_guard_profiles() -> Result<Vec<NamedGuardProfile>> {
    let mut profiles = vec![];

    // TODO: one source of truth for default guard profiles (also needed by `load_guard_profile`)
    profiles.push(NamedGuardProfile {
        namespace: "mcp-guardian".to_owned(),
        profile_name: "default".to_owned(),
        guard_profile: load_guard_profile("mcp-guardian", "default")?.ok_or_else(|| {
            anyhow!("Failed to load guard profile that should exist: mcp-guardian.default")
        })?,
    });
    profiles.push(NamedGuardProfile {
        namespace: "mcp-guardian".to_owned(),
        profile_name: "log-only".to_owned(),
        guard_profile: load_guard_profile("mcp-guardian", "log-only")?.ok_or_else(|| {
            anyhow!("Failed to load guard profile that should exist: mcp-guardian.log-only")
        })?,
    });

    for entry in fs::read_dir(GuardProfiles.path()?)? {
        let entry = entry?;
        let namespace_dir = entry.path();

        if !namespace_dir.is_dir() {
            log::warn!(
                "Encountered non-directory entry in guard-profiles directory: {:?}",
                namespace_dir
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
                    "Encountered non-file entry in guard-profiles namespace directory: {:?}",
                    file_path
                );
                continue;
            }

            let profile_name = file_path
                .file_stem()
                .ok_or_else(|| anyhow!("Failed to get file stem."))?
                .to_str()
                .ok_or_else(|| anyhow!("Failed to convert file stem to string."))?;

            let guard_profile =
                load_guard_profile(namespace_str, profile_name)?.ok_or_else(|| {
                    anyhow!(
                "Failed to load guard profile that should exist: {namespace_str}.{profile_name}"
            )
                })?;

            profiles.push(NamedGuardProfile {
                namespace: namespace_str.to_owned(),
                profile_name: profile_name.to_owned(),
                guard_profile,
            });
        }
    }

    Ok(profiles)
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_load_guard_profile_default() {
        let profile_name = "default";

        let guard_profile = load_guard_profile("mcp-guardian", profile_name)
            .unwrap()
            .unwrap();

        let _ = guard_profile
            .primary_message_interceptor
            .try_into_message_interceptor("test".to_owned())
            .unwrap();
    }
}
