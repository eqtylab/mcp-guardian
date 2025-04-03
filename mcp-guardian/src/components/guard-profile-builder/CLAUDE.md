Guidance for the Guard Profile Builder component can be found in this component directory's README: `mcp-guardian/src/components/guard-profile-builder/README.md`.

Do not use hacky type casting. Use the correct types.
Think carefully and considerately, no need to rush solutions.

# Guard Profile Builder Documentation

## Middleware Mental Model

The Guard Profile Builder visualizes Guard Profiles as middleware components that sit between inputs (incoming messages from MCP Servers) and outputs (messages sent to applications). This mental model is implemented through:

1. Static input and output nodes that visually anchor the flow
2. Interceptor nodes in the middle that process messages as they flow through
3. Directional connections showing the path of messages

## Implementation Details

### Component Architecture
- Uses React Flow (@xyflow/react) as the foundation for node-based editing
- Custom node components for different interceptor types (Filter, Chain, MessageLog, ManualApproval)
- Static Input/Output nodes representing the sources and destinations of messages
- In-node configuration with expandable UI for direct manipulation
- Property panel for documentation and learning
- Interceptor toolbox for adding new interceptor types

### Two-Way Data Binding
- `convertProfileToFlow`: Transforms GuardProfile JSON to React Flow nodes and edges
- `convertFlowToProfile`: Transforms React Flow nodes and edges back to GuardProfile JSON
- Custom event system for communicating node configuration changes
- Changes to the visual representation automatically update the JSON and vice versa

## Known Issues and Solutions

### State Management for Node Type Switching

**Issue**: When clicking different interceptor types in the toolbox, nodes would initially change but then get "stuck" on one type, no longer responding to clicks.

**Root Cause**: Complex interaction between React Flow's node state management, memoization, and React's update scheduling. Attempts to modify existing nodes would sometimes result in stale references being used.

**Solution**:
1. Implemented a complete state reset approach that creates fresh nodes and edges on each selection
2. Bypassed potential stale references by building the entire node structure from scratch each time
3. Used direct profile updating instead of relying solely on the flow conversion logic
4. Added sequenced state updates with slight delays to ensure proper rendering

### Node Configuration and Update Propagation

**Issue**: Implementing in-node configuration requires proper event propagation to update the overall state.

**Solution**:
1. Created a custom event system using CustomEvents to communicate node changes
2. Implemented expandable UI with compact form controls directly within nodes
3. Added state sync between local node state and parent component
4. Used type-safe state update functions with proper data typing
5. Ensured z-index and visibility properties are correctly set for stable node interaction

## Integration with Entity Sidebar Navigation

The Guard Profile Builder integrates with the sidebar-based navigation pattern for entity management, offering:

### Benefits

1. **Increased Workspace** - Full width content area provides more space for the visual flow editor
2. **Better Context** - Direct correlation between selected profile in sidebar and visualization
3. **Reduced Cognitive Load** - Clear separation between entity selection and configuration

### Implementation Notes

- The visual builder maintains all functionality while working in the sidebar navigation context
- Editor components load with the full available width when a profile is selected
- Tab-based navigation between visual and JSON representation remains intact
- Empty state UI guides users to select or create profiles

## Completed Enhancements

- In-node configuration with expandable UI
- Comprehensive documentation panel for learning
- Fully draggable nodes with position preservation
- Collapsible sidebar for improved space utilization
- Node positioning that persists across interceptor changes

## Future Enhancements

- Add validation and error handling for connections
- Enhance automatic layout algorithms
- Add hover states with additional information 
- Implement visual feedback for interceptor functionality
- Consider adding a fullscreen mode for complex flows
- Add ability to save custom node layouts and templates
- Implement flow snapshots for profile version history
- Add more advanced routing and conditional logic visualization
- Add animated flow visualization to show message paths
