# MCP Guardian Phase 4 UX Discovery

This document captures the current state of MCP Guardian's core components, identifying UX issues and presenting opportunities for improvement in Phase 4.

## Core Components Overview

MCP Guardian is built around three key components:

1. **MCP Servers** - External servers that process MCP (Model Control Protocol) messages
2. **Guard Profiles** - Configurations that determine how messages are filtered, logged, and approved
3. **Server Collections** - Groupings of servers with assigned guard profiles

These components work together to provide governance and security for MCP server interactions.

## Current Implementation Analysis

### Data Structures

#### MCP Server
```rust
struct McpServer {
    cmd: String,
    args: Vec<String>,
    env: HashMap<String, String>,
}

struct NamedMcpServer {
    namespace: String,
    name: String,
    server: McpServer,
}
```

MCP Servers are configured with command, arguments, and environment variables. They are identified by namespace and name, and stored as JSON files.

#### Guard Profile
```rust
struct GuardProfile {
    primary_message_interceptor: MessageInterceptorGuardConfig,
}

enum MessageInterceptorGuardConfig {
    Chain(ChainGuardConfig),
    Filter(FilterGuardConfig),
    MessageLog(MessageLogGuardConfig),
    ManualApproval(ManualApprovalGuardConfig),
}
```

Guard Profiles define how messages are processed through various interceptors, which can be chained together. They primarily handle message filtering, logging, and approval flows.

#### Server Collection
```rust
struct ServerCollection {
    servers: Vec<Server>,
}

struct Server {
    mcp_server_namespace: String,
    mcp_server_name: String,
    guard_profile_namespace: String,
    guard_profile_name: String,
}
```

Server Collections link MCP Servers to Guard Profiles, enabling management of multiple server configurations.

### UI Implementation

The current UI is built with React and Tauri, with three main component types:

1. **List pages** - Display all entities of a type with create/delete options
2. **Detail components** - Show individual entity details and enable editing
3. **Creation dialogs** - Simple forms for creating new entities

Key limitations of the current UI:
- Heavy reliance on direct JSON editing
- Limited visualization of relationships between components
- Minimal guidance for complex configurations
- No templates or quick-start options

## User Journey Analysis

### MCP Server Management

**Current Journey:**
1. User navigates to MCP Servers page
2. Clicks "Create New Server" button
3. Enters namespace, name manually
4. Edits JSON directly to configure server
5. Saves with limited validation
6. Server appears in list with basic information

**Pain Points:**
- JSON editing is error-prone and intimidating for non-technical users
- No templates for common server configurations
- Limited validation for correctness
- No visualization of how server connects to profiles
- Environment variables are difficult to configure correctly

### Guard Profile Creation

**Current Journey:**
1. User navigates to Guard Profiles page
2. Clicks "Create New Profile" button
3. Enters namespace, name manually
4. Edits complex JSON to configure interceptor chain
5. Saves with limited validation
6. Profile appears in list with minimal details

**Pain Points:**
- Complex interceptor chains require deep technical knowledge
- No visualization of message flow through chain
- Difficult to understand relationships between interceptors
- Error-prone manual configuration
- No templates beyond basic core profiles

### Server Collection Management

**Current Journey:**
1. User navigates to Server Collections page
2. Clicks "Create New Collection" button
3. Enters namespace, name manually
4. Manually enters server and profile references in JSON
5. No immediate validation of references
6. Must navigate to export dialog for Claude integration

**Pain Points:**
- Manual entry of server and profile references is error-prone
- No validation that referenced components exist
- No visualization of connections
- Difficult to understand overall system configuration
- Export to Claude requires additional manual step

### Message Approval Process

**Current Journey:**
1. User receives notification of pending message
2. Navigates to Pending Messages page
3. Sees basic message information
4. Makes approval decision with limited context
5. No feedback on message flow after decision

**Pain Points:**
- Limited context for approval decisions
- No filtering or organization options
- No visualization of message history or patterns
- Minimal message presentation
- No relationship shown to originating server/profile

## UX Improvement Opportunities

### For MCP Servers

1. **Form-based Configuration Editor**
   - Replace JSON editing with structured form fields
   - Add validation for each field
   - Provide context-sensitive help

2. **Server Templates**
   - Create pre-defined templates for common server types
   - Enable quick creation from templates
   - Allow saving custom templates

3. **Environment Variable Builder**
   - Create specialized interface for managing environment variables
   - Handle sensitive values appropriately
   - Provide validation and suggestions

4. **Import Enhancements**
   - Improve Claude config import with better validation
   - Create preview of imported configuration
   - Support partial imports

### For Guard Profiles

1. **Visual Chain Builder**
   - Create drag-and-drop interface for building interceptor chains
   - Visualize message flow through chain
   - Provide real-time validation

2. **Interceptor Templates**
   - Pre-configured interceptors for common scenarios
   - Library of ready-to-use components
   - Quick insertion into chains

3. **Interactive Property Forms**
   - Context-aware forms for each interceptor type
   - Guided configuration with inline help
   - Validation with specific error messages

4. **Modal Editing**
   - Modal-based focus editing of individual interceptors
   - Preserve chain context while editing
   - Preview changes before applying

### For Server Collections

1. **Relationship Diagram**
   - Visual graph of servers and profiles
   - Interactive connections
   - Highlight potential issues

2. **Component Selection**
   - Dropdown selectors for adding servers and profiles
   - Filter by namespace/type
   - Preview component details

3. **Reference Validation**
   - Real-time validation of component references
   - Prevent creation of invalid references
   - Highlight missing components

4. **Claude Integration**
   - Simplified export workflow
   - Preview Claude configuration
   - One-click application

### For Message Approval

1. **Enhanced Context**
   - More information about message purpose
   - Show related server and profile
   - Highlight key message attributes

2. **Filtering and Organization**
   - Filter by type, origin, content
   - Group related messages
   - Sort by various criteria

3. **Decision Support**
   - Contextual guidance for approval decisions
   - Impact analysis of approval/denial
   - Historical patterns display

## Technical Requirements

To implement these improvements, the following technical capabilities are needed:

1. **Visual Editor Framework**
   - Component for node-based editing
   - Support for drag-and-drop interactions
   - Two-way sync with data model

2. **Form Generation System**
   - Dynamic form creation from schema
   - Field validation
   - Conditional display logic

3. **Visualization Libraries**
   - Graph visualization for relationships
   - Flow diagrams for message processing
   - Interactive node editing

4. **Template System**
   - Schema for template definition
   - Storage and retrieval
   - Application to entities

5. **State Management**
   - Handle complex form state
   - Manage undo/redo capability
   - Synchronize visual editors with data model

## Next Steps

1. **Component Prototype Development**
   - Create prototypes of key UX components
   - Test with representative data
   - Evaluate performance and usability

2. **Library Selection**
   - Evaluate libraries for visual components
   - Test integration with current codebase
   - Assess performance characteristics

3. **Implementation Prioritization**
   - Identify high-impact, low-effort improvements
   - Create detailed task breakdown
   - Establish evaluation criteria for success

4. **User Testing Plan**
   - Define testing scenarios
   - Establish metrics for usability
   - Create feedback mechanism