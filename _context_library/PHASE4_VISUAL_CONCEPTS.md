# Phase 4 Visual Concepts and Mockups

This document provides descriptive mockups of proposed UX improvements for Phase 4. These mockups serve as a reference for future implementation but are designed to be understood textually without actual images.

## 1. Visual Guard Profile Builder

### Current State (JSON Editor):
```
{
  "primary_message_interceptor": {
    "type": "Chain",
    "chain": [
      {
        "type": "MessageLog",
        "log_level": "Info"
      },
      {
        "type": "Filter",
        "filter_logic": {
          "and": [
            { "request_method": "tools/call" },
            { "direction": "outbound" }
          ]
        },
        "match_action": {
          "intercept": { "type": "ManualApproval" }
        },
        "non_match_action": "send"
      }
    ]
  }
}
```

### Visual Builder Concept:

```
+----------------------------------------------------------+
|  Guard Profile Builder                            [JSON] |
+----------------------------------------------------------+
|                                                          |
|  +-----------+      +-----------+      +--------------+ |
|  | Message   |      | Filter    |      | Manual       | |
|  | Logger    +----->+           +----->+ Approval     | |
|  |           |      |           |      |              | |
|  +-----------+      +-----------+      +--------------+ |
|                                                          |
|  Properties:                                             |
|  +--------------------------------------------------+   |
|  | [Selected: Filter]                               |   |
|  |                                                  |   |
|  | Match Logic:                                     |   |
|  | [ ] Direction: [Outbound ▼]                      |   |
|  | [ ] Request Method: [tools/call ▼]               |   |
|  | [+] Add Condition                                |   |
|  |                                                  |   |
|  | Match Action: [Intercept ▼] → [Manual Approval ▼]|   |
|  | Non-match Action: [Send ▼]                       |   |
|  +--------------------------------------------------+   |
|                                                          |
|  Templates: [Approve Outbound] [Log Only] [Full Approval]|
+----------------------------------------------------------+
```

### Key Features:
- Drag-and-drop nodes from a toolbox
- Visual connections between nodes showing flow
- Properties panel for configuring selected node
- One-click templates for common patterns
- Toggle between visual builder and JSON view
- Real-time validation and suggestions

## 2. Server Collection Relationship Diagram

### Current State (JSON Editor):
```
{
  "servers": [
    {
      "mcp_server": "tutorial.time-server",
      "guard_profile": "mcp-guardian.approve-tool-call-requests"
    }
  ]
}
```

### Relationship Diagram Concept:

```
+----------------------------------------------------------+
|  Server Collection: tutorial-collection.approve-time     |
+----------------------------------------------------------+
|                                                          |
|                +--------------+                          |
|                | MCP Servers  |                          |
|                +--------------+                          |
|                | ○ tutorial.  |                          |
|                |   time-server|                          |
|                | ○ mcpx.web-  |                          |
|                |   search     |                          |
|                +--------------+                          |
|                       ↓                                  |
|                  [Collection]                            |
|                       ↓                                  |
|                +--------------+                          |
|                | Guard        |                          |
|                | Profiles     |                          |
|                +--------------+                          |
|                | ○ mcp-guard. |                          |
|                |   approve-   |                          |
|                |   tool-call  |                          |
|                +--------------+                          |
|                                                          |
|  Servers in Collection:                                  |
|  +--------------------------------------------------+   |
|  | Server          | Guard Profile                  |   |
|  |-----------------|--------------------------------|   |
|  | tutorial.       | mcp-guardian.                  |   |
|  | time-server     | approve-tool-call-requests     |   |
|  |                 |                                |   |
|  | [+ Add Server]                                   |   |
|  +--------------------------------------------------+   |
+----------------------------------------------------------+
```

### Key Features:
- Visual representation of collection relationships
- Dropdown selection of servers and profiles
- Validation of references (highlighting invalid connections)
- Ability to add/remove/edit connections
- Toggle between visual and table views
- Export directly from the diagram

## 3. Enhanced Message Approval Interface

### Current State:
```
+----------------------------------------------------------+
|  Pending Messages                            [1 Pending] |
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------------------------+   |
|  | [Outbound] ID: outbound_12345678                 |   |
|  |                           [Approve] [Deny]        |   |
|  |--------------------------------------------------|   |
|  | {                                                 |   |
|  |   "method": "tools/call",                        |   |
|  |   "params": {                                     |   |
|  |     "name": "getCurrentTime",                     |   |
|  |     "arguments": {                                |   |
|  |       "timezone": "America/New_York"              |   |
|  |     }                                             |   |
|  |   }                                               |   |
|  | }                                                 |   |
|  +--------------------------------------------------+   |
+----------------------------------------------------------+
```

### Enhanced Interface Concept:

```
+----------------------------------------------------------+
|  Pending Messages                            [1 Pending] |
+----------------------------------------------------------+
|  Filters: [All Types ▼] [All Directions ▼] [All Servers ▼]|
+----------------------------------------------------------+
|                                                          |
|  +--------------------------------------------------+   |
|  | [Outbound] [Tool Call] [tutorial.time-server]    |   |
|  | 18:45:21                          [Approve] [Deny]|   |
|  |--------------------------------------------------|   |
|  | Tool: getCurrentTime                              |   |
|  | Args: timezone = "America/New_York"               |   |
|  |                                                  |   |
|  | [+ Details]                                      |   |
|  |                                                  |   |
|  | Context:                                         |   |
|  | This tool call will retrieve the current time in |   |
|  | the Eastern timezone (New York)                  |   |
|  +--------------------------------------------------+   |
|                                                          |
|  +--------------------------------------------------+   |
|  | [Inbound] [Tool Response] [tutorial.time-server] |   |
|  | 18:45:23                          [Approve] [Deny]|   |
|  |--------------------------------------------------|   |
|  | Response:                                         |   |
|  | Current time in New York: 6:45 PM EDT            |   |
|  |                                                  |   |
|  +--------------------------------------------------+   |
+----------------------------------------------------------+
```

### Key Features:
- Filtering by message type, direction, server
- Improved message rendering with contextual formatting
- Context panel explaining the purpose of the message
- Grouping of related requests/responses
- Timeline view option
- History of previous approvals/denials

## 4. Guided Creation Wizard

### Current State (Create Dialog):
```
+----------------------------------------------------------+
|  Create New MCP Server                          [X]      |
+----------------------------------------------------------+
|                                                          |
|  Namespace: [                                      ]     |
|                                                          |
|  Name: [                                           ]     |
|                                                          |
|  Configuration:                                          |
|  +--------------------------------------------------+   |
|  | {                                                |   |
|  |   "cmd": "",                                     |   |
|  |   "args": [],                                    |   |
|  |   "env": {}                                      |   |
|  | }                                                |   |
|  +--------------------------------------------------+   |
|                                                          |
|                                [Cancel] [Create Server]  |
+----------------------------------------------------------+
```

### Wizard Concept:

```
+----------------------------------------------------------+
|  Create New MCP Server                          [X]      |
+----------------------------------------------------------+
|  Step 1 of 3: Choose Server Type                         |
+----------------------------------------------------------+
|                                                          |
|  [ ] Start from scratch                                  |
|  [X] Use template                                        |
|                                                          |
|  Select a template:                                      |
|  +--------------------------------------------------+   |
|  | [Time Server     ▼]                              |   |
|  +--------------------------------------------------+   |
|                                                          |
|  Template description:                                   |
|  The Time Server provides time-related functions,        |
|  including current time in different timezones, date     |
|  calculations, and formatting.                           |
|                                                          |
|  Preview:                                                |
|  +--------------------------------------------------+   |
|  | cmd: "uvx"                                       |   |
|  | args: ["mcp-server-time"]                        |   |
|  +--------------------------------------------------+   |
|                                                          |
|                                  [Cancel] [Next >]       |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Create New MCP Server                          [X]      |
+----------------------------------------------------------+
|  Step 2 of 3: Configure Server                           |
+----------------------------------------------------------+
|                                                          |
|  Server Details:                                         |
|                                                          |
|  Namespace: [tutorial                             ]      |
|  Name:      [time-server                          ]      |
|                                                          |
|  Server Configuration:                                   |
|                                                          |
|  Command:   [uvx                                  ]      |
|  Arguments: [mcp-server-time                      ]      |
|             [--local-timezone=America/New_York    ] [+]  |
|                                                          |
|  Environment Variables:                                  |
|  [+ Add Variable]                                        |
|                                                          |
|                            [< Back] [Cancel] [Next >]    |
+----------------------------------------------------------+

+----------------------------------------------------------+
|  Create New MCP Server                          [X]      |
+----------------------------------------------------------+
|  Step 3 of 3: Review and Create                          |
+----------------------------------------------------------+
|                                                          |
|  Server Summary:                                         |
|                                                          |
|  Name: tutorial.time-server                              |
|  Type: Time Server                                       |
|                                                          |
|  Configuration:                                          |
|  +--------------------------------------------------+   |
|  | {                                                |   |
|  |   "cmd": "uvx",                                  |   |
|  |   "args": [                                      |   |
|  |     "mcp-server-time",                           |   |
|  |     "--local-timezone=America/New_York"          |   |
|  |   ],                                             |   |
|  |   "env": {}                                      |   |
|  | }                                                |   |
|  +--------------------------------------------------+   |
|                                                          |
|                            [< Back] [Cancel] [Create]    |
+----------------------------------------------------------+
```

### Key Features:
- Step-by-step guided creation process
- Templates and presets for common configurations
- Form-based input instead of JSON editing
- Live preview of the resulting configuration
- Validation at each step
- Ability to go back and modify previous steps

## 5. Quick Actions Panel

### Concept:

```
+----------------------------------------------------------+
|  MCP Guardian                                            |
+----------------------------------------------------------+
|  [Dashboard] [MCP Servers] [Guard Profiles] [Collections]|
+----------------------------------------------------------+
|                                                          |
|  Quick Actions                                           |
|  +--------------------------------------------------+   |
|  | [🔧 Create New Server]    [🛡️ Create Profile]    |   |
|  | [📦 Create Collection]    [📤 Export to Claude]  |   |
|  +--------------------------------------------------+   |
|                                                          |
|  Recent Items                                            |
|  +--------------------------------------------------+   |
|  | Server: tutorial.time-server                     |   |
|  | Profile: custom.my-approval-profile              |   |
|  | Collection: my-collection.time-tools             |   |
|  +--------------------------------------------------+   |
|                                                          |
|  Suggested Actions                                       |
|  +--------------------------------------------------+   |
|  | Create a guard profile for tutorial.time-server  |   |
|  | Export my-collection.time-tools to Claude        |   |
|  | Check pending messages (1 awaiting approval)     |   |
|  +--------------------------------------------------+   |
+----------------------------------------------------------+
```

### Key Features:
- One-click access to common actions
- Recently used items for quick access
- Contextual suggestions based on system state
- Notification indicators for pending items
- Customizable dashboard layout

## 6. Guard Profile Templates Gallery

### Concept:

```
+----------------------------------------------------------+
|  Guard Profile Templates                         [X]     |
+----------------------------------------------------------+
|                                                          |
|  +---------------+  +---------------+  +---------------+ |
|  | Approve Tool  |  | Log Only     |  | Approve All   | |
|  | Calls         |  |              |  | Messages      | |
|  |               |  |               |  |               | |
|  | [Select]      |  | [Select]      |  | [Select]      | |
|  +---------------+  +---------------+  +---------------+ |
|                                                          |
|  +---------------+  +---------------+  +---------------+ |
|  | Filter by     |  | Chain         |  | + Custom     | |
|  | Method        |  | Multiple      |  | Template     | |
|  |               |  |               |  |               | |
|  | [Select]      |  | [Select]      |  | [Create]      | |
|  +---------------+  +---------------+  +---------------+ |
|                                                          |
|  Template Details:                                       |
|  +--------------------------------------------------+   |
|  | Name: Approve Tool Calls                         |   |
|  |                                                  |   |
|  | Description: Requires manual approval for all    |   |
|  | outbound tool call requests, while allowing      |   |
|  | other traffic to pass through.                   |   |
|  |                                                  |   |
|  | Components:                                      |   |
|  | - Message Logger                                 |   |
|  | - Filter (for tool calls)                        |   |
|  | - Manual Approval                                |   |
|  +--------------------------------------------------+   |
|                                                          |
|                                  [Cancel] [Use Template] |
+----------------------------------------------------------+
```

### Key Features:
- Visual gallery of pre-defined templates
- Preview and details for each template
- One-click template selection
- Ability to customize templates
- Create and save custom templates
- Categories for different use cases

These visual concepts provide a foundation for implementing the UX improvements in Phase 4. Each concept addresses specific pain points in the current interface while maintaining consistency with the existing design language and architecture.