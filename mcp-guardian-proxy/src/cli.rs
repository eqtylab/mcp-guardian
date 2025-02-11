use clap::Parser;

/// mcp-guardian-proxy
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// [Optional] MCP server name
    #[clap(short, long)]
    pub name: Option<String>,

    /// [Optional] Host session id
    #[clap(long)]
    pub host_session_id: Option<String>,

    /// Guard profile to use for the MCP server ("{namespace}.{profile_name}")
    #[clap(short, long)]
    #[clap(default_value = "mcp-guardian.default")]
    pub guard_profile: String,

    /// [Optional] MCP server configuration to use. This is mutually exclusive with providing a command to run.
    #[clap(short, long)]
    pub mcp_server: Option<String>,

    /// MCP server command
    #[clap(value_parser, last=true, num_args=0..=100)]
    pub cmd: Vec<String>,
}
