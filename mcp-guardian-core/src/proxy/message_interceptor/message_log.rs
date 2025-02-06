use anyhow::Result;
use async_trait::async_trait;
use log::{log, Level};

use crate::proxy::{
    message::{Message, MessageDirection},
    message_interceptor::{
        MessageInterceptor, MessageInterceptorAction, MessageInterceptorAction::Send,
    },
};
pub struct MessageLogInterceptor {
    pub log_level: Level,
    pub mcp_server_name: String,
}

impl MessageLogInterceptor {
    pub fn new(log_level: Level, mcp_server_name: String) -> Self {
        Self {
            log_level,
            mcp_server_name,
        }
    }
}

#[async_trait]
impl MessageInterceptor for MessageLogInterceptor {
    async fn intercept_message(
        &self,
        direction: MessageDirection,
        message: Message,
    ) -> Result<MessageInterceptorAction> {
        let Self {
            log_level,
            mcp_server_name,
        } = self;

        let log_prefix = message.log_prefix();
        let raw_msg = message.raw_msg();

        log!(
            *log_level,
            "{direction} | {mcp_server_name} | {log_prefix} | {raw_msg}"
        );

        Ok(Send(message))
    }
}
