use anyhow::{anyhow, Result};
use serde_json::Value;

/// Custom error type for JSON schema validation
#[derive(Debug)]
pub struct ValidationError {
    pub message: String,
    pub path: Option<String>,
}

impl std::fmt::Display for ValidationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if let Some(path) = &self.path {
            write!(f, "Validation error at {}: {}", path, self.message)
        } else {
            write!(f, "Validation error: {}", self.message)
        }
    }
}

impl std::error::Error for ValidationError {}

/// Validate JSON string against a JSON schema
pub fn validate_json_against_schema(json_str: &str, schema_str: &str) -> Result<(), ValidationError> {
    // Parse the schema
    let _schema: Value = serde_json::from_str(schema_str)
        .map_err(|e| ValidationError {
            message: format!("Failed to parse schema: {}", e),
            path: None,
        })?;
    
    // Parse the JSON
    let _json: Value = serde_json::from_str(json_str)
        .map_err(|e| ValidationError {
            message: format!("Failed to parse JSON: {}", e),
            path: None,
        })?;
    
    // In a real implementation, we would validate the JSON against the schema
    // For now, we're just returning Ok as a placeholder
    // Future: Use jsonschema or similar to perform actual validation
    
    Ok(())
}

/// Create a JSON schema with version information and enforce additionalProperties: false
pub fn create_versioned_schema(schema: &Value, version: &str) -> Result<String> {
    let mut schema_value = schema.clone();
    
    // Recursively enforce additionalProperties: false for all objects in the schema
    fn enforce_additional_properties(value: &mut Value) {
        match value {
            Value::Object(obj) => {
                // Handle special schema keywords that contain sub-schemas
                let has_composites = obj.contains_key("oneOf") || obj.contains_key("anyOf") || 
                                    obj.contains_key("allOf") || obj.contains_key("not");
                
                // Process composite schemas first (oneOf, anyOf, allOf, not)
                if has_composites {
                    // Process oneOf arrays
                    if let Some(Value::Array(one_of)) = obj.get_mut("oneOf") {
                        for item in one_of.iter_mut() {
                            enforce_additional_properties(item);
                        }
                    }
                    
                    // Process anyOf arrays
                    if let Some(Value::Array(any_of)) = obj.get_mut("anyOf") {
                        for item in any_of.iter_mut() {
                            enforce_additional_properties(item);
                        }
                    }
                    
                    // Process allOf arrays
                    if let Some(Value::Array(all_of)) = obj.get_mut("allOf") {
                        for item in all_of.iter_mut() {
                            enforce_additional_properties(item);
                        }
                    }
                    
                    // Process not object
                    if let Some(not) = obj.get_mut("not") {
                        enforce_additional_properties(not);
                    }
                }
                
                // Add additionalProperties: false if the object defines a schema type
                if obj.contains_key("type") && obj.get("type") == Some(&Value::String("object".to_string())) {
                    // Don't overwrite existing additionalProperties if it's already set
                    if !obj.contains_key("additionalProperties") {
                        obj.insert("additionalProperties".to_string(), Value::Bool(false));
                    }
                }
                
                // Add additionalProperties: false if we have properties (common in schemas) but no type
                if obj.contains_key("properties") && !obj.contains_key("type") && !obj.contains_key("additionalProperties") {
                    obj.insert("additionalProperties".to_string(), Value::Bool(false));
                }
                
                // Handle direct schema definitions in definitions section
                if obj.contains_key("properties") && !has_composites {
                    if !obj.contains_key("additionalProperties") {
                        obj.insert("additionalProperties".to_string(), Value::Bool(false));
                    }
                }
                
                // Recursively process all nested objects
                for (key, v) in obj.iter_mut() {
                    // Skip special keys we've already handled
                    if key != "oneOf" && key != "anyOf" && key != "allOf" && key != "not" {
                        enforce_additional_properties(v);
                    }
                }
            }
            Value::Array(arr) => {
                // Process all array elements
                for item in arr.iter_mut() {
                    enforce_additional_properties(item);
                }
            }
            _ => {} // Skip other value types
        }
    }
    
    // Enforce additionalProperties: false for all objects in the schema
    enforce_additional_properties(&mut schema_value);
    
    if let Value::Object(ref mut obj) = schema_value {
        obj.insert("$schema".to_string(), Value::String("http://json-schema.org/draft-07/schema#".to_string()));
        obj.insert("$version".to_string(), Value::String(version.to_string()));
        
        // Ensure additionalProperties: false at the root level
        if !obj.contains_key("additionalProperties") {
            obj.insert("additionalProperties".to_string(), Value::Bool(false));
        }
    } else {
        return Err(anyhow!("Schema must be a JSON object"));
    }
    
    Ok(serde_json::to_string_pretty(&schema_value)?)
}