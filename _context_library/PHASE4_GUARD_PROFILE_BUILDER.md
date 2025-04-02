# Guard Profile Visual Builder - Component Structure

## Overview

The Guard Profile Visual Builder will provide a visual interface for creating and editing guard profiles without requiring direct JSON editing. It will represent the interceptor chain as a flowchart-like interface with nodes for each interceptor, allowing users to add, remove, and configure interceptors visually.

## Component Hierarchy

```
GuardProfileBuilder
├── InterceptorChain
│   ├── InterceptorNode (MessageLog)
│   ├── InterceptorConnection
│   ├── InterceptorNode (Filter)
│   ├── InterceptorConnection
│   └── InterceptorNode (ManualApproval)
├── InterceptorToolbox
│   ├── ToolboxItem (MessageLog)
│   ├── ToolboxItem (Filter)
│   ├── ToolboxItem (ManualApproval)
│   └── ToolboxItem (Chain)
├── InterceptorProperties
│   └── [Dynamic subforms based on selected interceptor]
└── ActionBar
    ├── ViewToggle (Visual/JSON)
    ├── TemplateSelector
    └── SaveButton
```

## Main Components

### 1. GuardProfileBuilder

**Purpose:** Main container component that orchestrates the entire builder interface.

**Props:**
```typescript
interface GuardProfileBuilderProps {
  value: GuardProfile;
  onChange: (value: GuardProfile) => void;
  readOnly?: boolean;
  viewMode?: 'visual' | 'json';
  onViewModeChange?: (mode: 'visual' | 'json') => void;
}
```

**State:**
```typescript
interface GuardProfileBuilderState {
  selectedNodeId: string | null;
  draggedItemType: string | null;
  viewMode: 'visual' | 'json';
}
```

**Functionality:**
- Manages overall state of the builder
- Handles conversion between visual representation and JSON
- Orchestrates interactions between subcomponents
- Provides context to child components

### 2. InterceptorChain

**Purpose:** Visualizes the chain of interceptors as a connected flowchart.

**Props:**
```typescript
interface InterceptorChainProps {
  chain: MessageInterceptorGuardConfig[];
  onNodeSelect: (nodeId: string) => void;
  onNodeMove: (nodeId: string, newIndex: number) => void;
  onNodeDelete: (nodeId: string) => void;
  onDropBetween: (itemType: string, index: number) => void;
  selectedNodeId: string | null;
}
```

**Functionality:**
- Renders the visual representation of the interceptor chain
- Handles drag-and-drop reordering of nodes
- Manages selection state of nodes
- Provides drop zones between nodes for adding new interceptors

### 3. InterceptorNode

**Purpose:** Represents a single interceptor in the chain.

**Props:**
```typescript
interface InterceptorNodeProps {
  id: string;
  type: 'Chain' | 'Filter' | 'MessageLog' | 'ManualApproval';
  data: MessageInterceptorGuardConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}
```

**Functionality:**
- Renders a visual representation of an interceptor
- Shows a summary of the interceptor's configuration
- Handles selection and drag events
- Provides context menu for actions (delete, duplicate)

### 4. InterceptorConnection

**Purpose:** Visualizes the connection between interceptors.

**Props:**
```typescript
interface InterceptorConnectionProps {
  isDropTarget: boolean;
  onDrop: () => void;
}
```

**Functionality:**
- Renders the visual connection between nodes
- Provides a drop target for inserting new nodes
- Animates to provide feedback during drag operations

### 5. InterceptorToolbox

**Purpose:** Provides a palette of available interceptor types to add to the chain.

**Props:**
```typescript
interface InterceptorToolboxProps {
  onDragStart: (type: string) => void;
  onDragEnd: () => void;
  onItemClick: (type: string) => void;
}
```

**Functionality:**
- Displays available interceptor types
- Allows dragging items onto the chain
- Provides click-to-add functionality

### 6. InterceptorProperties

**Purpose:** Provides a form interface for editing the selected interceptor's properties.

**Props:**
```typescript
interface InterceptorPropertiesProps {
  interceptor: MessageInterceptorGuardConfig | null;
  onChange: (updated: MessageInterceptorGuardConfig) => void;
}
```

**Functionality:**
- Dynamically renders appropriate form fields based on interceptor type
- Validates input and provides real-time feedback
- Updates the interceptor configuration on changes

## Specialized Forms for Each Interceptor Type

### 1. MessageLogForm

**Props:**
```typescript
interface MessageLogFormProps {
  value: MessageLogGuardConfig;
  onChange: (value: MessageLogGuardConfig) => void;
}
```

**Fields:**
- Log Level (select: Debug, Info, Warn, Error)

### 2. FilterForm

**Props:**
```typescript
interface FilterFormProps {
  value: FilterGuardConfig;
  onChange: (value: FilterGuardConfig) => void;
}
```

**Fields:**
- Filter Logic (complex form for building filter conditions)
- Match Action (select with nested options)
- Non-Match Action (select: send, drop)

### 3. ManualApprovalForm

**Props:**
```typescript
interface ManualApprovalFormProps {
  value: ManualApprovalGuardConfig;
  onChange: (value: ManualApprovalGuardConfig) => void;
}
```

**Fields:**
- Timeout (optional number input)
- Description (optional text input)

### 4. ChainForm

**Props:**
```typescript
interface ChainFormProps {
  value: ChainGuardConfig;
  onChange: (value: ChainGuardConfig) => void;
}
```

**Fields:**
- Nested chain builder (recursive use of GuardProfileBuilder)

## Filter Logic Builder

The most complex part of the form will be the Filter Logic Builder:

```typescript
interface FilterLogicBuilderProps {
  value: FilterLogicGuardConfig;
  onChange: (value: FilterLogicGuardConfig) => void;
}
```

**Functionality:**
- Visual builder for complex filter logic expressions
- Support for nested AND/OR conditions
- Predefined conditions for common filters (direction, request_method, etc.)
- Custom condition builder for advanced use cases

## Implementation Strategy

1. **Phase 1: Basic Chain Visualization**
   - Implement static representation of the chain
   - Add selection of nodes
   - Create basic property editor for each type
   - Implement JSON view toggle

2. **Phase 2: Chain Editing**
   - Add toolbox with draggable interceptors
   - Implement drop zones between nodes
   - Add ability to delete nodes
   - Implement reordering of nodes

3. **Phase 3: Advanced Features**
   - Implement complex filter logic builder
   - Add templates and presets
   - Implement validation and error highlighting
   - Add visual feedback and animations

## UI/UX Considerations

1. **Layout**
   - Vertical flow of interceptors (top to bottom)
   - Property editor in right sidebar
   - Toolbox on left side or top
   - Toggle for JSON view in header

2. **Visual Cues**
   - Color-code different interceptor types
   - Use icons to represent interceptor functions
   - Animate connections to show flow direction
   - Highlight selected node with glowing effect

3. **Interactions**
   - Drag and drop for adding and reordering
   - Click to select and edit properties
   - Double-click to expand/collapse complex nodes
   - Context menu for additional actions

## Example Templates

The builder will include several pre-defined templates:

1. **Log Only**
   - Single MessageLog interceptor
   - Log level: Info

2. **Approve All Tool Calls**
   - Chain with MessageLog and Filter
   - Filter for outbound tool calls
   - Manual approval for matches

3. **Full Approval**
   - Chain with multiple filters
   - Separate filters for inbound/outbound
   - Manual approval for all

## Code Example - Main Component

```tsx
import React, { useState, useCallback } from 'react';
import { GuardProfile, MessageInterceptorGuardConfig } from '../bindings/GuardProfile';
import InterceptorChain from './InterceptorChain';
import InterceptorToolbox from './InterceptorToolbox';
import InterceptorProperties from './InterceptorProperties';
import JsonEditor from './json-valid-editor';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from './ui';

const GuardProfileBuilder: React.FC<GuardProfileBuilderProps> = ({
  value,
  onChange,
  readOnly = false,
  viewMode: initialViewMode = 'visual',
  onViewModeChange,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'json'>(initialViewMode);
  
  // Convert the guard profile to a flat array of nodes for the chain
  const chainNodes = extractChainNodes(value.primary_message_interceptor);
  
  // Get the selected node data
  const selectedNode = selectedNodeId 
    ? chainNodes.find(node => node.id === selectedNodeId)?.data 
    : null;
  
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);
  
  const handleInterceptorChange = useCallback((updated: MessageInterceptorGuardConfig) => {
    // Logic to update the specific interceptor in the chain
    onChange(updateInterceptorInProfile(value, selectedNodeId!, updated));
  }, [value, selectedNodeId, onChange]);
  
  const handleViewModeChange = useCallback((mode: 'visual' | 'json') => {
    setViewMode(mode);
    onViewModeChange?.(mode);
  }, [onViewModeChange]);
  
  return (
    <div className="guard-profile-builder">
      <div className="guard-profile-builder-header">
        <h2>Guard Profile Builder</h2>
        <div className="view-toggle">
          <Button 
            variant={viewMode === 'visual' ? 'primary' : 'ghost'}
            onClick={() => handleViewModeChange('visual')}
          >
            Visual
          </Button>
          <Button 
            variant={viewMode === 'json' ? 'primary' : 'ghost'}
            onClick={() => handleViewModeChange('json')}
          >
            JSON
          </Button>
        </div>
      </div>
      
      {viewMode === 'visual' ? (
        <div className="guard-profile-builder-content">
          <div className="toolbox-container">
            <InterceptorToolbox
              onDragStart={() => {}}
              onDragEnd={() => {}}
              onItemClick={() => {}}
            />
          </div>
          
          <div className="chain-container">
            <InterceptorChain
              chain={chainNodes}
              onNodeSelect={handleNodeSelect}
              onNodeMove={() => {}}
              onNodeDelete={() => {}}
              onDropBetween={() => {}}
              selectedNodeId={selectedNodeId}
            />
          </div>
          
          <div className="properties-container">
            <InterceptorProperties
              interceptor={selectedNode}
              onChange={handleInterceptorChange}
            />
          </div>
        </div>
      ) : (
        <JsonEditor
          value={JSON.stringify(value, null, 2)}
          onChange={(jsonStr) => {
            try {
              const parsed = JSON.parse(jsonStr);
              onChange(parsed);
            } catch (e) {
              // Handle JSON parse error
            }
          }}
          disabled={readOnly}
        />
      )}
    </div>
  );
};

export default GuardProfileBuilder;
```

## Next Steps for Implementation

1. Create basic component structure
2. Implement visual representation of chain
3. Add JSON/visual toggle
4. Implement property editors for each interceptor type
5. Add drag-and-drop functionality
6. Integrate with existing create/edit flows