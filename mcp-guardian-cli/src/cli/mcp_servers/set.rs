use std::path::PathBuf;

use clap::{Parser, ValueHint};

/// Set an mcp-server.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// The namespace of the mcp-server to set.
    #[clap(short, long)]
    pub namespace: String,

    /// The name of the mcp-server to set.
    pub name: String,

    /// The path to the mcp-server file to set.
    #[clap(value_hint = ValueHint::FilePath, value_parser)]
    pub path: PathBuf,
}
