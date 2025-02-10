use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;

use crate::{
    message::{Message, MessageDirection},
    message_interceptor::{
        MessageInterceptor, MessageInterceptorAction,
        MessageInterceptorAction::{Drop, Send},
    },
};
pub struct ChainInterceptor {
    pub interceptors: Vec<Arc<dyn MessageInterceptor>>,
}

impl ChainInterceptor {
    pub fn new(interceptors: Vec<Arc<dyn MessageInterceptor>>) -> Self {
        Self { interceptors }
    }
}

#[async_trait]
impl MessageInterceptor for ChainInterceptor {
    async fn intercept_message(
        &self,
        direction: MessageDirection,
        message: Message,
    ) -> Result<MessageInterceptorAction> {
        let Self { interceptors } = self;

        let mut message = message;

        for interceptor in interceptors {
            match interceptor.intercept_message(direction, message).await? {
                Send(new_message) => message = new_message,
                Drop => return Ok(Drop),
            }
        }

        Ok(Send(message))
    }
}
