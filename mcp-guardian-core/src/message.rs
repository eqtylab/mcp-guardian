use serde_json::Value;

#[derive(strum::Display, Clone, Copy, PartialEq)]
pub enum MessageDirection {
    #[strum(serialize = "outbound")]
    Outbound,
    #[strum(serialize = "inbound")]
    Inbound,
}

#[derive(Clone, Copy, PartialEq)]
pub enum MessageType {
    Request,
    ResponseSuccess,
    ResponseFailure,
    Notification,
    Unknown,
}

#[derive(Clone)]
pub struct Message {
    pub type_: MessageType,
    pub raw_msg: Value,
}

impl Message {
    pub fn from_json(msg: Value) -> Message {
        let jsonrpc = msg.get("jsonrpc").and_then(|id| id.as_str());
        let id = msg.get("id");
        let method = msg.get("method");
        let params = msg.get("params");
        let result = msg.get("result");
        let error = msg.get("error");

        match (jsonrpc, id, method, params, result, error) {
            (Some("2.0"), Some(_), Some(_), _, None, None) => Message {
                type_: MessageType::Request,
                raw_msg: msg,
            },
            (Some("2.0"), Some(_), None, None, Some(_), None) => Message {
                type_: MessageType::ResponseSuccess,
                raw_msg: msg,
            },
            (Some("2.0"), Some(_), None, None, None, Some(_)) => Message {
                type_: MessageType::ResponseFailure,
                raw_msg: msg,
            },
            (Some("2.0"), None, Some(_), _, None, None) => Message {
                type_: MessageType::Notification,
                raw_msg: msg,
            },
            _ => Message {
                type_: MessageType::Unknown,
                raw_msg: msg,
            },
        }
    }

    pub fn log_prefix(&self) -> String {
        match self.type_ {
            MessageType::Request => "Request",
            MessageType::ResponseSuccess => "Response (Ok)",
            MessageType::ResponseFailure => "Response (Err)",
            MessageType::Notification => "Notification",
            MessageType::Unknown => "Unknown",
        }
        .to_string()
    }
}
