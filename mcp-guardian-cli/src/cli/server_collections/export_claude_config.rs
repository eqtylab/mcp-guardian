use std::path::PathBuf;

use clap::Parser;

/// Export Claude Desktop config file for a server-collection.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// The namespace of the server-collection.
    #[clap(short, long)]
    pub namespace: String,

    /// The name of the server-collection.
    pub name: String,

    /// [Optional] The path to the proxy executable.
    #[clap(short, long)]
    pub proxy_path: Option<PathBuf>,
}
