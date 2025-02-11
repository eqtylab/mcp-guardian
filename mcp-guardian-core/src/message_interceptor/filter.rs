use std::sync::Arc;

use anyhow::{bail, Result};
use async_trait::async_trait;
use serde_json::Value;
use MessageInterceptorAction::{Drop, Send};

use crate::{
    message::{Message, MessageDirection, MessageType},
    message_interceptor::{MessageInterceptor, MessageInterceptorAction},
    request_cache::RequestCache,
};

pub enum FilterLogic {
    /// Include messages that match the specified direction
    Direction(MessageDirection),
    /// Include messages that match the specified message type
    MessageType(MessageType),
    /// Include request and response messages with the specified method call
    RequestMethod(String),
    /// Include messages that match all of the specified filters
    And(Vec<FilterLogic>),
    /// Include messages that match any of the specified filters
    Or(Vec<FilterLogic>),
    /// Exclude messages that match the specified filter
    Not(Box<FilterLogic>),
}

impl FilterLogic {
    pub fn matches(
        &self,
        direction: MessageDirection,
        message: &Message,
        request_cache: &RequestCache,
    ) -> bool {
        match self {
            FilterLogic::Direction(d) => direction == *d,
            FilterLogic::MessageType(t) => message.type_() == *t,
            FilterLogic::RequestMethod(m) => match message.type_() {
                MessageType::Request => {
                    message.raw_msg().get("method") == Some(&Value::String(m.clone()))
                }
                MessageType::ResponseSuccess | MessageType::ResponseFailure => {
                    let Some(id) = message.raw_msg().get("id").cloned() else {
                        return false;
                    };

                    if let Ok(Some(request)) = request_cache.pop_request(&id) {
                        request.get("method") == Some(&Value::String(m.clone()))
                    } else {
                        false
                    }
                }
                _ => false,
            },
            FilterLogic::And(filters) => filters
                .iter()
                .all(|f| f.matches(direction, message, request_cache)),
            FilterLogic::Or(filters) => filters
                .iter()
                .any(|f| f.matches(direction, message, request_cache)),
            FilterLogic::Not(f) => !f.matches(direction, message, request_cache),
        }
    }
}

#[derive(Clone)]
pub enum FilterAction {
    Send,
    Drop,
    Intercept(Arc<dyn MessageInterceptor + std::marker::Send + Sync>),
}

pub struct Filter {
    pub logic: FilterLogic,
    pub match_action: FilterAction,
    pub non_match_action: FilterAction,
}

impl Filter {
    pub fn new(
        logic: FilterLogic,
        match_action: FilterAction,
        non_match_action: FilterAction,
    ) -> Self {
        Self {
            logic,
            match_action,
            non_match_action,
        }
    }
}

pub struct FilterInterceptor {
    pub filter: Filter,
    pub request_cache: RequestCache,
}

impl FilterInterceptor {
    pub fn new(filter: Filter) -> Self {
        let request_cache = RequestCache::new();

        Self {
            filter,
            request_cache,
        }
    }
}

#[async_trait]
impl MessageInterceptor for FilterInterceptor {
    async fn intercept_message(
        &self,
        direction: MessageDirection,
        message: Message,
    ) -> Result<MessageInterceptorAction> {
        let Self {
            filter,
            request_cache,
        } = self;

        // cache request message for lookup during interception of corresponding response
        if message.type_() == MessageType::Request {
            request_cache.store_request(message.raw_msg().clone())?;
        }

        let action = if filter.logic.matches(direction, &message, request_cache) {
            &filter.match_action
        } else {
            &filter.non_match_action
        };

        // pop request message from cache after corresponding response messages if it wasn't already popped during filter traversal
        if matches!(
            message.type_(),
            MessageType::ResponseSuccess | MessageType::ResponseFailure
        ) {
            let Some(id) = message.raw_msg().get("id").cloned() else {
                bail!("Request does not have an id.");
            };
            let _ = request_cache.pop_request(&id)?;
        }

        match action {
            FilterAction::Send => Ok(Send(message)),
            FilterAction::Drop => Ok(Drop),
            FilterAction::Intercept(interceptor) => {
                interceptor.intercept_message(direction, message).await
            }
        }
    }
}
