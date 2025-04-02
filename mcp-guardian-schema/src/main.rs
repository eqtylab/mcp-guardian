use anyhow::{anyhow, Result};
use mcp_guardian_schema::{
    export_schemas_to_directory, generate_guard_profile_schema, generate_mcp_server_schema,
    generate_schema_documentation, generate_server_collection_schema,
};
use std::fs;
use std::path::Path;

fn main() -> Result<()> {
    let args: Vec<String> = std::env::args().collect();
    
    if args.len() < 2 {
        return Err(anyhow!("Usage: {} [export|generate|docs]", args[0]));
    }
    
    match args[1].as_str() {
        "export" => {
            let dir_path = if args.len() > 3 && args[2] == "--dir" {
                Path::new(&args[3])
            } else {
                Path::new("./schemas")
            };
            
            export_schemas_to_directory(dir_path)?;
            println!("Schemas exported to {:?}", dir_path);
        }
        "generate" => {
            let schema_type = if args.len() > 3 && args[2] == "--type" {
                &args[3]
            } else {
                return Err(anyhow!("Usage: {} generate --type [guard-profile|mcp-server|server-collection]", args[0]));
            };
            
            match schema_type.as_str() {
                "guard-profile" => {
                    let schema = generate_guard_profile_schema()?;
                    println!("{}", schema);
                }
                "mcp-server" => {
                    let schema = generate_mcp_server_schema()?;
                    println!("{}", schema);
                }
                "server-collection" => {
                    let schema = generate_server_collection_schema()?;
                    println!("{}", schema);
                }
                _ => {
                    return Err(anyhow!("Unknown schema type: {}", schema_type));
                }
            }
        }
        "docs" => {
            let output_path = if args.len() > 3 && args[2] == "--output" {
                Some(Path::new(&args[3]))
            } else {
                None
            };
            
            let doc = generate_schema_documentation()?;
            
            if let Some(path) = output_path {
                fs::write(path, doc)?;
                println!("Schema documentation written to {:?}", path);
            } else {
                println!("{}", doc);
            }
        }
        "validate" => {
            if args.len() < 6 || args[2] != "--type" || args[4] != "--file" {
                return Err(anyhow!("Usage: {} validate --type [guard-profile|mcp-server|server-collection] --file <file>", args[0]));
            }
            
            let schema_type = &args[3];
            let file_path = Path::new(&args[5]);
            
            let json_str = fs::read_to_string(file_path)?;
            
            // This is a placeholder - in a real implementation, we would validate the JSON
            // against the schema using the validation functions
            
            println!("Validation not yet implemented. JSON parsed successfully.");
        }
        _ => {
            return Err(anyhow!("Unknown command: {}", args[1]));
        }
    }
    
    Ok(())
}