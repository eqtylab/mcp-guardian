pub mod context;
pub mod message;
pub mod message_approval;
pub mod request_cache;

use std::{
    io::{self, BufReader, Write},
    process::{Command, Stdio},
    sync::{Arc, Mutex},
};

use anyhow::{anyhow, Result};
use serde_json::{Deserializer, Value};
use tokio::{sync::mpsc, task};
use uuid::Uuid;

use crate::proxy::{
    context::Context,
    message::{intercept_inbound_message, intercept_outbound_message},
    request_cache::RequestCache,
};

pub async fn proxy_mcp_server(
    name: Option<String>,
    host_session_id: Option<String>,
    program: &str,
    args: &[&str],
) -> Result<()> {
    let ctx = Arc::new(Context {
        mcp_server_name: name.unwrap_or("unnamed".to_owned()),
        host_session_id,
        session_id: Uuid::new_v4().to_string(),
        request_cache: RequestCache::new(),
    });

    log::info!("Starting proxy for: {} {:?}", program, args);

    #[allow(clippy::zombie_processes)]
    let mut child = Command::new(program)
        .args(args)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .spawn()
        .expect("Failed to start child process");

    let child_stdin = child.stdin.take().expect("Failed to open child stdin");
    let child_stdout = child.stdout.take().expect("Failed to open child stdout");

    // Outbound Message Buffer
    let (outbound_tx, mut outbound_rx) = mpsc::channel::<Value>(100);
    // Inbound Message Buffer
    let (inbound_tx, mut inbound_rx) = mpsc::channel::<Value>(100);

    // Outbound Message Reception
    //
    // 1. Read json-rpc message from stdin.
    // 2. Send to outbound message buffer.
    let outbound_message_reception_task = task::spawn_blocking(move || {
        let stdin = io::stdin();
        let reader = BufReader::new(stdin.lock());
        let stream = Deserializer::from_reader(reader).into_iter::<Value>();

        for msg in stream {
            match msg {
                Ok(json) => {
                    if let Err(e) = outbound_tx.blocking_send(json) {
                        log::error!("Failed to send message to outbound buffer: {}", e);
                    }
                }
                Err(e) => log::error!("Error parsing JSON from parent: {}", e),
            }
        }
    });

    // Inbound Message Reception
    //
    // 1. Read json-rpc message from child stdout.
    // 2. Send to inbound message buffer.
    let inbound_message_reception_task = task::spawn_blocking(move || {
        let reader = BufReader::new(child_stdout);
        let stream = Deserializer::from_reader(reader).into_iter::<Value>();

        for msg in stream {
            match msg {
                Ok(json) => {
                    if let Err(e) = inbound_tx.blocking_send(json) {
                        log::error!("Failed to send message to inbound buffer: {}", e);
                    }
                }
                Err(e) => log::error!("Error parsing JSON from child: {}", e),
            }
        }
    });

    // Outbound Message Transmission
    //
    // 1. Read from outbound message buffer.
    // 2. intercept_outbound_message()
    // 3. Write to child stdin.
    let ctx_clone = ctx.clone();
    let outbound_message_transmission_task = task::spawn(async move {
        let child_stdin = Arc::new(Mutex::new(child_stdin));
        while let Some(msg) = outbound_rx.recv().await {
            let ctx_clone = ctx_clone.clone();
            let child_stdin = child_stdin.clone();
            task::spawn(async move {
                let msg = match intercept_outbound_message(msg, ctx_clone.clone()).await {
                    Ok(msg) => msg,
                    Err(e) => {
                        log::error!("Failed to intercept outbound message properly: {e}");
                        Value::Null
                    }
                };
                if let Err(e) = writeln!(child_stdin.lock().unwrap(), "{}", msg) {
                    log::error!("Failed to write to child stdin: {}", e);
                }
                if let Err(e) = child_stdin.lock().unwrap().flush() {
                    log::error!("Failed to flush child stdin: {}", e);
                }
            });
        }
    });

    // Inbound Message Transmission
    //
    // 1. Read from inbound message buffer.
    // 2. intercept_inbound_message()
    // 3. Write to stdout.
    let ctx_clone = ctx.clone();
    let inbound_message_transmission_task = task::spawn(async move {
        while let Some(msg) = inbound_rx.recv().await {
            let ctx_clone = ctx_clone.clone();
            task::spawn(async move {
                let msg = match intercept_inbound_message(msg, ctx_clone.clone()).await {
                    Ok(msg) => msg,
                    Err(e) => {
                        log::error!("Failed to intercept inbound message properly: {e}");
                        Value::Null
                    }
                };
                if let Err(e) = writeln!(io::stdout(), "{}", msg) {
                    log::error!("Failed to write to stdout: {}", e);
                }
                if let Err(e) = io::stdout().flush() {
                    log::error!("Failed to flush stdout: {}", e);
                }
            });
        }
    });

    tokio::select! {
        _ = outbound_message_reception_task => eprintln!("Outbound Message Reception Task exited unexpectedly."),
        _ = inbound_message_reception_task => eprintln!("Inbound Message Reception Task exited unexpectedly."),
        _ = outbound_message_transmission_task => eprintln!("Outbound Message Transmission Task exited unexpectedly."),
        _ = inbound_message_transmission_task => eprintln!("Inbound Message Transmission Task exited unexpectedly."),
    }

    Err(anyhow!("Exited MCP Guardian Early."))
}
