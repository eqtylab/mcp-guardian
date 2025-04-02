use std::sync::Arc;

use anyhow::{bail, Result};
use serde::{Deserialize, Serialize};
use schemars::JsonSchema;
use ts_rs::TS;

use crate::{
    guard_profile::MessageInterceptorGuardConfig,
    message::{MessageDirection, MessageType},
    message_interceptor::{
        filter::{Filter, FilterAction, FilterInterceptor, FilterLogic},
        MessageInterceptor,
    },
};

#[derive(Debug, Clone, Serialize, Deserialize, TS, JsonSchema)]
#[ts(export)]
pub struct FilterGuardConfig {
    pub filter_logic: FilterLogicGuardConfig,
    pub match_action: FilterActionGuardConfig,
    pub non_match_action: FilterActionGuardConfig,
}

impl FilterGuardConfig {
    pub fn try_into_message_interceptor(
        self,
        mcp_server_name: String,
    ) -> Result<Arc<dyn MessageInterceptor>> {
        let filter_logic = self.filter_logic.try_into()?;
        let match_action = (self.match_action, mcp_server_name.clone()).try_into()?;
        let non_match_action = (self.non_match_action, mcp_server_name.clone()).try_into()?;

        let message_interceptor = Arc::new(FilterInterceptor::new(Filter::new(
            filter_logic,
            match_action,
            non_match_action,
        )));

        Ok(message_interceptor)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, TS, JsonSchema)]
#[serde(rename_all = "snake_case")]
#[ts(export)]
pub enum FilterLogicGuardConfig {
    Direction(String),
    MessageType(String),
    RequestMethod(String),
    And(Vec<Self>),
    Or(Vec<Self>),
    Not(Box<Self>),
}

impl TryFrom<FilterLogicGuardConfig> for FilterLogic {
    type Error = anyhow::Error;

    fn try_from(value: FilterLogicGuardConfig) -> Result<FilterLogic> {
        let filter_logic = match value {
            FilterLogicGuardConfig::Direction(direction) => match direction.as_str() {
                "inbound" => FilterLogic::Direction(MessageDirection::Inbound),
                "outbound" => FilterLogic::Direction(MessageDirection::Outbound),
                _ => bail!("Invalid direction: {}", direction),
            },
            FilterLogicGuardConfig::MessageType(message_type) => match message_type.as_str() {
                "request" => FilterLogic::MessageType(MessageType::Request),
                "response" => FilterLogic::Or(vec![
                    FilterLogic::MessageType(MessageType::ResponseSuccess),
                    FilterLogic::MessageType(MessageType::ResponseFailure),
                ]),
                "responseSuccess" => FilterLogic::MessageType(MessageType::ResponseSuccess),
                "responseFailure" => FilterLogic::MessageType(MessageType::ResponseFailure),
                "notification" => FilterLogic::MessageType(MessageType::Notification),
                "unknown" => FilterLogic::MessageType(MessageType::Unknown),
                _ => anyhow::bail!("Invalid message type: {}", message_type),
            },
            FilterLogicGuardConfig::RequestMethod(request_method) => {
                FilterLogic::RequestMethod(request_method)
            }
            FilterLogicGuardConfig::And(logics) => {
                let logics = logics
                    .into_iter()
                    .map(|logic| logic.try_into())
                    .collect::<Result<Vec<_>>>()?;

                FilterLogic::And(logics)
            }
            FilterLogicGuardConfig::Or(logics) => {
                let logics = logics
                    .into_iter()
                    .map(|logic| logic.try_into())
                    .collect::<Result<Vec<_>>>()?;

                FilterLogic::Or(logics)
            }
            FilterLogicGuardConfig::Not(logic) => {
                let logic = (*logic).try_into()?;

                FilterLogic::Not(Box::new(logic))
            }
        };

        Ok(filter_logic)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, TS, JsonSchema)]
#[serde(rename_all = "snake_case")]
#[ts(export)]
pub enum FilterActionGuardConfig {
    Send,
    Drop,
    Intercept(Box<MessageInterceptorGuardConfig>),
}

impl TryFrom<(FilterActionGuardConfig, String)> for FilterAction {
    type Error = anyhow::Error;

    fn try_from(
        (action, mcp_server_name): (FilterActionGuardConfig, String),
    ) -> Result<FilterAction> {
        let filter_action = match action {
            FilterActionGuardConfig::Send => FilterAction::Send,
            FilterActionGuardConfig::Drop => FilterAction::Drop,
            FilterActionGuardConfig::Intercept(config) => {
                FilterAction::Intercept(config.try_into_message_interceptor(mcp_server_name)?)
            }
        };

        Ok(filter_action)
    }
}
