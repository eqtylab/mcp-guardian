use clap::Parser;

/// Deletes a server-collection.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// The namespace of the server-collection to get.
    #[clap(short, long)]
    pub namespace: String,

    /// The name of the server-collection to delete.
    pub name: String,
}
