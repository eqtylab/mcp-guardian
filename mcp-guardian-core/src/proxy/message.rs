use std::sync::Arc;

use anyhow::{bail, Result};
use serde_json::Value;

use crate::proxy::{
    context::Context,
    message_approval::{request_approval, MessageDirection, MessageStatus},
};

pub async fn intercept_outbound_message(msg: Value, ctx: Arc<Context>) -> Result<Value> {
    let Context {
        mcp_server_name,
        session_id,
        request_cache,
        ..
    } = &*ctx;

    let parsed_msg = parse_message(msg.clone())?;

    #[allow(clippy::single_match)]
    match parsed_msg {
        RpcMessage::Request(_) => {
            request_cache.store_request(msg.clone())?;

            let id = match msg.get("id") {
                Some(Value::Number(n)) => n.to_string(),
                Some(Value::String(s)) => s.clone(),
                _ => {
                    bail!("Request without id: {msg}");
                }
            };
            let Some(Value::String(method)) = msg.get("method") else {
                bail!("Request without method: {msg}");
            };

            if method == "tools/call" {
                let approval_id = format!("{session_id}_{id}");
                let check_approval =
                    request_approval(&approval_id, MessageDirection::Outbound, msg.clone()).await?;
                loop {
                    let status = check_approval();
                    log::debug!("Request {status}: {id}");
                    match status {
                        MessageStatus::Pending => {
                            tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
                        }
                        MessageStatus::Approved => {
                            break;
                        }
                        MessageStatus::Denied | MessageStatus::Unknown => {
                            return Ok(Value::Null);
                        }
                    }
                }
            }
        }
        _ => {}
    }

    log::debug!(
        "{} | {} | Host --> MCP Guardian Proxy --> MCP Server: {}",
        mcp_server_name,
        parsed_msg.log_prefix(),
        msg,
    );

    Ok(msg)
}

pub async fn intercept_inbound_message(msg: Value, ctx: Arc<Context>) -> Result<Value> {
    let Context {
        mcp_server_name,
        session_id,
        request_cache,
        ..
    } = &*ctx;

    let parsed_msg = parse_message(msg.clone())?;

    #[allow(clippy::single_match)]
    match parsed_msg {
        RpcMessage::ResponseSuccess(_) => {
            if let Some(id) = msg.get("id").cloned() {
                if let Some(request) = request_cache.pop_request(&id)? {
                    let id = match request.get("id") {
                        Some(Value::Number(n)) => n.to_string(),
                        Some(Value::String(s)) => s.clone(),
                        _ => {
                            bail!("Request without id: {msg}");
                        }
                    };
                    let Some(Value::String(method)) = request.get("method") else {
                        bail!("Request without method: {request}");
                    };

                    if method == "tools/call" {
                        let approval_id = format!("{session_id}_{id}");
                        let check_approval =
                            request_approval(&approval_id, MessageDirection::Inbound, msg.clone())
                                .await?;
                        loop {
                            let status = check_approval();
                            log::debug!("Response {status}: {id}");
                            match status {
                                MessageStatus::Pending => {
                                    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
                                }
                                MessageStatus::Approved => {
                                    break;
                                }
                                MessageStatus::Denied | MessageStatus::Unknown => {
                                    return Ok(Value::Null);
                                }
                            }
                        }
                    }
                } else {
                    log::error!("Response to unknown request (id={}): {}", id, msg);
                }
            } else {
                log::error!("Response without id: {}", msg);
            }
        }
        _ => {}
    }

    log::info!(
        "{} | {} | Host <-- MCP Guardian Proxy <-- MCP Server: {}",
        mcp_server_name,
        parsed_msg.log_prefix(),
        msg,
    );

    Ok(msg)
}

fn parse_message(msg: Value) -> Result<RpcMessage> {
    let jsonrpc = msg.get("jsonrpc").and_then(|id| id.as_str());
    let id = msg.get("id");
    let method = msg.get("method");
    let params = msg.get("params");
    let result = msg.get("result");
    let error = msg.get("error");

    let rpc_message = match (jsonrpc, id, method, params, result, error) {
        (Some("2.0"), Some(_), Some(_), _, None, None) => RpcMessage::Request(msg),
        (Some("2.0"), Some(_), None, None, Some(_), None) => RpcMessage::ResponseSuccess(msg),
        (Some("2.0"), Some(_), None, None, None, Some(_)) => RpcMessage::EespsoneFailure(msg),
        (Some("2.0"), None, Some(_), _, None, None) => RpcMessage::Notification(msg),
        _ => RpcMessage::Unknown(msg),
    };

    Ok(rpc_message)
}

pub enum RpcMessage {
    Request(Value),
    ResponseSuccess(Value),
    EespsoneFailure(Value),
    Notification(Value),
    Unknown(Value),
}

impl RpcMessage {
    pub fn log_prefix(&self) -> String {
        match self {
            RpcMessage::Request(_) => "Request",
            RpcMessage::ResponseSuccess(_) => "Response (Ok)",
            RpcMessage::EespsoneFailure(_) => "Response (Err)",
            RpcMessage::Notification(_) => "Notification",
            RpcMessage::Unknown(_) => "Unknown",
        }
        .to_string()
    }

    pub fn raw_msg(&self) -> &Value {
        match self {
            RpcMessage::Request(msg) => msg,
            RpcMessage::ResponseSuccess(msg) => msg,
            RpcMessage::EespsoneFailure(msg) => msg,
            RpcMessage::Notification(msg) => msg,
            RpcMessage::Unknown(msg) => msg,
        }
    }
}
