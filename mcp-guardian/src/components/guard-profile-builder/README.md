# Guard Profile Visual Builder

## Conceptual Model

The Guard Profile Visual Builder represents Guard Profiles as middleware/firewall components that sit between inputs (incoming messages) and outputs (outgoing messages). This mental model helps users understand what they're configuring:

```
┌──────────────┐     ┌─────────────────────────────┐     ┌──────────────┐
│              │     │                             │     │              │
│   INPUTS     │────▶│     GUARD PROFILE          │────▶│   OUTPUTS    │
│ (MCP Server) │     │ (Chain of Interceptors)    │     │ (Application) │
│              │     │                             │     │              │
└──────────────┘     └─────────────────────────────┘     └──────────────┘
```

## UX Critical Components for Success

1. **Clear Action Buttons & Interactive Elements**
   - Color-coded interceptor types with distinctive icons
   - Simple, focused toolbox with clear clickable items
   - Contextual tips panel guiding users through the workflow
   - Visual feedback when items are selected or active

2. **Intuitive Visual Language**
   - Professional, consistent styling aligned with application design
   - Color-coded connection paths (input → processing → output)
   - Visual consistency between related elements
   - Clean, subtle background grid to provide spatial context

3. **Guided User Experience**
   - Tips panel explaining key actions and workflows
   - Clear header with legend explaining the color coding
   - Consistent use of icons and colors to establish patterns
   - Progressive disclosure of complexity through the interface

## Implementation Approach

### 1. Static Input/Output Nodes

Add non-draggable, non-editable nodes at the start and end of the flow:

- **Input Node**: Represents incoming messages from MCP servers
- **Output Node**: Represents processed messages being delivered to the application

These nodes should have distinctive styling and clear labeling to indicate their special status.

### 2. In-Node Configuration

Provides direct manipulation interface within the nodes themselves:

- **Expandable UI**: Nodes can be expanded/collapsed to show/hide configuration options
- **Compact Controls**: Dense, technical-user-focused form controls within the node
- **Real-time Updates**: Changes in node configuration immediately propagate to the model
- **Event System**: Custom events communicate node changes to parent components

The in-node configuration approach reduces context switching and provides a more intuitive interaction model where users configure objects directly within the flow.

### 3. Action Buttons & Interceptor Toolbox

The interceptor toolbox is a **critical element** for successful UX:

- Color-coded interceptor types help users identify node purposes
- Clear, concise descriptions explain each interceptor's function
- Simple click interaction makes adding nodes intuitive
- Tips panel provides contextual guidance for new users
- Visual styling helps establish relationships between nodes in the toolbox and canvas

### 4. Visual Flow Direction

- Use directed arrows with appropriate size and styling
- Color-code paths to indicate direction and relationship
- Maintain consistent visual language between toolbox and canvas nodes
- Ensure layout naturally flows from inputs to outputs (left-to-right)

### 5. Connection Semantics & Feedback

- Make connection points (handles) intuitive with clear input/output designation
- Provide visual feedback when connections are made or are invalid
- Use consistent border treatments and shadows for related elements
- Ensure node styling reflects its role in the processing chain

### 6. Documentation Panel

- Convert the property panel into a documentation-focused resource
- Provide detailed information about each interceptor type
- Include usage tips and best practices for each interceptor
- Explain the in-node configuration model and how to use it

## Future Enhancements

- Add animated flow indicators to visualize message movement
- Implement a "test message" feature to simulate how a message would be processed
- Add input/output previews showing example message formats
- Create a "message path visualization" that highlights the active path for different message types
- Expand tips panel with contextual help based on current actions

## Technical Guidelines

- Maintain the ReactFlow foundation while extending with custom components
- Keep the JSON <-> Visual representation synchronization intact
- Use consistent styling patterns from the application's design system
- Focus on professional, clean presentation that emphasizes clarity
- Ensure visual styling helps communicate the component's purpose