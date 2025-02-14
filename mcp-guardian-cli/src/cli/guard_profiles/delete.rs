use clap::Parser;

/// Delete a guard-profile.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// The namespace of the guard-profile to delete.
    pub namespace: String,

    /// The name of the guard-profile to delete.
    pub profile_name: String,
}
