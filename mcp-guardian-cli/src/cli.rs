pub mod guard_profiles;
pub mod mcp_servers;
pub mod server_collections;

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
    McpServers(mcp_servers::Args),
    ServerCollections(server_collections::Args),
}
