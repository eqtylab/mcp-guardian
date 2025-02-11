use clap::Parser;

/// Export a guard-profile.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// The namespace of the guard-profile to export.
    #[clap(short, long)]
    pub namespace: String,

    /// The name of the guard-profile to export.
    pub profile_name: String,
}
