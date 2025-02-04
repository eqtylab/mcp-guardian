use crate::proxy::request_cache::RequestCache;

pub struct Context {
    pub mcp_server_name: String,
    pub host_session_id: Option<String>,
    pub session_id: String,
    pub request_cache: RequestCache,
}
