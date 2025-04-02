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

## Component Organization

```
/components/json-editor/
  index.tsx                 # Main exports
  monaco-json-editor.tsx    # Core editor component
  json-viewer.tsx           # Read-only viewer
  schemas/                  # JSON schemas for entity types
  utils/                    # Helper utilities
  themes/                   # Monaco themes
```

This dedicated folder structure provides proper organization for the component ecosystem with all supporting pieces.

## Implementation Plan

### STEP 1: Setup and Basic Implementation

1. **Monaco Editor Setup:**

   - Add dependencies
   - Configure Vite/Webpack for proper bundling
   - Create basic Monaco Editor wrapper component
   - Set up component folder structure in `/components/json-editor/`
   - Reference complete schema system documentation in `docs/src/schema_system.md`

2. **Basic JSON Editor Component:**

   - Implement core editing functionality
   - Match existing JsonEditor API for seamless replacement
   - Add syntax highlighting and formatting
   - Implement basic validation

3. **Testing:**
   - Create test cases for editor functionality
   - Ensure compatibility with existing usage patterns
   - Verify performance impact

### STEP 2: Schema Integration

1. **Schema Generation:** ✅

   - ✅ ~~Convert TypeScript types (from ts-rs) to JSON Schema~~ Use Rust-generated schemas from new `mcp-guardian-schema` package (see PHASE4_JSONSCHEMARUST.md)
   - ✅ Create `mcp-guardian-schema` package for Rust-based schema generation
   - ✅ Add JsonSchema derives to core Rust types
   - ✅ Implement schema generation for all entity types
   - ✅ Create CLI tool for schema generation and export
   - ✅ Store schemas in `/components/json-editor/schemas/`
   - ✅ Verify schema correctness against core Rust types (see PHASE4_SCHEMA_VALIDATION.md)

2. **Enhanced Features:**

   - Add autocompletion based on schemas
   - Implement documentation tooltips
   - Add property suggestions

3. **Testing:**
   - Validate schema accuracy
   - Test with various configuration examples
   - Ensure good performance with complex schemas

### STEP 3: Component Replacement

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

### STEP 4: Advanced Features

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
import React, { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

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
  maxHeight = "500px",
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
        schemas: [
          {
            uri: "http://mcp-guardian/schemas/config.json",
            fileMatch: ["*"],
            schema,
          },
        ],
      });
    }
  };

  return (
    <div className="relative space-y-2">
      <Editor
        height={maxHeight}
        defaultLanguage="json"
        value={value}
        onChange={(v) => onChange(v || "")}
        options={{
          minimap: { enabled: false },
          lineNumbers: "on",
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
  type: "object",
  required: ["url", "auth"],
  properties: {
    url: {
      type: "string",
      format: "uri",
      description: "The URL of the MCP server",
    },
    auth: {
      type: "object",
      required: ["type"],
      properties: {
        type: {
          type: "string",
          enum: ["none", "bearer", "basic"],
          description: "Authentication type",
        },
        token: {
          type: "string",
          description: "Bearer token for authentication",
        },
      },
    },
    timeout: {
      type: "integer",
      minimum: 1000,
      description: "Request timeout in milliseconds",
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
   - Mitigation: Generate schemas from TypeScript definitions (already generated from Rust)
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

6. **Backend Integration**
   - Challenge: No robust validation in Rust core libraries currently
   - Mitigation: Implement validation purely on frontend (backlog backend validation)
   - Impact: Schema definitions may need to be duplicated when backend validation is implemented

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

1. **Week 1: Setup and Basic Implementation** ✅

   - ✅ Add dependencies
   - ✅ Create basic MonacoJsonEditor component
   - ✅ Set up testing environment

2. **Week 2: Schema Integration** ✅

   - ✅ Create `mcp-guardian-schema` package for schema generation
   - ✅ Generate JSON schemas for all entity types
   - ✅ Create directory structure and export schemas
   - ✅ Implement schema validation in Monaco Editor
   - ✅ Add basic intellisense features
   - ✅ Implement advanced documentation tooltips with hover functionality

3. **Week 3: Component Replacement and Foundations** ✅ (100% complete)

   - ✅ Implement first component replacement (MCP Server component only, ~20% of total usage)
   - ✅ Create schema utilities for Monaco integration
   - ✅ Update one JSON viewer with Monaco-based implementation (tool-call component)
   - ✅ Create custom cyberpunk-themed light and dark modes
   - ✅ Implement robust theme detection and synchronization
   - ✅ Migrate Guard Profile components (completed)
   - ✅ Migrate Server Collection components (completed)
   - ✅ Migrate all dialog forms with JSON editing (completed)
   - ✅ Replace all remaining instances of react-code-blocks (completed)
   - ✅ Fix integration issues (completed)

4. **Week 4: Testing and Optimization** 🔄 (In Progress)
   - ✅ Initial testing and bug fixing (completed)
   - 🔄 Comprehensive testing (in progress)
   - 🔄 Performance optimization (in progress)
   - 🔄 Documentation and final adjustments (in progress)

## Future Enhancements (Backlogged)

1. **Rust Core Validation**

   - Add schema validation capabilities to Rust core libraries
   - Synchronize schema definitions between frontend and backend
   - Implement advanced validation rules (cross-entity references, etc.)
   - Enable server-side schema validation before persistence

2. **Enhanced Schema Generation Pipeline**

   - Expand the new `mcp-guardian-schema` package with advanced features
   - Add support for custom documentation and UI hints in schemas
   - Implement schema versioning and migration capabilities
   - Add cross-field validation rules

3. **Advanced Error Handling**
   - Implement detailed error messaging between frontend and backend
   - Provide context-aware error recovery suggestions
   - Create user-friendly error presentation

## Implementation Details and Lessons Learned

### Component Architecture

The Monaco Editor implementation has been structured within the `mcp-guardian/src/components/json-editor` directory, with the following components implemented:

1. **Core Editor Components**:

- `monaco-json-editor.tsx` - Schema-aware editor with validation and hover documentation
- `json-viewer.tsx` - Read-only viewer with consistent styling
- `monaco-themes.ts` - Custom theme definitions for dark and light modes
- `theme-utils.ts` - Robust theme detection and synchronization
- `monaco-editor.css` - Custom styling for the editor and hover tooltips
- `README.md` - Comprehensive documentation of this json-editor component system and its usage
- `schema-utils.ts` - Schema configuration and utilities
- `index.tsx` - Exports all components and utilities

2. **Integration with JSON Schema System**:
   - Schema-aware Monaco configuration
   - Direct integration with Rust-generated JSON schemas
   - Enhanced hover documentation through schema descriptions
   - Autocompletion based on schema properties

### Theme Detection Challenges

One challenge encountered was ensuring consistent theme detection and application, especially:

- Detecting the theme correctly at component mount time
- Synchronizing theme changes across components
- Handling localStorage theme preferences
- Detecting system preference changes

Solution:

- Created a unified theme detection utility
- Implemented multiple checks for theme sources with clear priority
- Added comprehensive DOM observers and event listeners
- Enhanced debug logging for theme-related issues

### Widget Overflow Challenges

A significant challenge was ensuring editor tooltips and widgets weren't clipped by container overflow settings:

- Tooltips and suggestion widgets would be cut off by container boundaries
- Custom CSS approaches were incompatible with Monaco's widget rendering system
- Z-index and positioning were inconsistent across different contexts

Solution:

- Created a dedicated DOM node attached to the document body for widgets
- Used Monaco's built-in `fixedOverflowWidgets` option to position widgets in this container
- Properly managed the widget container's lifecycle with React hooks
- Simplified CSS to avoid conflicts with the fixed positioning approach

### Validation and Documentation Features

The Monaco Editor implementation provides:

- Real-time JSON validation with clear error messages
- Property autocompletion based on schema
- Documentation tooltips on hover
- Formatting and syntax highlighting
- Custom cyberpunk-themed UI elements

### Completed Migration

The migration of JSON editing components has been successfully completed:

1. **All Components Now Using Monaco Editor:**

   - ✅ All tool call response viewers now use the new JsonViewer component
   - ✅ All main pages now use the new MonacoJsonEditor and JsonViewer components
   - ✅ All dialog forms with JSON editing now use the new components

2. **Completed Migration Steps:**

   - ✅ Prioritized main pages first (Guard Profiles and Server Collections)
   - ✅ Migrated all dialog forms with JSON editing capabilities
   - ✅ Replaced all react-code-blocks instances for JSON viewing
   - ✅ Updated all imports to reference the new components
   - ✅ Removed the old JSONViewer component
   - ✅ Removed the react-code-blocks dependency

3. **Implementation Highlights:**

   - Consistent behavior across all component usage
   - Improved widget overflow handling
   - Dark/light theme support with dynamic detection
   - Schema validation and autocompletion throughout the application

4. **Results:**
   - Improved user experience with better editor capabilities
   - Enhanced code quality with TypeScript integration
   - Reduced security vulnerabilities by removing outdated dependencies
   - Consistent UI across all JSON editing and viewing components

## Conclusion

The migration to Monaco Editor will significantly enhance the JSON editing experience in MCP Guardian. It provides better validation, autocompletion, and a more robust editing environment while addressing security concerns with the previous implementation. The custom theming and hover documentation make the editor both visually appealing and more user-friendly.

The implementation has focused on frontend validation with rich schema-based features, with backend validation capabilities backlogged for future development. This approach has delivered immediate user experience improvements while laying the groundwork for more robust validation in the future.

The combination of the JSON Schema system and Monaco Editor provides a powerful editing experience that helps users understand and correctly configure the application, reducing errors and improving productivity.
