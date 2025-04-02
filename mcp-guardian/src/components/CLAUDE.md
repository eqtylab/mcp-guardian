Always aim to keep component files small and focused.
Use modular and functional design principles.

## UX Improvements for Entity Management

### Sidebar Navigation Implementation

Improved the user experience for entity management screens (MCP Servers, Guard Profiles, Server Collections) by implementing a sidebar-based navigation pattern.

#### Key Features

1. **Sidebar Navigation** - Each entity management page now has:
   - A left sidebar listing all available entities
   - Sections for Core and Custom entities where applicable
   - Search filtering for quick entity location
   - Icon-based visual indicators

2. **Clean Entity Detail View**
   - Selected entity appears in the main content area
   - All entity configuration options shown in full width
   - Empty state UI guides users to select or create entities
   - Improved visual hierarchy

3. **Implementation Notes**
   - Created reusable sidebar components
   - Modified entity components to work with both collapsible and full-width modes
   - Added search filtering for all entity lists
   - Included clear visual indicators for the selected entity

This implementation improves the overall UX by:
- Reducing visual clutter of collapsible cards
- Making it easier to navigate between entities
- Providing better organization of core vs. custom entities
- Adding search functionality for faster access
- Creating a more modern, app-like experience

### Guard Profile Builder Component

#### Key Implementation Details

- Uses React Flow (from @xyflow/react) to visualize and edit guard profile configurations
- Two-way conversion between GuardProfile JSON and visual representation
- All interceptor types supported: Filter, Chain, MessageLog, ManualApproval

#### Component Structure

```
src/components/guard-profile-builder/
├── index.tsx                 # Main component and conversion logic
├── interceptor-toolbox.tsx   # Toolbox for adding interceptors
├── property-panel.tsx        # Panel for editing node properties
└── nodes/                    # Visual representation of interceptor types
    ├── chain-node.tsx
    ├── filter-node.tsx
    ├── manualapproval-node.tsx
    └── messagelog-node.tsx
```

#### Type Definitions

- Each node type has a corresponding interface that extends Record<string, unknown>
- The core interfaces are FilterNodeData, MessageLogNodeData, ManualApprovalNodeData, and ChainNodeData
- GuardProfileNode is a union type of all node types

#### Advanced Usage

- convertProfileToFlow(): Converts GuardProfile JSON to ReactFlow nodes and edges
- convertFlowToProfile(): Converts ReactFlow nodes and edges back to GuardProfile
- When implementing changes, ensure both conversion functions are updated
- Chain interceptors are implemented as linked nodes with animated edges
