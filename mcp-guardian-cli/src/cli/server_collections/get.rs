use clap::Parser;

/// Get a server-collection.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// The namespace of the server-collection to get.
    #[clap(short, long)]
    pub namespace: String,

    /// The name of the server-collection to get.
    pub name: String,
}
