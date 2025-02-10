use anyhow::Result;
use async_trait::async_trait;
use log::{log, Level};

use crate::{
    message::{Message, MessageDirection},
    message_interceptor::{
        MessageInterceptor, MessageInterceptorAction, MessageInterceptorAction::Send,
    },
};
pub struct MessageLogInterceptor {
    pub log_level: Level,
}

impl MessageLogInterceptor {
    pub fn new(log_level: Level) -> Self {
        Self { log_level }
    }
}

#[async_trait]
impl MessageInterceptor for MessageLogInterceptor {
    async fn intercept_message(
        &self,
        direction: MessageDirection,
        message: Message,
    ) -> Result<MessageInterceptorAction> {
        let Self { log_level } = self;

        let log_prefix = message.log_prefix();
        let raw_msg = message.raw_msg();

        log!(*log_level, "{direction} | {log_prefix} | {raw_msg}");

        Ok(Send(message))
    }
}
