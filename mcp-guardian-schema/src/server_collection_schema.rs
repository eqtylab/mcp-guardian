use anyhow::Result;
use mcp_guardian_core::server_collection::ServerCollection;
use schemars::schema_for;
use serde_json::Value;

use crate::utils::create_versioned_schema;

/// Generate JSON Schema for ServerCollection
pub fn generate_server_collection_schema() -> Result<String> {
    let schema = schema_for!(ServerCollection);
    
    // Add additional schema metadata
    let schema_value: Value = serde_json::to_value(schema)?;
    create_versioned_schema(&schema_value, "1.0.0")
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_generate_server_collection_schema() {
        let schema = generate_server_collection_schema().unwrap();
        
        // Verify that the schema is valid JSON
        let schema_value: Value = serde_json::from_str(&schema).unwrap();
        
        // Check for required fields
        if let Value::Object(obj) = schema_value {
            assert!(obj.contains_key("$schema"));
            assert!(obj.contains_key("$version"));
            
            // Core schema properties
            if let Some(Value::Object(defs)) = obj.get("definitions") {
                assert!(defs.contains_key("ServerCollection"));
                assert!(defs.contains_key("Server"));
                
                // Check Server definition
                if let Some(Value::Object(server)) = defs.get("Server") {
                    if let Some(Value::Object(props)) = server.get("properties") {
                        assert!(props.contains_key("mcp_server"));
                        assert!(props.contains_key("guard_profile"));
                    } else {
                        panic!("Expected properties to be an object");
                    }
                }
            } else {
                panic!("Expected definitions to be an object");
            }
        } else {
            panic!("Expected schema to be an object");
        }
    }
}