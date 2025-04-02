use std::fs;
use std::path::Path;

use std::process::Command;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Create the schemas directory in the package
    let schema_dir = Path::new("schemas");
    if !schema_dir.exists() {
        fs::create_dir_all(schema_dir)?;
    }

    // Print build script information
    println!("cargo:rerun-if-changed=../mcp-guardian-core/src/guard_profile.rs");
    println!("cargo:rerun-if-changed=../mcp-guardian-core/src/mcp_server.rs");
    println!("cargo:rerun-if-changed=../mcp-guardian-core/src/server_collection.rs");
    println!("cargo:rerun-if-changed=../mcp-guardian-core/src/guard_profile/");
    println!("cargo:rerun-if-changed=src/utils.rs");

    // Export schemas after building
    println!("cargo:rerun-if-changed=build.rs");
    
    // Note: We don't run export during build because it creates a circular dependency
    // The build.rs runs during build, and would try to export schemas to the tauri app
    // which should be done during a separate step after build.

    Ok(())
}