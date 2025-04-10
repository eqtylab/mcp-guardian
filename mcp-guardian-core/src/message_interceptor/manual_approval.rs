use anyhow::Result;
use async_trait::async_trait;
use serde_json::json;
use tokio::time::{sleep, Duration};
use uuid::Uuid;
use MessageInterceptorAction::{Return, Send};

use crate::{
    message::{Message, MessageDirection, MessageType},
    message_approval::{request_approval, MessageStatus},
    message_interceptor::{MessageInterceptor, MessageInterceptorAction},
};

pub struct ManualApprovalInterceptor {
    pub mcp_server_name: String,
}

impl ManualApprovalInterceptor {
    pub fn new(mcp_server_name: String) -> Self {
        Self { mcp_server_name }
    }
}

#[async_trait]
impl MessageInterceptor for ManualApprovalInterceptor {
    async fn intercept_message(
        &self,
        direction: MessageDirection,
        message: Message,
    ) -> Result<MessageInterceptorAction> {
        let Self { mcp_server_name } = self;

        let approval_id = format!("{mcp_server_name}_{direction}_{}", Uuid::new_v4());

        let check_approval =
            request_approval(&approval_id, direction, message.raw_msg.clone()).await?;

        loop {
            match check_approval() {
                MessageStatus::Pending => {
                    sleep(Duration::from_millis(1000)).await;
                }
                MessageStatus::Approved => {
                    return Ok(Send(message));
                }
                MessageStatus::Denied | MessageStatus::Unknown => {
                    let id = message
                        .raw_msg
                        .get("id")
                        .ok_or_else(|| anyhow::anyhow!("Request message did not contain an ID"))?
                        .to_owned();

                    let return_message = Message {
                        type_: MessageType::ResponseSuccess,
                        raw_msg: json!({
                            "id": id,
                            "jsonrpc": "2.0",
                            "result": {
                                "content": [
                                    {
                                        "text": "Acess approval was denied.",
                                        "type": "text"
                                    }
                                ],
                                "isError": false
                            }
                        }),
                    };

                    return Ok(Return(return_message));
                }
            }
        }
    }
}
