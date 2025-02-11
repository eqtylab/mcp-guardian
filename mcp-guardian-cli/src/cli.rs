pub mod guard_profiles;

use clap::Parser;

/// mcp-guardian-cli
#[derive(Debug, Clone, Parser)]
pub struct Args {
    #[clap(subcommand)]
    pub cmd: SubCommand,
}

#[derive(Debug, Clone, Parser)]
pub enum SubCommand {
    GuardProfiles(guard_profiles::Args),
}
