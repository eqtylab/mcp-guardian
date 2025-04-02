# React Flow Notes for Guard Profile Visual Builder

This document contains key notes and references from exploring the React Flow documentation, focused specifically on how to implement the Guard Profile Visual Builder planned for Phase 4.

## Overview

React Flow is a highly customizable library for building node-based editors, graphs, and interactive diagrams. It's well-suited for our Guard Profile Visual Builder which needs to display and allow manipulation of message interceptor chains.

## Installation and Setup

```bash
npm install @xyflow/react
```

Important: Always import the styles:
```javascript
import '@xyflow/react/dist/style.css';
```

## Core Concepts

### Basic Structure

- **Nodes**: Individual elements in the flow (will represent our interceptors)
- **Edges**: Connections between nodes (will represent message flow between interceptors)
- **Handles**: Connection points on nodes (source/target) where edges can be attached
- **Viewport**: The visible area of the flow (panning/zooming)

### Node and Edge Structure

**Node Object Structure**:
```javascript
{
  id: 'unique-id',                    // Required: unique identifier
  type: 'default',                    // Optional: node type (default, input, output, or custom)
  position: { x: 100, y: 200 },       // Required: position on canvas
  data: { label: 'Node Content' },    // Required: data for the node (passed to components)
  style: { border: '1px solid #777' } // Optional: inline styles
}
```

**Edge Object Structure**:
```javascript
{
  id: 'edge-id',                // Required: unique identifier
  source: 'source-node-id',     // Required: id of source node
  target: 'target-node-id',     // Required: id of target node
  sourceHandle: 'handle-id-a',  // Optional: id of source handle (for multiple handles)
  targetHandle: 'handle-id-b',  // Optional: id of target handle (for multiple handles)
  type: 'default',              // Optional: edge type (default, straight, step, etc.)
  animated: true,               // Optional: animations
  style: { stroke: '#f00' }     // Optional: inline styles
}
```

## State Management

React Flow provides hooks for managing node and edge state in a controlled manner:

```javascript
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

// For handling new connections between nodes
const onConnect = useCallback(
  (connection) => setEdges((eds) => addEdge(connection, eds)),
  [setEdges]
);

// Use in component
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
/>
```

## Custom Nodes

For the Guard Profile Visual Builder, we'll need custom nodes for different interceptor types:

1. Create a custom node component:

```jsx
import { Handle, Position } from '@xyflow/react';

function FilterInterceptorNode({ data, selected }) {
  return (
    <div className={`interceptor-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div className="interceptor-content">
        <div className="interceptor-header">Filter</div>
        <div className="interceptor-body">
          Pattern: {data.matchPattern}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}

export default FilterInterceptorNode;
```

2. Register the custom node types:

```jsx
// Define node types (outside component to prevent re-renders)
const nodeTypes = {
  filter: FilterInterceptorNode,
  messageLog: MessageLogInterceptorNode,
  manualApproval: ManualApprovalInterceptorNode,
  chain: ChainInterceptorNode
};

// In component
<ReactFlow nodeTypes={nodeTypes} />
```

3. Use the custom node types in your node objects:

```javascript
const nodes = [
  {
    id: 'filter-1',
    type: 'filter',
    position: { x: 250, y: 25 },
    data: { matchPattern: 'content.*sensitive' }
  }
];
```

## Key Features for Guard Profile Builder

### 1. Multiple Handles

For complex interceptors that can connect to multiple targets, we need multiple handles:

```jsx
<Handle type="source" position={Position.Bottom} id="a" />
<Handle 
  type="source" 
  position={Position.Bottom} 
  id="b" 
  style={{ left: 10 }}
/>
```

When defining edges, specify the handle:

```javascript
{
  id: 'edge-1',
  source: 'node-1',
  sourceHandle: 'a',  // Specify which handle to use
  target: 'node-2'
}
```

### 2. Preventing Default Behaviors

For interactive elements inside nodes (e.g., form controls), prevent unwanted behaviors:

- `nodrag` class: Prevents dragging when interacting with the element
- `nowheel` class: Prevents canvas panning when scrolling inside the element

```jsx
<input className="nodrag" onChange={onChange} />
<div className="nowheel" style={{ overflow: 'auto' }}>
  <p>Scrollable content</p>
</div>
```

### 3. Customizing Node Appearance

For visual differentiation between interceptor types:

```jsx
// Applying styles based on interceptor type
<div 
  className={`interceptor-node interceptor-${data.type}`}
  style={{
    border: selected ? '2px solid #1a192b' : '1px solid #eee',
    padding: 10,
    borderRadius: 5,
    background: data.valid ? '#fff' : '#ffecec'
  }}
>
  {/* Node content */}
</div>
```

### 4. Node Editing

For editing node properties, we need to implement a property panel that updates when a node is selected:

```jsx
const [selectedNode, setSelectedNode] = useState(null);

// Update when a node is selected
const onNodeClick = useCallback((_, node) => {
  setSelectedNode(node);
}, []);

// Update node properties
const onPropertyChange = useCallback((nodeId, data) => {
  setNodes((nds) => 
    nds.map((n) => (n.id === nodeId ? { ...n, data } : n))
  );
}, [setNodes]);

// Use in component
<ReactFlow
  onNodeClick={onNodeClick}
  // other props...
/>
{selectedNode && (
  <PropertyPanel
    node={selectedNode}
    onChange={(data) => onPropertyChange(selectedNode.id, data)}
  />
)}
```

## Visual Builder Implementation Strategy

Based on React Flow's capabilities, here's the implementation strategy for the Guard Profile Visual Builder:

1. **Component Structure**:
   - Main container with React Flow and property panel side-by-side
   - Toolbox for adding new interceptor nodes
   - Custom node components for each interceptor type
   - Property forms specific to each interceptor type

2. **Data Transformation**:
   - Convert GuardProfile structure to React Flow nodes/edges
   - Convert back from React Flow to GuardProfile
   - Maintain synchronization during edits

3. **Interactions**:
   - Drag from toolbox to add new nodes
   - Connect nodes by dragging between handles
   - Select node to edit properties
   - Delete nodes with keyboard or context menu
   - Validate connections for correctness

4. **Styles and Visual Cues**:
   - Color-coded nodes by interceptor type
   - Visual indicators for validation issues
   - Connection animations to show message flow direction
   - Consistent styling with application theme

## Example Implementation Outline

```jsx
function GuardProfileVisualBuilder({ profile, onChange }) {
  // Convert profile to nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => 
    convertProfileToFlow(profile), [profile]);
  
  // State for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Handle connections
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);
  
  // Update profile when nodes/edges change
  useEffect(() => {
    const updatedProfile = convertFlowToProfile(nodes, edges);
    onChange(updatedProfile);
  }, [nodes, edges, onChange]);
  
  return (
    <div className="guard-profile-visual-builder">
      <div className="toolbox">
        <InterceptorToolbox onDragStart={/* ... */} />
      </div>
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      <div className="property-panel">
        <PropertyPanel /* ... */ />
      </div>
    </div>
  );
}
```

## Conclusion

React Flow provides all the necessary building blocks for implementing the Guard Profile Visual Builder. Its flexible architecture allows us to create custom nodes and edges that precisely match our requirements for visualizing and editing interceptor chains.

The main implementation challenges will be:
1. Converting between the GuardProfile data structure and React Flow's nodes/edges format
2. Creating intuitive editing interfaces for each interceptor type
3. Implementing validation to ensure correctness
4. Maintaining synchronized state between the visual representation and the underlying data model

With React Flow's hooks and customization options, we can create a powerful visual editor that significantly improves the user experience for creating and editing Guard Profiles.