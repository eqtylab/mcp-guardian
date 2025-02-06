use std::sync::Arc;

use crate::proxy::message_interceptor::MessageInterceptor;

pub struct Context {
    pub mcp_server_name: String,
    pub host_session_id: Option<String>,
    pub session_id: String,
    pub message_interceptor: Arc<dyn MessageInterceptor>,
}
