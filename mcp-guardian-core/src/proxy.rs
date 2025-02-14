use std::{
    io::{self, BufReader, Write},
    process::{Command, Stdio},
    sync::{Arc, Mutex},
};

use anyhow::{anyhow, Result};
use serde_json::{Deserializer, Value};
use tokio::{sync::mpsc, task};
use uuid::Uuid;

use crate::{
    message::Message,
    message_interceptor::{
        MessageInterceptor,
        MessageInterceptorAction::{Drop, Send},
    },
};

pub struct Context {
    pub mcp_server_name: String,
    pub host_session_id: Option<String>,
    pub session_id: String,
    pub message_interceptor: Arc<dyn MessageInterceptor>,
}

pub async fn proxy_mcp_server(
    mcp_server_name: String,
    host_session_id: Option<String>,
    program: &str,
    args: &[&str],
    message_interceptor: Arc<dyn MessageInterceptor>,
) -> Result<()> {
    let ctx = Arc::new(Context {
        mcp_server_name,
        host_session_id,
        session_id: Uuid::new_v4().to_string(),
        message_interceptor,
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
    log::info!("Starting outbound message receiver");
    let outbound_message_reception_task = task::spawn_blocking(move || {
        let stdin = io::stdin();
        let reader = BufReader::new(stdin.lock());
        let stream = Deserializer::from_reader(reader).into_iter::<Value>();

        for msg in stream {
            match msg {
                Ok(json) => {
                    if let Err(e) = outbound_tx.blocking_send(json) {
                        log::error!("Failed to send message to outbound buffer: {e}");
                    }
                }
                Err(e) => log::error!("Error parsing JSON from parent: {e}"),
            }
        }
    });

    // Inbound Message Reception
    //
    // 1. Read json-rpc message from child stdout.
    // 2. Send to inbound message buffer.
    log::info!("Starting inbound message receiver");
    let inbound_message_reception_task = task::spawn_blocking(move || {
        let reader = BufReader::new(child_stdout);
        let stream = Deserializer::from_reader(reader).into_iter::<Value>();

        for msg in stream {
            match msg {
                Ok(json) => {
                    if let Err(e) = inbound_tx.blocking_send(json) {
                        log::error!("Failed to send message to inbound buffer: {e}");
                    }
                }
                Err(e) => log::error!("Error parsing JSON from child: {e}"),
            }
        }
    });

    // Outbound Message Transmission
    //
    // 1. Read from outbound message buffer.
    // 2. intercept_outbound_message()
    // 3. Write to child stdin.
    log::info!("Starting outbound message transmitter");
    let ctx_clone = ctx.clone();
    let outbound_message_transmission_task = task::spawn(async move {
        let child_stdin = Arc::new(Mutex::new(child_stdin));
        while let Some(msg) = outbound_rx.recv().await {
            let ctx_clone = ctx_clone.clone();
            let child_stdin = child_stdin.clone();
            task::spawn(async move {
                match ctx_clone
                    .message_interceptor
                    .intercept_outbound_message(Message::from_json(msg))
                    .await
                {
                    Ok(Send(message)) => {
                        if let Err(e) = writeln!(child_stdin.lock().unwrap(), "{}", message.raw_msg)
                        {
                            log::error!("Failed to write to child stdin: {e}");
                        }
                        if let Err(e) = child_stdin.lock().unwrap().flush() {
                            log::error!("Failed to flush child stdin: {e}");
                        }
                    }
                    Ok(Drop) => {}
                    Err(e) => {
                        log::error!("Failed to intercept outbound message properly: {e}");
                    }
                }
            });
        }
    });

    // Inbound Message Transmission
    //
    // 1. Read from inbound message buffer.
    // 2. intercept_inbound_message()
    // 3. Write to stdout.
    log::info!("Starting inbound message transmitter");
    let ctx_clone = ctx.clone();
    let inbound_message_transmission_task = task::spawn(async move {
        while let Some(msg) = inbound_rx.recv().await {
            let ctx_clone = ctx_clone.clone();
            task::spawn(async move {
                match ctx_clone
                    .message_interceptor
                    .intercept_inbound_message(Message::from_json(msg))
                    .await
                {
                    Ok(Send(message)) => {
                        if let Err(e) = writeln!(io::stdout(), "{}", message.raw_msg) {
                            log::error!("Failed to write to stdout: {e}");
                        }
                        if let Err(e) = io::stdout().flush() {
                            log::error!("Failed to flush stdout: {e}");
                        }
                    }
                    Ok(Drop) => {}
                    Err(e) => {
                        log::error!("Failed to intercept outbound message properly: {e}");
                    }
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
