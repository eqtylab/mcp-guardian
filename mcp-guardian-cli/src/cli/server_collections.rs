pub mod apply_claude_config;
pub mod export_claude_config;
pub mod get;
pub mod list;
pub mod set;

use clap::Parser;

/// Commands related to server-collections configurations.
#[derive(Debug, Clone, Parser)]
pub struct Args {
    #[clap(subcommand)]
    pub cmd: SubCommand,
}

#[derive(Debug, Clone, Parser)]
pub enum SubCommand {
    Get(get::Args),
    Set(set::Args),
    List(list::Args),
    ExportClaudeConfig(export_claude_config::Args),
    ApplyClaudeConfig(apply_claude_config::Args),
}
