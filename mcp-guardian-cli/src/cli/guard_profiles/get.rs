use clap::Parser;

/// Get a guard-profile.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// The namespace of the guard-profile to get.
    #[clap(short, long)]
    pub namespace: String,

    /// The name of the guard-profile to get.
    pub profile_name: String,
}
