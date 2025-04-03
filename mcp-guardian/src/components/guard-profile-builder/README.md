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

## UX Improvement Goals

1. **Clear Data Flow Representation**
   - Add static (non-editable) input and output nodes to visually anchor the flow
   - Make the direction of data flow immediately apparent with clear visual cues

2. **Middleware Context**
   - Visually establish the Guard Profile as a processing layer between systems
   - Help users understand their place in the overall architecture

3. **Intuitive Chain Building**
   - Make it obvious how interceptors connect and in what order they process messages
   - Provide clear visual feedback on the path messages take through the system

## Implementation Approach

### 1. Add Static Input/Output Nodes

Add non-draggable, non-editable nodes at the start and end of the flow:

- **Input Node**: Represents incoming messages from MCP servers
- **Output Node**: Represents processed messages being delivered to the application

These nodes should have distinctive styling and clear labeling to indicate their special status.

### 2. Enhance Visual Flow Direction

- Use directed arrows with stronger visual presence
- Consider using gradients or color coding to indicate direction of flow
- Ensure layout naturally flows from inputs to outputs (left-to-right or top-to-bottom)

### 3. Improve Node Connection Semantics

- Make connection points (handles) more intuitive with clearer input/output designation
- Prevent invalid connections that would break the flow model
- Add visual feedback when connections are being made

## Future Enhancements

- Add animated flow indicators to visualize message movement
- Implement a "test message" feature to simulate how a message would be processed
- Add input/output previews showing example message formats
- Create a "message path visualization" that highlights the active path for different message types

## Technical Guidelines

- Maintain the ReactFlow foundation while extending with custom components
- Keep the JSON <-> Visual representation synchronization intact
- Ensure new visual elements enhance rather than complicate the UX
- Preserve all existing functionality while improving the conceptual clarity