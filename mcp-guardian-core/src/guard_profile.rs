pub mod chain;
pub mod filter;
pub mod manual_approval;
pub mod message_log;
pub mod profiles;

use std::{fs, sync::Arc};

use anyhow::{anyhow, bail, Result};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::{
    dirs::AppSubDir::GuardProfiles,
    guard_profile::profiles::{CORE_NAMESPACE, CORE_PROFILES},
    message_interceptor::MessageInterceptor,
};

#[derive(Debug, Clone, Serialize, Deserialize, TS, JsonSchema)]
#[ts(export)]
#[schemars(description = "Configuration for a Guardian profile that controls message interception")]
pub struct GuardProfile {
    /// The primary message interceptor configuration that handles the interception logic
    #[schemars(description = "The primary message interceptor configuration that handles the interception logic")]
    pub primary_message_interceptor: MessageInterceptorGuardConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS, JsonSchema)]
#[serde(tag = "type")]
#[ts(export)]
#[schemars(description = "Different types of message interceptors that can be configured")]
pub enum MessageInterceptorGuardConfig {
    /// Chain multiple interceptors together
    #[schemars(description = "Chain multiple interceptors together in sequence")]
    Chain(chain::ChainGuardConfig),
    
    /// Filter messages based on conditions
    #[schemars(description = "Filter messages based on pattern matching and conditions")]
    Filter(filter::FilterGuardConfig),
    
    /// Log messages to a file or console
    #[schemars(description = "Log messages to a file for auditing and debugging")]
    MessageLog(message_log::MessageLogGuardConfig),
    
    /// Require manual approval for messages
    #[schemars(description = "Require manual user approval for messages before they are processed")]
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

#[derive(Debug, Clone, Serialize, Deserialize, TS, JsonSchema)]
#[ts(export)]
#[schemars(description = "Named instance of a guard profile with namespace information")]
pub struct NamedGuardProfile {
    /// Namespace for organizing guard profiles (e.g., 'core', 'custom')
    #[schemars(description = "Namespace for organizing guard profiles (e.g., 'core', 'custom')")]
    pub namespace: String,
    
    /// Unique name of the guard profile within its namespace
    #[schemars(description = "Unique name of the guard profile within its namespace")]
    pub profile_name: String,
    
    /// The actual guard profile configuration
    #[schemars(description = "The actual guard profile configuration")]
    pub guard_profile: GuardProfile,
}

pub fn load_guard_profile(namespace: &str, profile_name: &str) -> Result<Option<GuardProfile>> {
    log::info!("Loading guard profile '{profile_name}'.");

    let json_str = if namespace == CORE_NAMESPACE {
        if let Some(json_str) = CORE_PROFILES
            .iter()
            .find(|(name, _)| name == &profile_name)
            .map(|(_, json_str)| *json_str)
        {
            json_str.to_owned()
        } else {
            return Ok(None);
        }
    } else {
        let file_path = GuardProfiles
            .path()?
            .join(namespace)
            .join(format!("{profile_name}.json",));

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
    if namespace == CORE_NAMESPACE {
        log::error!("Failed to save guard profile. The `{CORE_NAMESPACE}` namespace is reserved for built-in guard profiles.");
        bail!("Failed to save guard profile. The `{CORE_NAMESPACE}` namespace is reserved for built-in guard profiles.")
    }

    log::info!("Saving guard profile '{profile_name}'.");

    let json_str = serde_json::to_string_pretty(guard_profile)?;

    let dir_path = GuardProfiles.path()?.join(namespace);
    let file_path = dir_path.join(format!("{}.json", profile_name));

    fs::create_dir_all(&dir_path)?;
    fs::write(&file_path, json_str)?;

    log::info!("guard profile saved to '{file_path:?}'.");

    Ok(())
}

pub fn list_guard_profiles() -> Result<Vec<NamedGuardProfile>> {
    log::info!("Getting guard profiles");
    let mut profiles = vec![];

    for (profile_name, json_str) in CORE_PROFILES {
        profiles.push(NamedGuardProfile {
            namespace: CORE_NAMESPACE.to_owned(),
            profile_name: (*profile_name).to_owned(),
            guard_profile: serde_json::from_str(json_str)?,
        });
    }

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

    log::info!("Found {} guard profiles.", profiles.len());

    Ok(profiles)
}

pub fn delete_guard_profile(namespace: &str, profile_name: &str) -> Result<()> {
    log::info!("Deleting guard profile {namespace}.{profile_name}");

    if namespace == CORE_NAMESPACE {
        log::error!("Unable to delete built-in guard profiles");
        bail!("Unable to delete built-in guard profiles")
    }

    let dir_path = GuardProfiles.path()?.join(namespace);
    let file_path = dir_path.join(format!("{}.json", profile_name));

    if !(fs::exists(&file_path)?) {
        log::warn!("Guard profile '{}' does not exist.", file_path.display());
        return Err(anyhow!("The guard profile was not found"));
    }

    log::info!("Deleting guard profile file: {}", file_path.display());
    fs::remove_file(&file_path)?;

    log::info!(
        "Guard profile '{}' deleted successfully.",
        file_path.display()
    );

    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_load_all_core_guard_profile() {
        for (_, json_str) in CORE_PROFILES {
            let guard_profile = serde_json::from_str::<GuardProfile>(json_str).unwrap();

            let _ = guard_profile
                .primary_message_interceptor
                .try_into_message_interceptor("test".to_owned())
                .unwrap();
        }
    }
}
