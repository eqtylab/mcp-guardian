# Visual Concepts for Phase 4 UX Improvements

This document provides conceptual descriptions of the visual components planned for Phase 4, outlining their appearance, behavior, and user interaction patterns.

## Guard Profile Visual Builder

The Guard Profile Visual Builder will provide a node-based visual editor for creating and configuring message interceptor chains.

### Visual Appearance

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Guard Profile Visual Builder                                   [JSON ⇄] │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────┐                                                             │
│ │         │  Interceptor Toolbox                                        │
│ │ Toolbox │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│ │         │  │  Chain  │  │ Filter  │  │ Log     │  │ Manual  │        │
│ └─────────┘  │         │  │         │  │         │  │ Approval│        │
│              └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                                                                     │ │
│ │ Flow Visualization Area                                            │ │
│ │                                                                     │ │
│ │     ┌─────────────┐         ┌─────────────┐        ┌─────────────┐ │ │
│ │     │             │         │             │        │             │ │ │
│ │     │   Filter    │ ──────> │  Message    │ ─────> │   Manual    │ │ │
│ │     │ Interceptor │         │    Log      │        │  Approval   │ │ │
│ │     │             │         │             │        │             │ │ │
│ │     └─────────────┘         └─────────────┘        └─────────────┘ │ │
│ │                                                                     │ │
│ │                                                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Properties Panel                                                    │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Filter Interceptor Properties                                   │ │ │
│ │ │                                                                 │ │ │
│ │ │ ○ Filter Type: [Message Content ▼]                             │ │ │
│ │ │                                                                 │ │ │
│ │ │ ○ Match Pattern: [                                           ] │ │ │
│ │ │                                                                 │ │ │
│ │ │ ○ Action:        [Allow ▼]                                     │ │ │
│ │ │                                                                 │ │ │
│ │ │ ○ Description:   [                                           ] │ │ │
│ │ │                                                                 │ │ │
│ │ │                                      [Apply] [Cancel]          │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Interaction Patterns

1. **Drag and Drop Creation**:
   - Users drag interceptor types from the toolbox onto the flow area
   - Nodes automatically snap to a grid for alignment
   - Visual feedback indicates valid drop zones

2. **Node Connection**:
   - Clicking and dragging from a node's output handle to another node's input handle creates a connection
   - Visual feedback indicates valid connection points
   - Connections automatically route for clarity

3. **Node Selection**:
   - Single-click selects a node, showing its properties in the panel
   - Multiple selection with shift-click or marquee selection
   - Selected nodes have a highlighted visual state

4. **Property Editing**:
   - Properties panel updates to show selected node's properties
   - Changes apply in real-time to the visual representation
   - Type-specific editors (dropdown for enumeration, text for strings, etc.)

5. **View Modes**:
   - Toggle between visual builder and JSON representation
   - Two-way synchronization between views
   - Option to view both simultaneously in a split view

## Server Collection Relationship Diagram

The Server Collection Relationship Diagram visualizes connections between MCP Servers and Guard Profiles.

### Visual Appearance

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Server Collection Diagram                                    [JSON ⇄]   │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │                                                                     │ │
│ │                       Relationship Diagram                          │ │
│ │                                                                     │ │
│ │  ┌────────────────┐                          ┌────────────────────┐ │ │
│ │  │                │                          │                    │ │ │
│ │  │  MCP Server    │                          │   Guard Profile    │ │ │
│ │  │  "claude-3"    │ ───────────────────────> │   "log-only"       │ │ │
│ │  │                │                          │                    │ │ │
│ │  └────────────────┘                          └────────────────────┘ │ │
│ │                                                                     │ │
│ │  ┌────────────────┐                          ┌────────────────────┐ │ │
│ │  │                │                          │                    │ │ │
│ │  │  MCP Server    │ ───────────────────────> │   Guard Profile    │ │ │
│ │  │  "bedrock"     │                          │   "approve-tools"   │ │ │
│ │  │                │                          │                    │ │ │
│ │  └────────────────┘                          └────────────────────┘ │ │
│ │                                                                     │ │
│ │  ┌────────────────┐         ┌────────────┐                          │ │
│ │  │                │─────────| ? MISSING  |                          │ │
│ │  │  MCP Server    │         | PROFILE    |                          │ │
│ │  │  "vertex"      │         └────────────┘                          │ │
│ │  │                │                                                 │ │
│ │  └────────────────┘                                                 │ │
│ │                                                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Server-Profile Connections                                          │ │
│ │ ┌───────────────┬──────────────────────┬─────────────────────────┐  │ │
│ │ │ Server        │ Profile              │ Actions                 │  │ │
│ │ ├───────────────┼──────────────────────┼─────────────────────────┤  │ │
│ │ │ claude-3      │ log-only             │ [Edit] [Remove]         │  │ │
│ │ │ bedrock       │ approve-tools        │ [Edit] [Remove]         │  │ │
│ │ │ vertex        │ <missing reference>   │ [Edit] [Remove]         │  │ │
│ │ └───────────────┴──────────────────────┴─────────────────────────┘  │ │
│ │                                                                     │ │
│ │ [+ Add Connection]                                                  │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Interaction Patterns

1. **Interactive Graph**:
   - Nodes represent servers and profiles
   - Edges represent the connections between them
   - Different node shapes/colors for servers vs. profiles
   - Error indicators for missing/invalid references

2. **Drag and Drop Editing**:
   - Drag existing servers/profiles from a sidebar onto the graph
   - Connect them by dragging between nodes
   - Reposition nodes by dragging

3. **Connection Management**:
   - Add connections via the table interface below
   - Dropdown selectors for available servers and profiles
   - Validation to prevent invalid connections
   - Visual feedback for connection status

4. **Context Menu**:
   - Right-click on nodes or connections for context-specific actions
   - Options like edit, delete, view details
   - Quick add options for new elements

5. **View Modes**:
   - Toggle between visual diagram and tabular list
   - Toggle between visual diagram and JSON editor
   - Filter view by server type or profile type

## Form-Based Server Editor

The Form-Based Server Editor will replace direct JSON editing with structured forms.

### Visual Appearance

```
┌─────────────────────────────────────────────────────────────────────────┐
│ MCP Server Editor                                            [JSON ⇄]   │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Server Details                                                      │ │
│ │ ┌───────────────────┐  ┌───────────────────────────────────────────┐ │ │
│ │ │ Namespace:        │  │ core                                      │ │ │
│ │ └───────────────────┘  └───────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ ┌───────────────────┐  ┌───────────────────────────────────────────┐ │ │
│ │ │ Name:             │  │ claude-3                                  │ │ │
│ │ └───────────────────┘  └───────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Command Configuration                                               │ │
│ │ ┌───────────────────┐  ┌───────────────────────────────────────────┐ │ │
│ │ │ Command:          │  │ python                                    │ │ │
│ │ └───────────────────┘  └───────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ Arguments:                                                          │ │
│ │ ┌───────────────────────────────────────────────────────────────────┐ │ │
│ │ │ -m                                                               │ │ │
│ │ └───────────────────────────────────────────────────────────────────┘ │ │
│ │ ┌───────────────────────────────────────────────────────────────────┐ │ │
│ │ │ anthropic.api_server                                             │ │ │
│ │ └───────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ │ [+ Add Argument]                                                    │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Environment Variables                           [+ Add Variable]    │ │
│ │ ┌─────────────┬─────────────────────────────────┬─────────────────┐ │ │
│ │ │ Key         │ Value                           │ Actions         │ │ │
│ │ ├─────────────┼─────────────────────────────────┼─────────────────┤ │ │
│ │ │ PORT        │ 8000                            │ [Edit] [Remove] │ │ │
│ │ │ API_KEY     │ ●●●●●●●●●●●●●●●●●● [Show/Hide]   │ [Edit] [Remove] │ │ │
│ │ │ DEBUG       │ true                            │ [Edit] [Remove] │ │ │
│ │ └─────────────┴─────────────────────────────────┴─────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ [Save]   [Cancel]                                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Interaction Patterns

1. **Structured Input Fields**:
   - Clearly labeled form fields for all server properties
   - Appropriate input types (text, number, toggle, etc.)
   - Validation with inline error messages
   - Contextual help and tooltips

2. **Dynamic Field Arrays**:
   - Add/remove multiple arguments
   - Reorder items with drag handles
   - Bulk operations (clear all, etc.)

3. **Environment Variable Management**:
   - Tabular interface for variables
   - Special handling for sensitive values (masked by default)
   - Show/hide toggle for sensitive data
   - Add/edit/remove operations

4. **Toggle to JSON**:
   - Switch between form view and JSON editor
   - Two-way sync between views
   - Highlight JSON sections corresponding to form sections

5. **Validation and Feedback**:
   - Real-time validation as users type
   - Clear error messages with suggestions
   - Visual cues for required fields
   - Save button disabled until valid

## Enhanced Message Viewer

The Enhanced Message Viewer will provide improved context and visualization for pending messages.

### Visual Appearance

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Pending Message                                                 #12345  │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Message Context                                                     │ │
│ │                                                                     │ │
│ │ Source: Claude 3 (claude-3.anthropic.com)                          │ │
│ │ Time: 2023-06-15 14:32:10                                          │ │
│ │ Type: Tool Call Request                                            │ │
│ │ Status: Awaiting Approval                                          │ │
│ │                                                                     │ │
│ │ Applied Guard Profile: approve-tool-calls                          │ │
│ │                                                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Message Content                                                     │ │
│ │                                                                     │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ Tool: shell_command                                             │ │ │
│ │ ├─────────────────────────────────────────────────────────────────┤ │ │
│ │ │ Parameters:                                                     │ │ │
│ │ │   command: "ls -la /home/user"                                  │ │ │
│ │ │                                                                 │ │ │
│ │ │ Purpose: List files in user's home directory                    │ │ │
│ │ │                                                                 │ │ │
│ │ │ [View Full Message]                                             │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Related Messages                                                    │ │
│ │                                                                     │ │
│ │ Previous: Request #12344 - User query "List files in my home dir"   │ │
│ │ Previous: Response #12343 - Assistant response to query             │ │
│ │                                                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Approval Decision                                                   │ │
│ │                                                                     │ │
│ │ ○ Approve - Allow this message to proceed                          │ │
│ │ ○ Deny - Block this message                                        │ │
│ │                                                                     │ │
│ │ Notes: [                                                         ] │ │
│ │                                                                     │ │
│ │ [Submit Decision]                                                   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Interaction Patterns

1. **Contextual Information Display**:
   - Clear presentation of message metadata
   - Visual indicators for message type and status
   - Links to related server and profile information
   - Timestamps and sequence information

2. **Structured Content View**:
   - Format based on message type
   - Highlight important fields
   - Collapsible sections for detailed information
   - Syntax highlighting for code blocks

3. **Message Relationship Visualization**:
   - Timeline of related messages
   - Links to navigate between related messages
   - Conversation context when available
   - Visual indication of message flow

4. **Decision Interface**:
   - Clear approval/denial options
   - Optional notes field for decision context
   - Confirmation dialog for potentially dangerous actions
   - Quick approve/deny with keyboard shortcuts

5. **Batch Operations**:
   - Select multiple similar messages
   - Apply same decision to all selected
   - Preview impact of batch operations
   - Bulk approve/deny with confirmation

## Wizard Flow for Guard Profile Creation

The wizard flow will guide users through creating a Guard Profile step by step.

### Visual Appearance

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Create Guard Profile Wizard                                  [2/4]      │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Progress:  [✓ Basics] > [● Interceptors] > [  Chain] > [  Review]   │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Step 2: Select Interceptors                                         │ │
│ │                                                                     │ │
│ │ Choose the interceptors you want to include in your Guard Profile.  │ │
│ │ You'll be able to arrange them in the next step.                    │ │
│ │                                                                     │ │
│ │ Available Interceptor Types:                                        │ │
│ │                                                                     │ │
│ │ [✓] Filter Interceptor                                             │ │
│ │     Control which messages pass through based on content or type    │ │
│ │                                                                     │ │
│ │ [✓] Message Log                                                    │ │
│ │     Log messages for audit and review                              │ │
│ │                                                                     │ │
│ │ [✓] Manual Approval                                                │ │
│ │     Require human approval before messages proceed                  │ │
│ │                                                                     │ │
│ │ [ ] Chain                                                          │ │
│ │     Combine multiple interceptors in sequence                       │ │
│ │                                                                     │ │
│ │                                                                     │ │
│ │ [▼ More Information about Interceptors]                            │ │
│ │                                                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│ [⬅ Back]                                    [Skip ⏭]     [Continue ➡]   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Interaction Patterns

1. **Step Navigation**:
   - Clear progress indicator
   - Next/back navigation
   - Ability to jump between completed steps
   - Skip option for optional steps

2. **Guided Selection**:
   - Checkboxes or radio buttons for options
   - Descriptions and tooltips for each choice
   - Visual previews where appropriate
   - Recommended options highlighted

3. **Progressive Disclosure**:
   - Show only relevant information for current step
   - Expandable sections for additional details
   - Context-sensitive help
   - Validation before proceeding

4. **Branching Logic**:
   - Different subsequent steps based on selections
   - Skip irrelevant steps
   - Conditional field display
   - Dynamic form generation

5. **Preview and Review**:
   - Final step shows complete configuration
   - Option to go back and edit
   - Visual representation of created profile
   - Confirmation before creation

## Implementation Notes

1. **Responsive Design**:
   - All components should adapt to different screen sizes
   - Consider collapse/expand patterns for smaller screens
   - Touch-friendly targets for mobile usage
   - Keyboard accessibility throughout

2. **Visual Consistency**:
   - Maintain consistent visual language across all components
   - Use established color coding (e.g., green for approval, red for denial)
   - Consistent iconography for actions and entity types
   - Clear visual hierarchy

3. **Animation and Transitions**:
   - Subtle animations for state changes
   - Smooth transitions between views
   - Loading states and progress indicators
   - Motion reduced mode for accessibility

4. **Technical Implementation**:
   - React Flow for node-based editors
   - React Hook Form for form handling
   - Framer Motion for animations
   - Radix UI for core components

These visual concepts serve as a guide for implementation, with the actual components being built incrementally according to the Phase 4 roadmap. Each component will be developed with accessibility and performance in mind, ensuring they work well within the existing application architecture.