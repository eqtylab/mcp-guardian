use std::fs;
use std::path::Path;

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

    Ok(())
}