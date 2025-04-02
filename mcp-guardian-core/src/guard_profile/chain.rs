use std::sync::Arc;

use anyhow::Result;
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;
use ts_rs::TS;

use crate::{
    guard_profile::MessageInterceptorGuardConfig,
    message_interceptor::{chain::ChainInterceptor, MessageInterceptor},
};

#[derive(Debug, Clone, Serialize, Deserialize, TS, JsonSchema)]
#[ts(export)]
pub struct ChainGuardConfig {
    pub chain: Vec<MessageInterceptorGuardConfig>,
}

impl ChainGuardConfig {
    pub fn try_into_message_interceptor(
        self,
        mcp_server_name: String,
    ) -> Result<Arc<dyn MessageInterceptor>> {
        let interceptors = self
            .chain
            .into_iter()
            .map(|config| config.try_into_message_interceptor(mcp_server_name.clone()))
            .collect::<Result<Vec<_>>>()?;

        Ok(Arc::new(ChainInterceptor::new(interceptors)))
    }
}
