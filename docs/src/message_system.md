# MCP Guardian Message System

This guide explains how the message approval system works in MCP Guardian, both from a user perspective and for developers working on the system.

## Overview

MCP Guardian can intercept messages between clients and MCP servers, allowing for review and manual approval of messages. This is a critical security feature that helps govern communications and prevent unwanted access.

## Message Flow Architecture

1. **Proxy Interception**: MCP Guardian acts as a proxy between clients and MCP servers
2. **Guard Profile Filtering**: Messages can be filtered based on configured guard profiles
3. **Manual Approval**: When configured, messages require manual review
4. **Message Lifecycle**: Messages move from pending → approved/denied states

## Message Storage

Messages are stored as JSON files in the filesystem:

```
~/.mcp-guardian/message-approvals/
├── pending/      - Messages awaiting review
├── approved/     - Messages that were approved
└── denied/       - Messages that were rejected
```

## Message Types

MCP Guardian handles two primary message directions:

1. **Outbound Messages**: Client → MCP Server
   - File prefix: `outbound_`
   - Examples: Tool calls, queries, user messages
   - Format varies based on message type

2. **Inbound Messages**: MCP Server → Client
   - File prefix: `inbound_`
   - Examples: Tool responses, AI messages
   - Often contain result content

## Technical Implementation

The message approval system is implemented across several components:

- **Core Logic**: `message_approval.rs` handles file operations and status management
- **Directory Management**: `dirs.rs` defines paths and ensures directories exist
- **UI Components**: `pending-messages-page.tsx` and related components display messages

## How Approval Works

1. Messages requiring approval are written to the pending directory
2. The application polls the pending directory every 250ms
3. Users review messages and click Approve or Deny
4. Approved/denied messages are moved to respective directories
5. The MCP Guardian proxy checks these directories to determine message status

## Developing with the Message System

### Simulating Messages for Testing

You can create test messages by writing JSON files to the pending directory:

1. Create a file with the appropriate prefix (outbound_/inbound_)
2. Write valid JSON content for the message type
3. Place it in `~/.mcp-guardian/message-approvals/pending/`

### Example Messages

#### Outbound Tool Call

```json
{
  "method": "tools/call",
  "params": {
    "name": "fetch_weather_data",
    "arguments": {
      "location": "San Francisco",
      "units": "metric",
      "forecast_days": 3
    }
  }
}
```

#### Inbound Tool Response

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"forecast\": [...]}}"
      }
    ]
  }
}
```

### Creating Sample Messages Programmatically

You can use this Rust script to generate sample messages:

```rust
use std::fs::{self, create_dir_all};
use std::path::PathBuf;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Get user's home directory
    let home = std::env::var("HOME")?;
    
    // Define app directories
    let app_dir = PathBuf::from(&home)
        .join(".mcp-guardian");
    
    let pending_dir = app_dir.join("message-approvals/pending");
    
    // Create directory structure if it doesn't exist
    create_dir_all(&pending_dir)?;
    
    // Write sample message
    fs::write(
        pending_dir.join("outbound_example_toolcall_1"),
        r#"{
  "method": "tools/call",
  "params": {
    "name": "example_tool",
    "arguments": {
      "param1": "value1"
    }
  }
}"#,
    )?;
    
    println!("Sample message created!");
    Ok(())
}
```

## Best Practices

1. Always use descriptive message IDs
2. Include comprehensive metadata for easier debugging
3. Test with a variety of message formats
4. Use the simulator for UI testing without needing a full proxy setup