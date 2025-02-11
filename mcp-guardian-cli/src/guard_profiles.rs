use std::fs;

use anyhow::Result;
use mcp_guardian_core::guard_profile::{GuardProfile, NamedGuardProfile};

use crate::cli;

pub fn cmd(args: cli::guard_profiles::Args) -> anyhow::Result<()> {
    let cli::guard_profiles::Args { cmd } = args;

    match cmd {
        cli::guard_profiles::SubCommand::List(args) => list(args)?,
        cli::guard_profiles::SubCommand::Import(args) => import(args)?,
        cli::guard_profiles::SubCommand::Export(args) => export(args)?,
    }

    Ok(())
}

fn list(args: cli::guard_profiles::list::Args) -> Result<()> {
    let _ = args;

    let profiles = mcp_guardian_core::guard_profile::list_guard_profiles()?;

    for NamedGuardProfile {
        namespace,
        profile_name,
        ..
    } in profiles
    {
        println!("{namespace}.{profile_name}");
    }

    Ok(())
}

fn import(args: cli::guard_profiles::import::Args) -> Result<()> {
    let cli::guard_profiles::import::Args {
        namespace,
        profile_name,
        path,
    } = args;

    let guard_profile = fs::read_to_string(&path)?;
    let guard_profile = serde_json::from_str::<GuardProfile>(&guard_profile)?;

    mcp_guardian_core::guard_profile::save_guard_profile(
        &namespace,
        &profile_name,
        &guard_profile,
    )?;

    Ok(())
}

fn export(args: cli::guard_profiles::export::Args) -> Result<()> {
    let cli::guard_profiles::export::Args {
        namespace,
        profile_name,
    } = args;

    let guard_profile =
        mcp_guardian_core::guard_profile::load_guard_profile(&namespace, &profile_name)?
            .ok_or_else(|| anyhow::anyhow!("Guard profile not found."))?;

    let guard_profile = serde_json::to_string_pretty(&guard_profile)?;

    println!("{guard_profile}");

    Ok(())
}
