pub mod chain;
pub mod filter;
pub mod manual_approval;
pub mod message_log;

use std::sync::Arc;

use anyhow::Result;
use serde::{Deserialize, Serialize};

use crate::message_interceptor::MessageInterceptor;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GuardProfile {
    pub profile_name: String,
    pub primary_message_interceptor: MessageInterceptorGuardConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
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

pub fn load_guard_profile(namespace: &str, profile_name: &str) -> Result<Option<GuardProfile>> {
    let json_str = if namespace == "mcp-guardian" {
        match profile_name {
            "default" => include_str!("./guard_profile/profiles/default.json"),
            _ => return Ok(None),
        }
    } else {
        todo!()
    };

    let guard_profile = serde_json::from_str::<GuardProfile>(json_str)?;

    Ok(Some(guard_profile))
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

        assert_eq!(guard_profile.profile_name, profile_name);

        let _ = guard_profile
            .primary_message_interceptor
            .try_into_message_interceptor("test".to_owned())
            .unwrap();
    }
}
