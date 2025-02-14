use std::fs;

use anyhow::Result;
use mcp_guardian_core::guard_profile::{GuardProfile, NamedGuardProfile};

use crate::cli;

pub fn cmd(args: cli::guard_profiles::Args) -> anyhow::Result<()> {
    let cli::guard_profiles::Args { cmd } = args;

    match cmd {
        cli::guard_profiles::SubCommand::Get(args) => get(args)?,
        cli::guard_profiles::SubCommand::Set(args) => set(args)?,
        cli::guard_profiles::SubCommand::List(args) => list(args)?,
        cli::guard_profiles::SubCommand::Delete(args) => delete(args)?,
    }

    Ok(())
}

fn get(args: cli::guard_profiles::get::Args) -> Result<()> {
    let cli::guard_profiles::get::Args {
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

fn set(args: cli::guard_profiles::set::Args) -> Result<()> {
    let cli::guard_profiles::set::Args {
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

fn delete(args: cli::guard_profiles::delete::Args) -> Result<()> {
    let cli::guard_profiles::delete::Args {
        namespace,
        profile_name,
    } = args;

    mcp_guardian_core::guard_profile::delete_guard_profile(&namespace, &profile_name)?;

    Ok(())
}
