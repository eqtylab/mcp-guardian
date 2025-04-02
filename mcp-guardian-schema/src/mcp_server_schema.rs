use anyhow::Result;
use mcp_guardian_core::mcp_server::McpServer;
use schemars::schema_for;
use serde_json::Value;

use crate::utils::create_versioned_schema;

/// Generate JSON Schema for McpServer
pub fn generate_mcp_server_schema() -> Result<String> {
    let schema = schema_for!(McpServer);
    
    // Add additional schema metadata
    let schema_value: Value = serde_json::to_value(schema)?;
    create_versioned_schema(&schema_value, "1.0.0")
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_generate_mcp_server_schema() {
        let schema = generate_mcp_server_schema().unwrap();
        
        // Verify that the schema is valid JSON
        let schema_value: Value = serde_json::from_str(&schema).unwrap();
        
        // Check for required fields
        if let Value::Object(obj) = schema_value {
            assert!(obj.contains_key("$schema"));
            assert!(obj.contains_key("$version"));
            
            // Core schema properties
            if let Some(Value::Object(defs)) = obj.get("definitions") {
                if let Some(Value::Object(mcp_server)) = defs.get("McpServer") {
                    assert!(mcp_server.contains_key("properties"));
                    
                    if let Some(Value::Object(props)) = mcp_server.get("properties") {
                        assert!(props.contains_key("cmd"));
                        assert!(props.contains_key("args"));
                        assert!(props.contains_key("env"));
                    } else {
                        panic!("Expected properties to be an object");
                    }
                } else {
                    panic!("Expected McpServer definition");
                }
            } else {
                panic!("Expected definitions to be an object");
            }
        } else {
            panic!("Expected schema to be an object");
        }
    }
}