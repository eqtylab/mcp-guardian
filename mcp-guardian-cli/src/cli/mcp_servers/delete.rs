use clap::Parser;

/// Delete an mcp-server.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// The namespace of the mcp-server to delete.
    #[clap(short, long)]
    pub namespace: String,

    /// The name of the mcp-server to delete.
    pub name: String,
}
