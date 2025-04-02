use anyhow::Result;
use std::fs;
use std::path::Path;

pub mod guard_profile_schema;
pub mod mcp_server_schema;
pub mod server_collection_schema;
pub mod utils;

pub use guard_profile_schema::generate_guard_profile_schema;
pub use mcp_server_schema::generate_mcp_server_schema;
pub use server_collection_schema::generate_server_collection_schema;

/// Export all schemas to a specified directory
pub fn export_schemas_to_directory(dir_path: &Path) -> Result<()> {
    fs::create_dir_all(dir_path)?;
    
    fs::write(
        dir_path.join("guard_profile_schema.json"),
        generate_guard_profile_schema()?,
    )?;
    
    fs::write(
        dir_path.join("mcp_server_schema.json"),
        generate_mcp_server_schema()?,
    )?;
    
    fs::write(
        dir_path.join("server_collection_schema.json"),
        generate_server_collection_schema()?,
    )?;
    
    Ok(())
}

/// Export schemas for use in Tauri frontend
pub fn export_schemas_for_frontend() -> Result<()> {
    export_schemas_to_directory(Path::new("../mcp-guardian/src/components/json-editor/schemas"))
}

/// Generate documentation from schemas
pub fn generate_schema_documentation() -> Result<String> {
    let mut doc = String::new();
    doc.push_str("# MCP Guardian Schemas\n\n");
    
    // Add GuardProfile documentation
    doc.push_str("## Guard Profile Schema\n\n");
    doc.push_str("```json\n");
    doc.push_str(&generate_guard_profile_schema()?);
    doc.push_str("\n```\n\n");
    
    // Add McpServer documentation
    doc.push_str("## MCP Server Schema\n\n");
    doc.push_str("```json\n");
    doc.push_str(&generate_mcp_server_schema()?);
    doc.push_str("\n```\n\n");
    
    // Add ServerCollection documentation
    doc.push_str("## Server Collection Schema\n\n");
    doc.push_str("```json\n");
    doc.push_str(&generate_server_collection_schema()?);
    doc.push_str("\n```\n\n");
    
    Ok(doc)
}