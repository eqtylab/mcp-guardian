use mcp_guardian_core::guard_profile::{GuardProfile, NamedGuardProfile};

use crate::Result;

#[tauri::command]
pub async fn list_guard_profiles() -> Result<Vec<NamedGuardProfile>> {
    mcp_guardian_core::guard_profile::list_guard_profiles()
        .map_err(|e| format!("list_guard_profiles() failed: {}", e))
}

#[tauri::command]
pub async fn get_guard_profile(namespace: &str, name: &str) -> Result<GuardProfile> {
    mcp_guardian_core::guard_profile::load_guard_profile(namespace, name)
        .map_err(|e| {
            format!(
                "get_guard_profile(namespace={namespace}, name={name}) failed: {}",
                e
            )
        })?
        .ok_or_else(|| "error: guard profile not found".to_owned())
}

#[tauri::command]
pub async fn set_guard_profile(
    namespace: &str,
    name: &str,
    guard_profile: GuardProfile,
) -> Result<()> {
    mcp_guardian_core::guard_profile::save_guard_profile(namespace, name, &guard_profile).map_err(
        |e| {
            format!(
                "set_guard_profile(namespace={namespace}, name={name}, ..) failed: {}",
                e
            )
        },
    )
}
