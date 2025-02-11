use clap::Parser;

/// Get an mcp-server.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// The namespace of the mcp-server to get.
    #[clap(short, long)]
    pub namespace: String,

    /// The name of the mcp-server to get.
    pub name: String,
}
