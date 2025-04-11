pub mod sys_mcp_guardian;

use anyhow::{anyhow, bail, Result};
use async_trait::async_trait;
use rustpython_vm::{builtins::PyStr, Interpreter, Settings};
use MessageInterceptorAction::{Drop, Send};

use crate::{
    message::{Message, MessageDirection},
    message_interceptor::{MessageInterceptor, MessageInterceptorAction},
};

pub struct PyFuncInterceptor {
    pub code_lines: Vec<String>,
}

impl PyFuncInterceptor {
    pub fn new(code_lines: Vec<String>) -> Self {
        Self { code_lines }
    }
}

#[async_trait]
impl MessageInterceptor for PyFuncInterceptor {
    async fn intercept_message(
        &self,
        direction: MessageDirection,
        message: Message,
    ) -> Result<MessageInterceptorAction> {
        let Self { code_lines } = self;

        let code = code_lines.join("\n");

        let args = vec![
            direction.to_string(),
            message.type_.to_string(),
            serde_json::to_string(&message.raw_msg)?,
        ];

        let mut settings = Settings::default();
        settings.argv = args;

        let action = Interpreter::without_stdlib(settings).enter(|vm| {
            sys_mcp_guardian::add_to_vm(vm)?;

            let scope = vm.new_scope_with_builtins();

            vm.run_code_string(scope.clone(), &code, "<embedded>".to_owned())
                .map_err(|_| anyhow!("Error running Python code."))?;

            let action = scope
                .globals
                .get_item("__action", vm)
                .map_err(|_| anyhow!("Failed to get 'action' from Python scope."))?;
            let Some(action) = action.downcast_ref::<PyStr>() else {
                bail!("Failed to downcast 'action' to PyStr.");
            };
            let action = match action.as_str() {
                "send" => {
                    let msg = scope
                        .globals
                        .get_item("__msg", vm)
                        .map_err(|_| anyhow!("Failed to get '__msg' from Python scope."))?;
                    let Some(msg) = msg.downcast_ref::<PyStr>() else {
                        bail!("Failed to downcast '__msg' to PyStr.");
                    };

                    let message = Message {
                        type_: message.type_,
                        raw_msg: serde_json::from_str(msg.as_str())?,
                    };

                    Send(message)
                }
                "drop" => Drop,
                _ => {
                    bail!("Invalid action: {}", action.as_str());
                }
            };

            Ok(action)
        })?;

        Ok(action)
    }
}
