use std::sync::Arc;

use anyhow::Result;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::message_interceptor::{py_func::PyFuncInterceptor, MessageInterceptor};

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct PyFuncGuardConfig {
    code_lines: Vec<String>,
}

impl PyFuncGuardConfig {
    pub fn try_into_message_interceptor(
        self,
        mcp_server_name: String,
    ) -> Result<Arc<dyn MessageInterceptor>> {
        let _ = mcp_server_name;

        let Self { code_lines } = self;

        let interceptor = Arc::new(PyFuncInterceptor::new(code_lines));

        Ok(interceptor)
    }
}
