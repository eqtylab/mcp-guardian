use std::path::PathBuf;

use clap::{Parser, ValueHint};

/// Import a guard-profile.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    /// The namespace of the guard-profile to import.
    #[clap(short, long)]
    pub namespace: String,

    /// The name of the guard-profile to import.
    pub profile_name: String,

    /// The path to the guard-profile file to import.
    #[clap(value_hint = ValueHint::FilePath, value_parser)]
    pub path: PathBuf,
}
