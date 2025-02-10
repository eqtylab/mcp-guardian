pub mod chain;
pub mod filter;
pub mod manual_approval;
pub mod message_log;

use anyhow::Result;
use async_trait::async_trait;

use crate::message::{
    Message, MessageDirection,
    MessageDirection::{Inbound, Outbound},
};

#[derive(Clone)]
pub enum MessageInterceptorAction {
    Send(Message),
    Drop,
}

#[async_trait]
pub trait MessageInterceptor: Send + Sync {
    async fn intercept_message(
        &self,
        direction: MessageDirection,
        message: Message,
    ) -> Result<MessageInterceptorAction>;

    async fn intercept_outbound_message(
        &self,
        message: Message,
    ) -> Result<MessageInterceptorAction> {
        self.intercept_message(Outbound, message).await
    }

    async fn intercept_inbound_message(
        &self,
        message: Message,
    ) -> Result<MessageInterceptorAction> {
        self.intercept_message(Inbound, message).await
    }
}
