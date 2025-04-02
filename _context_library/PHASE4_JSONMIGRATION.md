# JSON Editor Migration Plan

This document outlines the plan for migrating from the current JSON editing solution based on react-code-blocks to Monaco Editor, providing enhanced functionality and addressing security vulnerabilities.

## Current Implementation Analysis

### Components and Usage

1. **Current JSON Editor Components:**
   - `JsonEditor` (in `json-valid-editor.tsx`) - Custom editor built on `Textarea`
   - `JSONViewer` (in `jsonviewer.tsx`) - Uses `CopyBlock` from react-code-blocks

2. **Core Functionality:**
   - Basic syntax validation
   - JSON formatting
   - Read-only mode support
   - Error messaging
   - Copy functionality (for JSONViewer)

3. **Current Limitations:**
   - No schema validation
   - Basic text area for editing
   - Limited syntax highlighting in editor (vs viewer)
   - No autocompletion or intelligent suggestions
   - Security vulnerabilities in react-code-blocks

4. **Integration Points:**
   - Used in all entity management components:
     - `mcp-server-component.tsx`
     - `guard-profile-component.tsx`
     - `server-collection-component.tsx`
     - `create-server-collection-dialog.tsx`

## Monaco Editor Integration

### Why Monaco Editor

1. **Advanced Editing Features:**
   - First-class JSON support with syntax highlighting
   - Intelligent autocompletion
   - Code folding
   - In-line error messages
   - Search and replace
   - Multiple cursors

2. **Schema Validation:**
   - Built-in JSON schema validation
   - Error highlighting
   - Property suggestions based on schema
   - Documentation tooltips

3. **Developer Experience:**
   - Familiar VS Code-like experience
   - Keyboard shortcuts
   - Customizable themes
   - Wide community adoption and support

4. **Enterprise Readiness:**
   - Actively maintained
   - Used in production by Microsoft products
   - Better security profile

### Technical Implementation

1. **Package Dependencies:**
   ```bash
   npm install @monaco-editor/react monaco-editor
   ```

2. **Bundle Size Considerations:**
   - Monaco Editor is ~1MB in size
   - Desktop-only application makes this less critical
   - Can use webpack/vite code-splitting to load on demand

3. **Component Structure:**
   - Create new `MonacoJsonEditor` component
   - Create schema-aware version `SchemaJsonEditor`
   - Implement drop-in replacement for current JsonEditor
   - Create enhanced version of JSONViewer

## Implementation Plan

### Phase 1: Setup and Basic Implementation

1. **Monaco Editor Setup:**
   - Add dependencies
   - Configure Vite/Webpack for proper bundling
   - Create basic Monaco Editor wrapper component

2. **Basic JSON Editor Component:**
   - Implement core editing functionality
   - Match existing JsonEditor API for seamless replacement
   - Add syntax highlighting and formatting
   - Implement basic validation

3. **Testing:**
   - Create test cases for editor functionality
   - Ensure compatibility with existing usage patterns
   - Verify performance impact

### Phase 2: Schema Integration

1. **Schema Management:**
   - Create JSON schemas for all configuration types
   - Implement schema loading mechanism
   - Add schema validation to editor

2. **Enhanced Features:**
   - Add autocompletion based on schemas
   - Implement documentation tooltips
   - Add property suggestions

3. **Testing:**
   - Validate schema accuracy
   - Test with various configuration examples
   - Ensure good performance with complex schemas

### Phase 3: Component Replacement

1. **Drop-in Replacement:**
   - Replace current JsonEditor in all components
   - Update styling to match application theme
   - Ensure consistent behavior

2. **Enhanced JSONViewer:**
   - Create Monaco-based read-only viewer
   - Add improved formatting and highlighting
   - Maintain copy functionality

3. **Testing:**
   - End-to-end testing of all components
   - Verify that all current functionality works as expected
   - Check for edge cases and regression issues

### Phase 4: Advanced Features

1. **Custom Actions:**
   - Add schema-specific actions
   - Implement custom commands and keybindings
   - Add contextual helpers

2. **Theme Integration:**
   - Create dark/light theme variants
   - Ensure accessibility standards
   - Match application style guide

3. **Performance Optimization:**
   - Implement lazy loading for Monaco
   - Optimize startup time
   - Add caching for schemas

## Code Examples

### Basic MonacoJsonEditor Component

```tsx
import React, { useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface MonacoJsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: string;
  schema?: any;
}

const MonacoJsonEditor: React.FC<MonacoJsonEditorProps> = ({
  value,
  onChange,
  disabled = false,
  maxHeight = '500px',
  schema,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor, 
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Set up JSON schema if provided
    if (schema && monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [{
          uri: 'http://mcp-guardian/schemas/config.json',
          fileMatch: ['*'],
          schema,
        }],
      });
    }
  };

  return (
    <div className="relative space-y-2">
      <Editor
        height={maxHeight}
        defaultLanguage="json"
        value={value}
        onChange={(v) => onChange(v || '')}
        options={{
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          readOnly: disabled,
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
        onMount={handleEditorDidMount}
        theme="vs-dark"
      />
    </div>
  );
};

export default MonacoJsonEditor;
```

### Schema Integration Example

```tsx
// schemas/mcpServerSchema.ts
export const mcpServerSchema = {
  type: 'object',
  required: ['url', 'auth'],
  properties: {
    url: {
      type: 'string',
      format: 'uri',
      description: 'The URL of the MCP server',
    },
    auth: {
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          type: 'string',
          enum: ['none', 'bearer', 'basic'],
          description: 'Authentication type',
        },
        token: {
          type: 'string',
          description: 'Bearer token for authentication',
        },
      },
    },
    timeout: {
      type: 'integer',
      minimum: 1000,
      description: 'Request timeout in milliseconds',
    },
  },
};
```

### Integration in Components

```tsx
// mcp-server-component.tsx example
import MonacoJsonEditor from '../components/ui/monaco-json-editor';
import { mcpServerSchema } from '../schemas/mcpServerSchema';

// Then replace:
<JsonEditor
  value={configText}
  onChange={setConfigText}
  disabled={!enableEdit}
  placeholder="Enter MCP server configuration"
/>

// With:
<MonacoJsonEditor
  value={configText}
  onChange={setConfigText}
  disabled={!enableEdit}
  placeholder="Enter MCP server configuration"
  schema={mcpServerSchema}
/>
```

## Implementation Challenges

1. **Bundle Size**
   - Challenge: Monaco is a large dependency (~1MB)
   - Mitigation: Code splitting and lazy loading
   - Impact: Minimal for desktop application

2. **Schema Management**
   - Challenge: Creating and maintaining accurate schemas
   - Mitigation: Generate schemas from TypeScript definitions
   - Impact: Initial investment in schema creation

3. **Performance**
   - Challenge: Monaco can be resource-intensive for large files
   - Mitigation: Optimize editor settings, limit features for large files
   - Impact: Monitor and optimize as needed

4. **Theming and Styling**
   - Challenge: Matching application theme with Monaco
   - Mitigation: Create custom themes and override default styles
   - Impact: Additional styling work required

5. **Learning Curve**
   - Challenge: Monaco API is extensive and complex
   - Mitigation: Create abstracted components with simpler API
   - Impact: Initial learning investment for developers

## Testing Strategy

1. **Component Testing:**
   - Unit tests for MonacoJsonEditor component
   - Testing with various JSON structures
   - Edge case testing (large files, malformed JSON)

2. **Integration Testing:**
   - Test in all components that use JSON editing
   - Verify behavior in different contexts

3. **Schema Validation Testing:**
   - Test with valid and invalid JSON against schemas
   - Verify error messages and suggestions

4. **Performance Testing:**
   - Test with large JSON files
   - Measure load time and editing responsiveness

## Timeline and Milestones

1. **Week 1: Setup and Basic Implementation**
   - Add dependencies
   - Create basic MonacoJsonEditor component
   - Set up testing environment

2. **Week 2: Schema Integration**
   - Create JSON schemas for all entity types
   - Implement schema validation
   - Add intellisense features

3. **Week 3: Component Replacement**
   - Replace JsonEditor in all components
   - Update styling and theming
   - Fix any integration issues

4. **Week 4: Testing and Optimization**
   - Comprehensive testing
   - Performance optimization
   - Documentation and final adjustments

## Conclusion

The migration to Monaco Editor will significantly enhance the JSON editing experience in MCP Guardian. It will provide better validation, autocompletion, and a more robust editing environment while addressing security concerns with the current implementation. The plan balances rapid implementation with thorough testing to ensure a smooth transition for users.