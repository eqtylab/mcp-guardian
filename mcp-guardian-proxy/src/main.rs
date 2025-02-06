use std::sync::Arc;

use anyhow::{bail, Result};
use clap::Parser;
use mcp_guardian_core::proxy::{
    message_interceptor::{
        chain::ChainInterceptor,
        filter::{Filter, FilterAction, FilterInterceptor, FilterLogic},
        manual_approval::ManualApprovalInterceptor,
        message_log::MessageLogInterceptor,
        MessageInterceptor,
    },
    proxy_mcp_server,
};
use mcp_guardian_proxy::cli;

#[tokio::main]
async fn main() -> Result<()> {
    let cli::Args {
        name,
        host_session_id,
        cmd,
    } = cli::Args::parse();

    mcp_guardian_core::dirs::create_all_dirs()?;

    let log_file = mcp_guardian_core::dirs::AppSubDir::Logs
        .path()?
        .join("mcp-guardian-proxy.log");

    log2::open(log_file.to_string_lossy().as_ref()).start();

    let [command, args @ ..] = &cmd[..] else {
        bail!("No MCP server command provided.");
    };

    let args = args.iter().map(String::as_str).collect::<Vec<_>>();

    let proxy_interceptor = proxy_interceptor(name.clone().unwrap_or("unnamed".to_owned()));

    if let Err(e) = proxy_mcp_server(name, host_session_id, command, &args, proxy_interceptor).await
    {
        eprint!("Error starting MCP server: {e}");
    }

    Ok(())
}

fn proxy_interceptor(mcp_server_name: String) -> Arc<dyn MessageInterceptor> {
    let log_all_messages = Arc::new(MessageLogInterceptor::new(
        log::Level::Info,
        mcp_server_name.clone(),
    ));

    let manually_approve_tool_calls = Arc::new(FilterInterceptor::new(Filter::new(
        FilterLogic::RequestMethod("tools/call".to_owned()),
        FilterAction::Intercept(Arc::new(ManualApprovalInterceptor::new(
            mcp_server_name.clone(),
        ))),
        FilterAction::Send,
    )));

    Arc::new(ChainInterceptor::new(vec![
        log_all_messages,
        manually_approve_tool_calls,
    ]))
}
