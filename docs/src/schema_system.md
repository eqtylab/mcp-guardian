# MCP Guardian Schema System

This document outlines the schema system in MCP Guardian, including the available schemas and utilities provided by the `mcp-guardian-schema` package.

## Quick Start

To generate and use schemas for the MCP Guardian project:

```bash
# Navigate to the schema package
cd mcp-guardian-schema

# Generate all schemas to the schemas/ directory
cargo run -- export

# Export schemas to the frontend
cp schemas/*.json ../mcp-guardian/src/components/json-editor/schemas/

# Or use the Justfile for convenience
just generate            # Generate all schemas
just export-to-frontend  # Copy to frontend directory
```

## Overview

MCP Guardian uses strongly typed schemas to validate configurations, provide intelligent editing features, and ensure consistency between the backend and frontend. The schema system is built on:

1. **Rust data model definitions** in `mcp-guardian-core`
2. **JSON Schema generation** from the Rust types
3. **TypeScript type definitions** generated from the same Rust types

This approach ensures a single source of truth for data models across the entire application.

## Available Schemas

The MCP Guardian schema system covers the following core entity types:

### 1. MCP Server Schemas

MCP Server schemas define the structure and validation rules for MCP server configurations:

```json
{
  "type": "object",
  "required": ["cmd", "args"],
  "properties": {
    "cmd": {
      "type": "string",
      "description": "The command to execute"
    },
    "args": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Command line arguments"
    },
    "env": {
      "type": "object",
      "additionalProperties": {
        "type": "string"
      },
      "description": "Environment variables"
    }
  }
}
```

### 2. Guard Profile Schemas

Guard Profile schemas define the structure of interceptor chains and validation rules:

```json
{
  "type": "object",
  "required": ["primary_message_interceptor"],
  "properties": {
    "primary_message_interceptor": {
      "$ref": "#/definitions/MessageInterceptorGuardConfig"
    }
  },
  "definitions": {
    "MessageInterceptorGuardConfig": {
      "oneOf": [
        {
          "type": "object",
          "required": ["type", "interceptors"],
          "properties": {
            "type": {
              "type": "string",
              "enum": ["Chain"]
            },
            "interceptors": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/MessageInterceptorGuardConfig"
              }
            }
          }
        },
        {
          "type": "object",
          "required": ["type", "logic", "action"],
          "properties": {
            "type": {
              "type": "string",
              "enum": ["Filter"]
            },
            "logic": {
              "$ref": "#/definitions/FilterLogicGuardConfig"
            },
            "action": {
              "$ref": "#/definitions/FilterActionGuardConfig"
            }
          }
        },
        {
          "type": "object",
          "required": ["type"],
          "properties": {
            "type": {
              "type": "string",
              "enum": ["MessageLog"]
            },
            "path": {
              "type": "string"
            }
          }
        },
        {
          "type": "object",
          "required": ["type"],
          "properties": {
            "type": {
              "type": "string",
              "enum": ["ManualApproval"]
            }
          }
        }
      ]
    }
  }
}
```

### 3. Server Collection Schemas

Server Collection schemas define the structure of server collections and validation rules:

```json
{
  "type": "object",
  "required": ["servers"],
  "properties": {
    "servers": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Server"
      }
    }
  },
  "definitions": {
    "Server": {
      "type": "object",
      "required": ["mcp_server", "guard_profile"],
      "properties": {
        "mcp_server": {
          "type": "string",
          "description": "Name of the MCP server"
        },
        "guard_profile": {
          "type": "string",
          "description": "Name of the guard profile"
        }
      }
    }
  }
}
```

## The `mcp-guardian-schema` Package

The `mcp-guardian-schema` package provides utilities for generating, validating, and working with MCP Guardian schemas.

### Key Components

1. **Schema Generation Functions**

```rust
// Generate JSON Schema for GuardProfile
pub fn generate_guard_profile_schema() -> String {
    let schema = schema_for!(GuardProfile);
    serde_json::to_string_pretty(&schema).unwrap()
}

// Generate JSON Schema for McpServer
pub fn generate_mcp_server_schema() -> String {
    let schema = schema_for!(McpServer);
    serde_json::to_string_pretty(&schema).unwrap()
}

// Generate JSON Schema for ServerCollection
pub fn generate_server_collection_schema() -> String {
    let schema = schema_for!(ServerCollection);
    serde_json::to_string_pretty(&schema).unwrap()
}
```

2. **Schema Validation Functions**

```rust
// Validate a GuardProfile JSON string against its schema
pub fn validate_guard_profile_json(json_str: &str) -> Result<(), ValidationError> {
    validate_json_against_schema(json_str, generate_guard_profile_schema())
}

// Validate an McpServer JSON string against its schema
pub fn validate_mcp_server_json(json_str: &str) -> Result<(), ValidationError> {
    validate_json_against_schema(json_str, generate_mcp_server_schema())
}

// Validate a ServerCollection JSON string against its schema
pub fn validate_server_collection_json(json_str: &str) -> Result<(), ValidationError> {
    validate_json_against_schema(json_str, generate_server_collection_schema())
}
```

3. **Schema Export Utilities**

```rust
// Export all schemas to a specified directory
pub fn export_schemas_to_directory(dir_path: &Path) -> Result<(), anyhow::Error> {
    fs::create_dir_all(dir_path)?;
    
    fs::write(
        dir_path.join("guard_profile_schema.json"),
        generate_guard_profile_schema(),
    )?;
    
    fs::write(
        dir_path.join("mcp_server_schema.json"),
        generate_mcp_server_schema(),
    )?;
    
    fs::write(
        dir_path.join("server_collection_schema.json"),
        generate_server_collection_schema(),
    )?;
    
    Ok(())
}

// Export schemas for use in Tauri frontend
pub fn export_schemas_for_frontend() -> Result<(), anyhow::Error> {
    export_schemas_to_directory(Path::new("../mcp-guardian/src/components/json-editor/schemas"))
}
```

4. **Schema Documentation Generation**

```rust
// Generate documentation from schemas
pub fn generate_schema_documentation() -> Result<String, anyhow::Error> {
    let mut doc = String::new();
    doc.push_str("# MCP Guardian Schemas\n\n");
    
    // Add GuardProfile documentation
    doc.push_str("## Guard Profile Schema\n\n");
    doc.push_str("```json\n");
    doc.push_str(&generate_guard_profile_schema());
    doc.push_str("\n```\n\n");
    
    // Add McpServer documentation
    doc.push_str("## MCP Server Schema\n\n");
    doc.push_str("```json\n");
    doc.push_str(&generate_mcp_server_schema());
    doc.push_str("\n```\n\n");
    
    // Add ServerCollection documentation
    doc.push_str("## Server Collection Schema\n\n");
    doc.push_str("```json\n");
    doc.push_str(&generate_server_collection_schema());
    doc.push_str("\n```\n\n");
    
    Ok(doc)
}
```

## Integration with Frontend

The generated schemas are used in the frontend with Monaco Editor to provide:

1. **Validation**: Immediate feedback on JSON configuration errors
2. **Autocompletion**: Intelligent suggestions for property names
3. **Documentation**: Inline help text from schema descriptions
4. **Type Checking**: Verification of value types and formats

## Build Process Integration

The `mcp-guardian-schema` package is integrated into the build process:

1. A build script exports the latest schemas during compilation
2. The exported schemas are placed in the frontend's schema directory
3. Monaco Editor is configured to use these schemas for validation

### Step-by-Step Integration Process

Here's the detailed workflow for generating and using schemas:

1. **Set up the core types with JsonSchema derive**:
   ```rust
   use schemars::JsonSchema;
   
   #[derive(Debug, Clone, Serialize, Deserialize, TS, JsonSchema)]
   #[ts(export)]
   pub struct McpServer {
       pub cmd: String,
       pub args: Vec<String>,
       #[serde(default, skip_serializing_if = "HashMap::is_empty")]
       #[ts(skip)]
       pub env: HashMap<String, String>,
   }
   ```

2. **Generate schemas using the CLI**:
   ```bash
   # Generate an individual schema
   cargo run -- generate --type mcp-server
   
   # Generate and export all schemas
   cargo run -- export
   ```

3. **View the generated schema output**:
   ```json
   {
     "$schema": "http://json-schema.org/draft-07/schema#",
     "$version": "1.0.0",
     "properties": {
       "args": {
         "items": {
           "type": "string"
         },
         "type": "array"
       },
       "cmd": {
         "type": "string"
       },
       "env": {
         "additionalProperties": {
           "type": "string"
         },
         "type": "object"
       }
     },
     "required": [
       "args",
       "cmd"
     ],
     "title": "McpServer",
     "type": "object"
   }
   ```

4. **Export schemas to the frontend**:
   ```bash
   # Create the directory if it doesn't exist
   mkdir -p ../mcp-guardian/src/components/json-editor/schemas
   
   # Copy schemas to the frontend
   cp schemas/*.json ../mcp-guardian/src/components/json-editor/schemas/
   ```

5. **Configure Monaco Editor with the schemas**:
   ```typescript
   // In the Monaco Editor component
   monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
     validate: true,
     schemas: [
       {
         uri: "http://mcp-guardian/schemas/mcp-server.json",
         fileMatch: ["*"],
         schema: mcpServerSchema,
       },
     ],
   });
   ```

These steps ensure that changes to the Rust data models automatically flow through to the frontend validation system.

## Extending the Schema System

To extend the schema system with new entity types:

1. Define the Rust struct or enum in `mcp-guardian-core`
2. Add the `#[derive(JsonSchema)]` attribute to the type
3. Create a schema generation function in `mcp-guardian-schema`
4. Update the schema export utilities to include the new schema

## Schema Versioning

The schema system includes a versioning strategy to handle compatibility:

1. Each schema includes a `$schema` property with version information
2. Schema changes follow semantic versioning principles
3. The frontend can detect schema version mismatches and provide appropriate guidance
4. Migration utilities help update configurations between schema versions

## Command Line Interface

The `mcp-guardian-schema` package includes a CLI for working with schemas:

```bash
# Export all schemas to a directory
cargo run -- export --dir ./schemas

# Generate a specific schema
cargo run -- generate --type mcp-server

# Generate a Guard Profile schema
cargo run -- generate --type guard-profile

# Generate a Server Collection schema
cargo run -- generate --type server-collection

# Generate schema documentation
cargo run -- docs --output ./schema-docs.md

# Validate a configuration file against its schema (future implementation)
cargo run -- validate --type guard-profile --file ./my-profile.json
```

You can also use the provided Justfile for convenience:

```bash
# Display available commands
just --list

# Generate all schemas
just generate

# Generate a specific schema
just generate-mcp-server
just generate-guard-profile
just generate-server-collection

# Export schemas to the frontend
just export-to-frontend

# Generate documentation
just docs
```

## Conclusion

The MCP Guardian schema system provides a robust foundation for configuration validation, ensuring consistency between the backend and frontend. By generating schemas directly from Rust types, we maintain a single source of truth for data models throughout the application.