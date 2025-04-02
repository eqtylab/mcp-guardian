use std::sync::Arc;

use anyhow::Result;
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;
use ts_rs::TS;

use crate::message_interceptor::{manual_approval::ManualApprovalInterceptor, MessageInterceptor};

#[derive(Debug, Clone, Serialize, Deserialize, TS, JsonSchema)]
#[ts(export)]
pub struct ManualApprovalGuardConfig {}

impl ManualApprovalGuardConfig {
    pub fn try_into_message_interceptor(
        self,
        mcp_server_name: String,
    ) -> Result<Arc<dyn MessageInterceptor>> {
        let _ = mcp_server_name;

        let interceptor = Arc::new(ManualApprovalInterceptor::new(mcp_server_name));

        Ok(interceptor)
    }
}
