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

// TODO: refactor to
// pub struct Message {
//     pub type_: MessageType,
//     pub raw_msg: Value,
// }
#[derive(Clone)]
pub enum Message {
    Request(Value),
    ResponseSuccess(Value),
    EespsoneFailure(Value),
    Notification(Value),
    Unknown(Value),
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
            (Some("2.0"), Some(_), Some(_), _, None, None) => Message::Request(msg),
            (Some("2.0"), Some(_), None, None, Some(_), None) => Message::ResponseSuccess(msg),
            (Some("2.0"), Some(_), None, None, None, Some(_)) => Message::EespsoneFailure(msg),
            (Some("2.0"), None, Some(_), _, None, None) => Message::Notification(msg),
            _ => Message::Unknown(msg),
        }
    }

    pub fn log_prefix(&self) -> String {
        match self {
            Message::Request(_) => "Request",
            Message::ResponseSuccess(_) => "Response (Ok)",
            Message::EespsoneFailure(_) => "Response (Err)",
            Message::Notification(_) => "Notification",
            Message::Unknown(_) => "Unknown",
        }
        .to_string()
    }

    pub fn raw_msg(&self) -> &Value {
        match self {
            Message::Request(msg) => msg,
            Message::ResponseSuccess(msg) => msg,
            Message::EespsoneFailure(msg) => msg,
            Message::Notification(msg) => msg,
            Message::Unknown(msg) => msg,
        }
    }

    pub fn type_(&self) -> MessageType {
        match self {
            Message::Request(_) => MessageType::Request,
            Message::ResponseSuccess(_) => MessageType::ResponseSuccess,
            Message::EespsoneFailure(_) => MessageType::ResponseFailure,
            Message::Notification(_) => MessageType::Notification,
            Message::Unknown(_) => MessageType::Unknown,
        }
    }
}
