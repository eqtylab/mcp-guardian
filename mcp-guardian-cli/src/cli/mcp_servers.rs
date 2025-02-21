pub mod delete;
pub mod get;
pub mod import;
pub mod list;
pub mod set;

use clap::Parser;

/// Commands related to mcp-server configurations.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    #[clap(subcommand)]
    pub cmd: SubCommand,
}

#[derive(Debug, Clone, Parser)]
pub enum SubCommand {
    Delete(delete::Args),
    Get(get::Args),
    Set(set::Args),
    List(list::Args),
    Import(import::Args),
}
