# MCP Guardian App Architecture Insights for Phase 4

This document provides a comprehensive overview of the MCP Guardian application architecture to inform Phase 4 UX improvements, with a focus on how the Tauri frontend connects to the Rust backend libraries.

## Table of Contents

1. [Overall Architecture](#overall-architecture)
2. [Tauri Frontend](#tauri-frontend)
3. [Rust Backend Libraries](#rust-backend-libraries)
4. [Communication Flow](#communication-flow)
5. [Guard Profile Implementation](#guard-profile-implementation)
6. [Message Handling](#message-handling)
7. [Data Storage](#data-storage)
8. [Implications for Phase 4 UX Improvements](#implications-for-phase-4-ux-improvements)

## Overall Architecture

MCP Guardian follows a layered architecture:

1. **Frontend Layer**: React/TypeScript Tauri application with UI components
2. **Backend Layer**: Tauri-integrated Rust commands exposing core functionality
3. **Core Library Layer**: Rust implementation of key business logic in `mcp-guardian-core`
4. **Schema Layer**: JSON Schema generation from Rust types in `mcp-guardian-schema`
5. **Proxy Layer**: Rust implementation for proxying to MCP servers in `mcp-guardian-proxy`

The application is designed to provide a UI for managing MCP (Model Control Protocol) servers, guard profiles, and server collections, while enabling message interception, filtering, logging, and approval. The schema layer provides validation, documentation, and enhanced editing capabilities for JSON configurations.

## Tauri Frontend

### Component Structure

The frontend follows a clear component hierarchy:

- **Pages**: Top-level route components (`guard-profiles-page.tsx`, etc.)
- **Entity Components**: Components for specific entities (`guard-profile-component.tsx`, etc.)
- **UI Components**: Reusable UI elements in `components/ui`
- **Dialog Components**: Modal dialogs for creating/editing entities

### Key Frontend Files

- `App.tsx`: Main application layout and routing
- `pages/*.tsx`: Page components for different sections
- `components/*.tsx`: Entity-specific components
- `components/ui/*.tsx`: Reusable UI components
- `bindings/*.ts`: TypeScript interfaces generated from Rust types

### State Management

The app uses React's built-in state management:

- `useState` for component-level state
- Props passing for parent-child communication
- Callback functions for child-to-parent updates
- Regular polling for real-time updates (e.g., pending messages)

### TypeScript Bindings

TypeScript interfaces are automatically generated from Rust types using the `ts-rs` crate:

```typescript
// Example: Generated from Rust GuardProfile struct
export type GuardProfile = { 
  primary_message_interceptor: MessageInterceptorGuardConfig 
};

// Example: Generated from Rust MessageInterceptorGuardConfig enum
export type MessageInterceptorGuardConfig = 
  { "type": "Chain" } & ChainGuardConfig | 
  { "type": "Filter" } & FilterGuardConfig | 
  { "type": "MessageLog" } & MessageLogGuardConfig | 
  { "type": "ManualApproval" } & ManualApprovalGuardConfig;
```

## Rust Backend Libraries

### Core Components

The Rust backend is divided into several key components:

1. **mcp-guardian-core**: Core library implementing:
   - Guard profile management
   - Message interception
   - Message approval
   - Server collection management
   - Core data models with Serialize/Deserialize/JsonSchema

2. **mcp-guardian-schema**: Schema generation package for:
   - Generating JSON Schema from core Rust types
   - Providing validation rules for frontend components
   - Exporting schemas for Monaco Editor integration
   - Maintaining type consistency across the application

3. **mcp-guardian-proxy**: Proxy implementation for:
   - Intercepting messages to/from MCP servers
   - Applying guard profiles
   - Handling message routing

4. **src-tauri/src**: Tauri command implementations:
   - Bridging frontend to core libraries
   - Exposing APIs via Tauri commands
   - Managing application-specific state

### Key Rust Modules

#### Core Library
- `guard_profile.rs`: Defines guard profile data structures and operations
- `message_interceptor/`: Implements different interceptor types
- `message_approval.rs`: Handles manual approval flow
- `server_collection.rs`: Manages collections of servers with profiles

#### Schema Package
- `lib.rs`: Main entry point and schema export functions
- `guard_profile_schema.rs`: Schema generation for guard profiles
- `mcp_server_schema.rs`: Schema generation for MCP servers
- `server_collection_schema.rs`: Schema generation for server collections
- `utils.rs`: Utility functions for schema generation and validation

## Communication Flow

### Frontend to Rust

The frontend communicates with Rust backend via Tauri commands:

```typescript
// Example: Frontend invoking Rust function
const updateGuardProfiles = () => invoke("list_guard_profiles", {}).then(setGuardProfiles);

// Example: Frontend saving a guard profile
await invoke("set_guard_profile", {
  namespace,
  name,
  guardProfile,
});
```

### Rust Command Implementation

Rust functions are exposed as Tauri commands:

```rust
#[tauri::command]
pub async fn list_guard_profiles() -> Result<Vec<NamedGuardProfile>> {
    mcp_guardian_core::guard_profile::list_guard_profiles()
        .map_err(|e| format!("list_guard_profiles() failed: {e}"))
}

#[tauri::command]
pub async fn set_guard_profile(
    namespace: &str,
    name: &str,
    guard_profile: GuardProfile,
) -> Result<()> {
    mcp_guardian_core::guard_profile::save_guard_profile(namespace, name, &guard_profile)
        .map_err(|e| format!("set_guard_profile(namespace={namespace}, name={name}, ..) failed: {e}"))
}
```

## Guard Profile Implementation

### Data Model

Guard profiles have a hierarchical structure:

1. **GuardProfile**: Top-level structure containing a primary interceptor
2. **MessageInterceptorGuardConfig**: Enum of different interceptor types
3. **Specific Config Types**: Configuration for each interceptor type

```rust
pub struct GuardProfile {
    pub primary_message_interceptor: MessageInterceptorGuardConfig,
}

pub enum MessageInterceptorGuardConfig {
    Chain(chain::ChainGuardConfig),
    Filter(filter::FilterGuardConfig),
    MessageLog(message_log::MessageLogGuardConfig),
    ManualApproval(manual_approval::ManualApprovalGuardConfig),
}
```

### Interceptor Types

1. **Chain Interceptor**: 
   - Combines multiple interceptors in sequence
   - Messages flow through each interceptor in order
   - Structure: `ChainGuardConfig { chain: Vec<MessageInterceptorGuardConfig> }`

2. **Filter Interceptor**:
   - Applies conditional logic to messages
   - Can match on direction, message type, or custom logic
   - Structure: 
     ```rust
     FilterGuardConfig {
         filter_logic: FilterLogicGuardConfig,
         match_action: FilterActionGuardConfig,
         non_match_action: FilterActionGuardConfig,
     }
     ```

3. **Message Log Interceptor**:
   - Logs messages at a specified level
   - Structure: `MessageLogGuardConfig { log_level: String }`

4. **Manual Approval Interceptor**:
   - Queues messages for manual approval
   - Structure: `ManualApprovalGuardConfig {}`

### Current UI Implementation

The current UI provides basic JSON editing:

1. User creates/opens a guard profile
2. JSON representation is shown in a text editor
3. User manually edits the JSON
4. Configuration is validated and saved

This approach is functional but requires technical knowledge and is error-prone, which is why Phase 4 UX improvements are needed.

### Schema-enhanced JSON Editing (In Progress)

As part of Phase 4, we're implementing schema-enhanced JSON editing:

1. **Monaco Editor Integration**:
   - Full-featured code editor with syntax highlighting
   - Schema-based validation with error indicators
   - Intellisense and autocompletion for properties

2. **JSON Schema System**:
   - Generated directly from Rust types using `schemars`
   - Provides validation rules matching the backend data model
   - Includes property descriptions and constraints

3. **Improved Developer Experience**:
   - Real-time validation feedback
   - Property suggestions while typing
   - Documentation tooltips
   - Error highlighting with specific messages

This approach maintains the flexibility of JSON editing while providing much better guidance and error prevention.

## Message Handling

### Message Flow

1. **Interception**: Messages to/from MCP servers are intercepted by the proxy
2. **Guard Profile Application**: The appropriate guard profile is applied
3. **Chain Processing**: Messages flow through interceptor chain
4. **Potential Approval**: Messages may be queued for manual approval
5. **Final Disposition**: Messages are ultimately sent or dropped

### Manual Approval

The `ManualApprovalInterceptor` includes:

1. **Message Queueing**: Adds messages to a pending approval queue
2. **Status Checking**: Periodically checks if message has been approved
3. **Continuation**: Proceeds or aborts based on approval decision

The frontend polls for pending messages and displays them in the UI, allowing users to approve or deny.

## Data Storage

### File Storage

Guard profiles are stored as JSON files:

1. **Core Profiles**: Built-in profiles stored in code
2. **Custom Profiles**: User-created profiles stored as JSON files
3. **File Structure**: Organized by namespace and name

```
guard-profiles/
  namespace1/
    profile1.json
    profile2.json
  namespace2/
    profile3.json
```

### Schema System

As of Phase 4, a dedicated JSON Schema system has been implemented:

1. **mcp-guardian-schema Package**:
   - Dedicated Rust package for schema generation
   - Generates JSON Schema from Rust types using `schemars`
   - CLI tool for generating and exporting schemas

2. **Schema Generation**:
   - All core types have `JsonSchema` derives
   - Schemas stored in `/components/json-editor/schemas/`
   - Includes validation rules based on Rust type definitions

3. **Frontend Integration**:
   - Schemas used for Monaco Editor validation
   - Enables autocompletion and documentation tooltips
   - Maintains single source of truth from Rust to frontend

### Serialization

1. **JSON Serialization**: Using `serde_json` for Rust<->JSON conversion
2. **TypeScript Generation**: Using `ts-rs` for Rust->TypeScript type generation
3. **Schema Generation**: Using `schemars` for Rust->JSON Schema generation
4. **Validation**: JSON Schema validation in editor, with basic validation on save/load

## Implications for Phase 4 UX Improvements

### Guard Profile Visual Builder Considerations

1. **Data Model Compatibility**:
   - Visual builder must generate valid `GuardProfile` structures
   - All properties from Rust model must be represented
   - Maintain compatibility with existing JSON schema

2. **Two-way Synchronization**:
   - Convert between visual representation and JSON data model
   - Update visual diagram when JSON changes
   - Update JSON when visual diagram changes

3. **Interceptor Support**:
   - Create custom node types for each interceptor variant
   - Represent Chain interceptors as parent nodes with children
   - Support complex filter logic combinations
   - Provide appropriate property editors for each type

4. **User Workflow Integration**:
   - Visual builder should be the primary editing interface
   - Maintain JSON editor as an advanced option
   - Add templates and presets based on core profiles
   - Provide validation feedback in the visual interface

### Technical Implementation Approach

1. **React Flow Integration**:
   - Use React Flow (xyflow) for node-based editing
   - Custom nodes for different interceptor types
   - Custom edges for connecting interceptors
   - Node property forms for interceptor configuration

2. **Data Transformation**:
   - Convert `GuardProfile` JSON to React Flow nodes/edges
   - Convert React Flow nodes/edges back to `GuardProfile` JSON
   - Maintain consistency with Rust data model

3. **Schema Integration**:
   - Use generated JSON Schema for validation
   - Implement Monaco Editor with schema validation
   - Provide intellisense and autocompletion based on schema
   - Enable documentation tooltips from schema metadata

4. **User Experience Enhancement**:
   - Interactive drag-and-drop interface
   - Visual feedback for validation issues
   - Contextual help for different interceptor types
   - Templates for common configurations

By building on the existing architecture while introducing visual editing capabilities and schema-based validation, the Phase 4 UX improvements will significantly enhance the user experience while maintaining compatibility with the robust Rust backend implementation. The JSON Schema system provides a critical foundation for ensuring data integrity and improving developer experience.