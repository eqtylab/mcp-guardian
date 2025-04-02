Do not use hacky type casting. Use the correct types.
Think carefully and considerately, no need to rush solutions.

# Guard Profile Builder UX Improvements

## Integration with Entity Sidebar Navigation

The Guard Profile Builder now integrates with the new sidebar-based navigation pattern for entity management. This integration offers several key advantages:

### Benefits
1. **Increased Workspace** - Full width content area provides more space for the visual flow editor
2. **Better Context** - Direct correlation between selected profile in sidebar and visualization
3. **Reduced Cognitive Load** - Clear separation between entity selection and configuration

### Implementation Notes
- The visual builder maintains all functionality while working in the sidebar navigation context
- Editor components load with the full available width when a profile is selected
- Tab-based navigation between visual and JSON representation remains intact
- Empty state UI guides users to select or create profiles

## Future Enhancements
- Consider adding a fullscreen mode for complex flows
- Add ability to save custom node layouts and templates
- Implement flow snapshots for profile version history
- Add more advanced routing and conditional logic visualization
