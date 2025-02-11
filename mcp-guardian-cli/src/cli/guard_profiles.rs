pub mod export;
pub mod import;
pub mod list;

use clap::Parser;

/// Commands related to guard-profile configuration.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    #[clap(subcommand)]
    pub cmd: SubCommand,
}

#[derive(Debug, Clone, Parser)]
pub enum SubCommand {
    List(list::Args),
    Import(import::Args),
    Export(export::Args),
}
