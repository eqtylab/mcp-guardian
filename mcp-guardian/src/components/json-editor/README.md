# Monaco-based JSON Editor for MCP Guardian

A customized Monaco Editor implementation for JSON editing with schema validation, focusing on cyberpunk styling and developer experience.

## Key Features

- **Schema Validation**: Real-time validation against JSON schemas with clear error messages
- **Autocomplete & IntelliSense**: Property suggestions based on JSON schemas
- **Documentation**: Hover tooltips showing property descriptions from schemas
- **Cyberpunk Styling**: Custom themes with neon effects for both light and dark modes
- **Theme Detection**: Robust theme synchronization with the application
- **Error Handling**: Improved handling of empty or invalid JSON
- **Widget Overflow**: Fixed positioning for tooltips and widgets to prevent clipping

## Components

- `monaco-json-editor.tsx`: Core editor component with schema validation and editing capabilities
- `json-viewer.tsx`: Read-only viewer for JSON display
- `monaco-themes.ts`: Custom cyberpunk-themed editor styles (dark/light)
- `theme-utils.ts`: Robust theme detection and synchronization utilities
- `monaco-editor.css`: Custom styling for editor UI elements
- `schema-utils.ts`: Utilities for working with JSON schemas
- `schemas/`: Directory containing generated JSON schemas from Rust types

## Usage

```tsx
import MonacoJsonEditor from './json-editor/monaco-json-editor';
import mySchema from './json-editor/schemas/my_schema.json';

// For editing with schema validation
<MonacoJsonEditor
  value={jsonText}
  onChange={setJsonText}
  schema={mySchema}
  schemaUri="http://mcp-guardian/schemas/my_schema.json"
  label="Configuration"
/>

// For read-only display
<JsonViewer
  value={jsonText}
  schema={mySchema}
/>
```

## Schema Integration

JSON schemas are generated from Rust types using the `mcp-guardian-schema` package.
These schemas provide validation rules, property descriptions, and type information
that power the editor's validation and IntelliSense features.

## Implementation Details

- Built on Monaco Editor (VS Code's editor)
- Enhanced with custom error handling for edge cases
- Theme detection checks multiple sources (localStorage, DOM classes, system preferences)
- Customized hover tooltips for better documentation visibility
- Optimized for both editing and viewing JSON in MCP Guardian's cyberpunk aesthetic
- Uses fixed widget containers to ensure tooltips and suggestion widgets are never clipped
- Properly manages DOM resources with React lifecycle hooks for cleanup