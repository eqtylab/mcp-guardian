# Libraries for Phase 4 Implementation

This document outlines potential libraries to help implement the visual UI components for Phase 4, with a focus on their benefits, compatibility with existing code, and use cases in our implementation.

## Flow/Diagram Libraries

### 1. **React Flow (xyflow)** 
**Website**: https://reactflow.dev/

**Benefits**:
- Specifically designed for building node-based editors and diagrams
- Has built-in support for custom nodes, edges, and interactions
- Supports interactive connections between nodes
- Well-maintained with TypeScript support
- Good performance with large diagrams
- Handles complex node positioning and edge routing

**Use Case**:
- Guard Profile visual chain builder
- Server Collection relationship diagram
- Message flow visualization

**Example Implementation**:
```tsx
import { 
  ReactFlow,
  Controls, 
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const GuardProfileBuilder = ({ value, onChange }) => {
  // Initial nodes based on guard profile
  const initialNodes = convertProfileToNodes(value);
  // Initial edges to connect the nodes
  const initialEdges = createEdgesFromNodes(initialNodes);
  
  // Using the recommended state management hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Update when value changes externally
  useEffect(() => {
    const newNodes = convertProfileToNodes(value);
    const newEdges = createEdgesFromNodes(newNodes);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [value, setNodes, setEdges]);

  // Handle creating new connections between nodes
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
    
    // Convert the visual representation back to guard profile JSON
    const updatedProfile = convertToGuardProfile(nodes, [...edges, params]);
    onChange(updatedProfile);
  }, [nodes, edges, onChange, setEdges]);

  // Handle when a node is dropped after dragging
  const onNodeDragStop = useCallback((event, node) => {
    // Update node positions
    setNodes((nds) => 
      nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
    );
  }, [setNodes]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        fitView
      >
        <Background variant="dots" gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
```

### 2. **XState + React Flow (xyflow)**
**Websites**: https://xstate.js.org/ + https://reactflow.dev/

**Benefits**:
- XState provides robust state management for complex workflows
- Excellent for representing state machines visually
- Combines well with React Flow for the visualization layer
- Strong TypeScript support

**Use Case**:
- More complex Guard Profile chains with conditional logic
- Representing workflow and approval processes

## Drag-and-Drop Libraries

### 1. **react-beautiful-dnd**
**Website**: https://github.com/atlassian/react-beautiful-dnd

**Benefits**:
- Simple, accessible drag and drop
- Smooth animations and gestures
- Well-documented and widely used
- Works well with keyboard navigation

**Use Case**:
- Reordering interceptors in a chain
- Managing lists of servers and profiles

### 2. **@dnd-kit/core**
**Website**: https://dndkit.com/

**Benefits**:
- Modern, performant drag and drop library
- More flexible than react-beautiful-dnd
- Support for multiple interaction types
- Good accessibility

**Use Case**:
- Drag-and-drop interface for toolboxes and complex builders
- Highly customizable drag interactions

## Form Builder Libraries

### 1. **React Hook Form**
**Website**: https://react-hook-form.com/

**Benefits**:
- Performance-focused form management
- Minimal re-renders
- Easy validation
- Support for complex nested forms
- Good TypeScript support

**Use Case**:
- Form-based editors for all entity types
- Complex validation for configurations

**Example Implementation**:
```tsx
import { useForm, Controller } from 'react-hook-form';
import { Select, Input } from './ui';

const MessageLogForm = ({ value, onChange }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      logLevel: value.log_level || 'Info'
    }
  });

  const onSubmit = data => {
    onChange({
      ...value,
      log_level: data.logLevel
    });
  };

  return (
    <form onChange={handleSubmit(onSubmit)}>
      <Controller
        name="logLevel"
        control={control}
        render={({ field }) => (
          <Select
            label="Log Level"
            options={[
              { value: 'Debug', label: 'Debug' },
              { value: 'Info', label: 'Info' },
              { value: 'Warn', label: 'Warning' },
              { value: 'Error', label: 'Error' }
            ]}
            {...field}
          />
        )}
      />
    </form>
  );
};
```

### 2. **Formik**
**Website**: https://formik.org/

**Benefits**:
- Popular, mature form management
- Good validation capabilities with Yup
- Handles complex form state

**Use Case**:
- Alternative to React Hook Form if preferred

## UI Enhancement Libraries

### 1. **Framer Motion**
**Website**: https://www.framer.com/motion/

**Benefits**:
- High-quality animations and transitions
- Gesture support
- Animation orchestration
- Good performance

**Use Case**:
- Animating transitions between views
- Micro-interactions and feedback
- Smooth drag-and-drop animations

**Example Implementation**:
```tsx
import { motion } from 'framer-motion';

const InterceptorNode = ({ data, isSelected }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isSelected ? 1.05 : 1,
        boxShadow: isSelected 
          ? '0 0 0 2px var(--colors-accent-primary)' 
          : '0 0 0 0px transparent'
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }}
      className="interceptor-node"
    >
      {data.type === 'MessageLog' && <MessageLogNode data={data} />}
      {data.type === 'Filter' && <FilterNode data={data} />}
      {/* Other node types */}
    </motion.div>
  );
};
```

### 2. **Radix UI Tooltip**
**Website**: https://www.radix-ui.com/primitives/docs/components/tooltip

**Benefits**:
- Already part of your UI component library
- Consistent with other Radix components
- Fully accessible
- Customizable with your existing styling approach
- Well-documented

**Use Case**:
- Contextual help throughout the interface
- Explaining complex options
- Providing hints for UI elements

**Example Implementation**:
```tsx
import * as Tooltip from '@radix-ui/react-tooltip';

const InterceptorToolboxItem = ({ type, icon, description }) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="toolbox-item">
            {icon}
            <span>{type}</span>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content 
            className="tooltip-content" 
            sideOffset={5}
            variant="cyber"
            glow="subtle"
          >
            {description}
            <Tooltip.Arrow className="tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

## Integration Considerations

When selecting libraries, we'll need to consider:

1. **Bundle Size Impact**
   - Choose lightweight libraries where possible
   - Implement code-splitting for larger dependencies

2. **Existing Dependencies**
   - Leverage existing UI components from your codebase
   - Ensure compatibility with current packages

3. **TypeScript Support**
   - All recommended libraries have good TypeScript support

4. **Accessibility**
   - Ensure selected libraries have good accessibility support
   - Test with keyboard navigation and screen readers

## Recommended Implementation Stack

For the Guard Profile Visual Builder, I recommend:

1. **React Flow** for the node-based visualization
2. **React Hook Form** for the property forms
3. **Framer Motion** for animations and transitions
4. **Radix UI components** for tooltips and other UI primitives

For the Server Collection Relationship Diagram:

1. **React Flow** for the relationship graph
2. **@dnd-kit/core** for drag-drop capabilities
3. **Radix UI components** for consistent UI elements

This combination provides a robust foundation for building the visual interfaces while maintaining good performance and accessibility.

## Proof of Concept Approach

Before fully implementing, I recommend creating small proof-of-concept implementations for:

1. A simple chain visualization with React Flow
2. A form-based editor with React Hook Form
3. Testing the integration between the visual builder and JSON representation

This allows us to validate the approach and identify any potential issues early in the development process.