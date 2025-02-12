use std::sync::Arc;

use anyhow::{bail, Result};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::message_interceptor::{message_log::MessageLogInterceptor, MessageInterceptor};

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct MessageLogGuardConfig {
    pub log_level: String,
}

impl MessageLogGuardConfig {
    pub fn try_into_message_interceptor(
        self,
        mcp_server_name: String,
    ) -> Result<Arc<dyn MessageInterceptor>> {
        let _ = mcp_server_name;

        let log_level = match self.log_level.as_str() {
            "Error" => log::Level::Error,
            "Warn" => log::Level::Warn,
            "Info" => log::Level::Info,
            "Debug" => log::Level::Debug,
            "Trace" => log::Level::Trace,
            _ => bail!("Invalid log level"),
        };

        let interceptor = Arc::new(MessageLogInterceptor::new(log_level));

        Ok(interceptor)
    }
}
