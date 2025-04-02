use anyhow::Result;
use mcp_guardian_core::guard_profile::GuardProfile;
use schemars::schema_for;
use serde_json::Value;

use crate::utils::create_versioned_schema;

/// Generate JSON Schema for GuardProfile
pub fn generate_guard_profile_schema() -> Result<String> {
    let schema = schema_for!(GuardProfile);
    
    // Add additional schema metadata
    let schema_value: Value = serde_json::to_value(schema)?;
    create_versioned_schema(&schema_value, "1.0.0")
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_generate_guard_profile_schema() {
        let schema = generate_guard_profile_schema().unwrap();
        
        // Verify that the schema is valid JSON
        let schema_value: Value = serde_json::from_str(&schema).unwrap();
        
        // Check for required fields
        if let Value::Object(obj) = schema_value {
            assert!(obj.contains_key("$schema"));
            assert!(obj.contains_key("$version"));
            
            // Core schema properties
            if let Some(Value::Object(defs)) = obj.get("definitions") {
                assert!(defs.contains_key("GuardProfile"));
                assert!(defs.contains_key("MessageInterceptorGuardConfig"));
                
                // Check MessageInterceptorGuardConfig for oneOf with different types
                if let Some(Value::Object(interceptor)) = defs.get("MessageInterceptorGuardConfig") {
                    if let Some(Value::Array(one_of)) = interceptor.get("oneOf") {
                        // Should have entries for Chain, Filter, MessageLog, and ManualApproval
                        assert!(one_of.len() >= 4);
                    } else {
                        panic!("Expected oneOf to be an array");
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