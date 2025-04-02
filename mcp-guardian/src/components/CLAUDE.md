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
