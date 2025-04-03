# Guard Profile Visual Builder Implementation Guide

This document provides detailed guidance for implementing the Guard Profile Visual Builder, one of the key UX improvements planned for Phase 4.

## Overview

The Guard Profile Visual Builder is a node-based visual editor that allows users to create and configure message interceptor chains without directly editing JSON. It represents a significant improvement in usability for one of the most complex aspects of MCP Guardian.

## Component Architecture

The Guard Profile Visual Builder consists of several interconnected components:

```
GuardProfileVisualBuilder
├── InterceptorToolbox
├── FlowCanvas
│   ├── InterceptorNode (multiple)
│   │   └── NodeHandle (input/output)
│   └── ConnectionLine (multiple)
└── PropertyPanel
    └── InterceptorPropertyForm
```

### Key Components

1. **GuardProfileVisualBuilder**: The container component that manages the overall state and coordinates between subcomponents
2. **InterceptorToolbox**: Palette of available interceptor types that can be dragged onto the canvas
3. **FlowCanvas**: The main canvas area where nodes are arranged and connected
4. **InterceptorNode**: Visual representation of a specific interceptor
5. **PropertyPanel**: Configures properties of the selected interceptor

## Technical Implementation

### React Flow Integration

We'll use React Flow (from xyflow) as the foundation for our node-based editor. This library provides:

- Node positioning and management
- Edge connections and routing
- Drag-and-drop functionality
- Zoom and pan controls
- Selection mechanisms

### State Management

The component will maintain two synchronized representations of the guard profile:

1. **Visual State**: Nodes and edges in the React Flow format
2. **Data Model**: The standard `GuardProfile` format used by the application

These will be kept in sync through transformation functions:

```tsx
// Convert GuardProfile to React Flow nodes and edges
const { nodes, edges } = convertProfileToFlow(guardProfile);

// Convert React Flow nodes and edges back to GuardProfile
const updatedProfile = convertFlowToProfile(nodes, edges);
```

### Custom Node Types

We'll implement custom node types for each interceptor type:

1. **FilterNode**: For filter interceptors
2. **ChainNode**: For chain interceptors
3. **MessageLogNode**: For message log interceptors
4. **ManualApprovalNode**: For manual approval interceptors

Each node type will have a distinct visual appearance and set of configurable properties.

## Detailed Component Specifications

### GuardProfileVisualBuilder

```tsx
interface GuardProfileVisualBuilderProps {
  profile: GuardProfile;
  onChange: (profile: GuardProfile) => void;
  onSave?: () => void;
  readOnly?: boolean;
}

const GuardProfileVisualBuilder: React.FC<GuardProfileVisualBuilderProps> = ({
  profile,
  onChange,
  onSave,
  readOnly = false
}) => {
  // Implementation using React Flow
  // ...
};
```

Key responsibilities:
- Initialize React Flow with nodes and edges from the profile
- Provide drag-and-drop functionality for adding new nodes
- Handle node selection to show properties
- Keep visual representation and data model in sync
- Provide JSON/visual toggle functionality

### Container-Based Chain Visualization

In the improved implementation, Chain nodes will be visualized as containers that wrap their child nodes, providing a clearer mental model of the relationship.

```tsx
interface ChainContainerNodeProps {
  data: ChainNodeData;
  selected: boolean;
  id: string;
  children: React.ReactNode;
}

const ChainContainerNode: React.FC<ChainContainerNodeProps> = ({
  data,
  selected,
  id,
  children
}) => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className={`chain-container ${selected ? 'selected' : ''} ${collapsed ? 'collapsed' : ''}`}>
      <div className="chain-header">
        <h3>Chain Interceptor</h3>
        <div className="chain-controls">
          <span className="interceptor-count">{data.chain.length} interceptors</span>
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>
      
      {!collapsed && (
        <div className="chain-content">
          {children}
        </div>
      )}
    </div>
  );
};
```

Key features:
- Visual container with distinct styling to indicate containment
- Header with title, metadata, and controls
- Collapsible for managing visual complexity
- Clear sequence visualization for child nodes
- Support for dragging nodes in/out to modify chain composition

### InterceptorNode

```tsx
interface InterceptorNodeProps {
  id: string;
  type: string; // 'filter', 'chain', 'messagelog', 'manualapproval'
  data: any;
  selected: boolean;
  onEdit: (id: string, data: any) => void;
}

const InterceptorNode: React.FC<InterceptorNodeProps> = ({
  id,
  type,
  data,
  selected,
  onEdit
}) => {
  // Implementation of a specific node type
  // ...
};
```

Key responsibilities:
- Render node with appropriate visual style for its type
- Show key properties in compact form
- Provide handles for connections
- Handle selection events
- Provide edit functionality

### PropertyPanel

```tsx
interface PropertyPanelProps {
  selectedNode: NodeData | null;
  onPropertyChange: (nodeId: string, data: any) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  onPropertyChange
}) => {
  // Implementation of property panel
  // ...
};
```

Key responsibilities:
- Show properties for selected node
- Provide appropriate editors for each property type
- Validate property values
- Update node data on changes
- Hide when no node is selected

## Two-Way Synchronization

A critical aspect of this component is maintaining synchronization between the visual representation and the underlying data model.

### GuardProfile to React Flow

Converting from a GuardProfile to React Flow nodes and edges:

```tsx
function convertProfileToFlow(profile: GuardProfile): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Start with the primary interceptor
  const primaryId = 'node-1';
  addInterceptorToNodes(profile.primary_message_interceptor, primaryId, nodes);
  
  // For chain interceptors, add child nodes and connect them
  processChainNodes(nodes, edges);
  
  // Position nodes in a sensible layout
  layoutNodes(nodes);
  
  return { nodes, edges };
}
```

### React Flow to GuardProfile

Converting from React Flow back to a GuardProfile:

```tsx
function convertFlowToProfile(nodes: Node[], edges: Edge[]): GuardProfile {
  // Find the entry node (usually has no incoming edges)
  const entryNode = findEntryNode(nodes, edges);
  
  // Recursively build the interceptor structure
  const primaryInterceptor = buildInterceptorFromNode(entryNode.id, nodes, edges);
  
  return {
    primary_message_interceptor: primaryInterceptor
  };
}
```

## Error Handling and Validation

The visual builder must prevent users from creating invalid configurations.

### Validation Checks

1. **Connection Validation**: Prevent invalid connections between nodes
2. **Required Properties**: Ensure all required properties have values
3. **Cycle Detection**: Prevent creating cycles in the interceptor chain
4. **Orphaned Nodes**: Detect and highlight nodes not connected to the main chain

### Visual Feedback

1. **Color Coding**: Red borders/highlights for invalid nodes
2. **Warning Icons**: Icons to indicate validation issues
3. **Tooltips**: Explanatory tooltips for validation errors
4. **Disabled Save**: Prevent saving invalid configurations

## User Interactions

### Adding Interceptors

1. User drags an interceptor type from the toolbox onto the canvas
2. A new node of the selected type appears where dropped
3. The property panel automatically opens for the new node
4. User configures the node's properties
5. User connects the node to the chain by drawing a connection

### Editing Interceptors

1. User clicks on an existing node
2. The property panel shows that node's properties
3. User edits properties as needed
4. Changes update in real-time
5. Node visual representation may update to reflect changes

### Deleting Interceptors

1. User selects a node
2. User presses Delete key or clicks a remove button
3. Confirmation dialog appears for safety
4. On confirmation, node is removed
5. Connections to that node are also removed

### Rearranging the Chain

1. User drags nodes to reposition them
2. User can disconnect and reconnect nodes by dragging from connection points
3. Chain structure updates with new arrangement

## Progressive Enhancement

The visual builder will be implemented with progressive enhancement in mind:

1. **JSON Toggle**: Allow switching between visual and JSON representations
2. **Keyboard Accessibility**: Full keyboard navigation for all operations
3. **Fallback Mode**: If visual editor has issues, users can fall back to JSON
4. **Graceful Degradation**: Handle complex configurations as best as possible

## Implementation Phases

The implementation will be broken down into manageable phases:

### Phase 1: Basic Canvas and Nodes

- Set up React Flow integration
- Implement basic node types
- Create simple property panel
- Establish two-way data binding

### Phase 2: Interaction Refinement

- Add toolbox for creating new nodes
- Implement validation and feedback
- Add connection rules and constraints
- Improve property editors

### Phase 3: Advanced Features

- Add undo/redo functionality
- Implement import/export
- Add templates and presets
- Improve visual design and animations

## Testing Strategy

The visual builder requires thorough testing:

1. **Unit Tests**: For conversion functions and validation logic
2. **Component Tests**: For individual nodes and panels
3. **Integration Tests**: For the overall builder
4. **User Testing**: With real users on realistic scenarios

Key test scenarios:
- Converting between visual and JSON representations
- Creating chains with each interceptor type
- Validating configurations
- Handling edge cases (very complex chains, etc.)

## Accessibility Considerations

The visual builder must be accessible:

1. **Keyboard Navigation**: Full keyboard support for all operations
2. **Screen Reader Support**: ARIA roles and descriptions
3. **High Contrast Mode**: Visible in high contrast settings
4. **Focus Management**: Clear focus indicators
5. **Alternative Text**: For visual elements
6. **Reduced Motion**: Option for users who prefer minimal animation

## Example Implementation

Here's a simplified example of the core component:

```tsx
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Edge,
  MarkerType,
  Node,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { FilterNode, ChainNode, MessageLogNode, ManualApprovalNode } from './nodes';
import { InterceptorToolbox } from './InterceptorToolbox';
import { PropertyPanel } from './PropertyPanel';
import { convertProfileToFlow, convertFlowToProfile } from './conversions';

// Node types mapping
const nodeTypes = {
  filter: FilterNode,
  chain: ChainNode,
  messagelog: MessageLogNode,
  manualapproval: ManualApprovalNode,
};

const GuardProfileVisualBuilder: React.FC<GuardProfileVisualBuilderProps> = ({
  profile,
  onChange,
  onSave,
  readOnly = false
}) => {
  // Convert profile to initial nodes and edges
  const initialFlow = convertProfileToFlow(profile);
  
  // Set up React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // Handle new connections
  const onConnect = useCallback((params) => {
    // Add the new edge
    setEdges((eds) => addEdge({
      ...params,
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: true
    }, eds));
    
    // Update the profile based on the new connection
    const updatedProfile = convertFlowToProfile(nodes, [
      ...edges, 
      { id: `e-${params.source}-${params.target}`, source: params.source, target: params.target }
    ]);
    onChange(updatedProfile);
  }, [nodes, edges, onChange, setEdges]);
  
  // Handle node selection
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);
  
  // Handle property changes
  const onPropertyChange = useCallback((nodeId, data) => {
    setNodes((nds) => 
      nds.map((n) => (n.id === nodeId ? { ...n, data } : n))
    );
    
    // Update the profile
    const updatedNodes = nodes.map(n => n.id === nodeId ? { ...n, data } : n);
    const updatedProfile = convertFlowToProfile(updatedNodes, edges);
    onChange(updatedProfile);
  }, [nodes, edges, onChange, setNodes]);
  
  // Handle adding a new node from the toolbox
  const onAddNode = useCallback((type, position) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      position,
      data: getDefaultDataForType(type),
    };
    
    setNodes((nds) => [...nds, newNode]);
    setSelectedNode(newNode);
  }, [setNodes]);
  
  // Update when profile changes externally
  useEffect(() => {
    const newFlow = convertProfileToFlow(profile);
    setNodes(newFlow.nodes);
    setEdges(newFlow.edges);
  }, [profile, setNodes, setEdges]);
  
  return (
    <div className="guard-profile-visual-builder">
      <div className="toolbox-container">
        <InterceptorToolbox onAddNode={onAddNode} disabled={readOnly} />
      </div>
      
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          readOnly={readOnly}
        >
          <Background variant="dots" gap={12} size={1} />
          <Controls />
        </ReactFlow>
      </div>
      
      <div className="property-panel-container">
        {selectedNode && (
          <PropertyPanel
            selectedNode={selectedNode}
            onPropertyChange={onPropertyChange}
            readOnly={readOnly}
          />
        )}
      </div>
    </div>
  );
};

export default GuardProfileVisualBuilder;
```

## Conclusion

The Guard Profile Visual Builder represents a significant improvement in the user experience for one of MCP Guardian's most complex features. By providing a visual, intuitive interface for building interceptor chains, we reduce the learning curve and potential for errors.

This component serves as a flagship example of the Phase 4 UX improvements, demonstrating the application's evolution toward more visual, user-friendly interfaces while maintaining the power and flexibility of the underlying system.