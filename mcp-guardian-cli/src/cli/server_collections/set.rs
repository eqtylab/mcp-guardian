use std::path::PathBuf;

use clap::{Parser, ValueHint};

/// Set a server-collection.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// The namespace of the server-collection to set.
    #[clap(short, long)]
    pub namespace: String,

    /// The name of the server-collection to set.
    pub name: String,

    /// The path to the server-collection file to set.
    #[clap(value_hint = ValueHint::FilePath, value_parser)]
    pub path: PathBuf,
}
