# Phase 4 Component Analysis and Proposals

This document contains detailed analysis of each major component in MCP Guardian and specific proposals for visual UI components to be implemented in Phase 4.

## Current Component Architecture

MCP Guardian has a modular component architecture with:

1. **Page Components** - Main route pages (e.g., `guard-profiles-page.tsx`)
2. **Entity Components** - Components for specific entities (e.g., `guard-profile-component.tsx`)
3. **Shared UI Components** - Reusable UI elements in `/components/ui`
4. **Dialog Components** - Modal dialogs for creating/editing entities

All components use a consistent styling approach with Tailwind CSS utilities and follow the app's design system.

## Component Proposals for Phase 4

Based on the UX discovery analysis, here are specific component proposals for each core feature area.

### 1. MCP Server Components

#### FormBasedServerEditor

Purpose: Replace JSON editing with a user-friendly form for MCP server configuration.

Features:
- Structured form fields for command, arguments, and environment variables
- Validation of inputs
- Context-sensitive help
- Toggle between form and JSON views

```tsx
interface FormBasedServerEditorProps {
  server: NamedMcpServer;
  onChange: (server: NamedMcpServer) => void;
  onSave: () => void;
}

const FormBasedServerEditor: React.FC<FormBasedServerEditorProps> = ({ 
  server, 
  onChange, 
  onSave 
}) => {
  // Implementation details...
}
```

#### ServerTemplateSelector

Purpose: Allow users to select from predefined server templates.

Features:
- Template categories
- Preview of template configuration
- Quick create from template

```tsx
interface ServerTemplateSelectorProps {
  onSelectTemplate: (template: McpServerTemplate) => void;
}

const ServerTemplateSelector: React.FC<ServerTemplateSelectorProps> = ({ 
  onSelectTemplate 
}) => {
  // Implementation details...
}
```

#### EnvironmentVariableBuilder

Purpose: Specialized interface for managing environment variables.

Features:
- Add/edit/remove environment variables
- Special handling for sensitive values
- Variable validation and suggestions

```tsx
interface EnvironmentVariableBuilderProps {
  variables: Record<string, string>;
  onChange: (variables: Record<string, string>) => void;
}

const EnvironmentVariableBuilder: React.FC<EnvironmentVariableBuilderProps> = ({ 
  variables, 
  onChange 
}) => {
  // Implementation details...
}
```

### 2. Guard Profile Components

#### GuardProfileVisualBuilder

Purpose: Provide a drag-and-drop interface for building interceptor chains.

Features:
- Node-based visual editor
- Drag-and-drop interceptor creation and ordering
- Visualization of message flow
- Interactive property editing

Implementation approach:
- Use React Flow for node-based visualization
- Custom nodes for different interceptor types
- Two-way sync with JSON representation

```tsx
interface GuardProfileVisualBuilderProps {
  profile: GuardProfile;
  onChange: (profile: GuardProfile) => void;
}

const GuardProfileVisualBuilder: React.FC<GuardProfileVisualBuilderProps> = ({ 
  profile, 
  onChange 
}) => {
  // Implementation details using React Flow...
}
```

#### InterceptorNodeEditor

Purpose: Modal editor for configuring individual interceptors.

Features:
- Type-specific form fields
- Validation
- Preview of configuration
- Context-sensitive help

```tsx
interface InterceptorNodeEditorProps {
  interceptor: MessageInterceptorGuardConfig;
  onChange: (interceptor: MessageInterceptorGuardConfig) => void;
  onClose: () => void;
}

const InterceptorNodeEditor: React.FC<InterceptorNodeEditorProps> = ({ 
  interceptor, 
  onChange, 
  onClose 
}) => {
  // Implementation details...
}
```

#### InterceptorToolbox

Purpose: Palette of available interceptor types for quick addition to chains.

Features:
- Categorized interceptor types
- Drag-and-drop to add to chain
- Quick templates
- Tooltips with explanations

```tsx
interface InterceptorToolboxProps {
  onAddInterceptor: (type: string, position: { x: number, y: number }) => void;
}

const InterceptorToolbox: React.FC<InterceptorToolboxProps> = ({ 
  onAddInterceptor 
}) => {
  // Implementation details...
}
```

### 3. Server Collection Components

#### ServerCollectionDiagram

Purpose: Visualize relationships between servers and profiles.

Features:
- Interactive graph of servers and profiles
- Connection visualization
- Node selection and editing
- Highlight invalid or missing references

Implementation approach:
- Use React Flow for relationship visualization
- Custom nodes for servers and profiles
- Interactive edge creation

```tsx
interface ServerCollectionDiagramProps {
  collection: ServerCollection;
  availableServers: NamedMcpServer[];
  availableProfiles: NamedGuardProfile[];
  onChange: (collection: ServerCollection) => void;
}

const ServerCollectionDiagram: React.FC<ServerCollectionDiagramProps> = ({ 
  collection,
  availableServers,
  availableProfiles,
  onChange
}) => {
  // Implementation details using React Flow...
}
```

#### ConnectionEditor

Purpose: Form-based editor for server-profile connections.

Features:
- Dropdown selection of servers and profiles
- Validation of selections
- Bulk editing capabilities
- Search and filter

```tsx
interface ConnectionEditorProps {
  servers: Server[];
  availableServers: NamedMcpServer[];
  availableProfiles: NamedGuardProfile[];
  onChange: (servers: Server[]) => void;
}

const ConnectionEditor: React.FC<ConnectionEditorProps> = ({ 
  servers,
  availableServers,
  availableProfiles,
  onChange
}) => {
  // Implementation details...
}
```

#### ClaudeExportPreview

Purpose: Preview and customize Claude configuration before export.

Features:
- Formatted view of Claude configuration
- Highlight modified sections
- Copy to clipboard option
- Apply directly from preview

```tsx
interface ClaudeExportPreviewProps {
  collection: ServerCollection;
  onApply: () => void;
  onClose: () => void;
}

const ClaudeExportPreview: React.FC<ClaudeExportPreviewProps> = ({ 
  collection,
  onApply,
  onClose
}) => {
  // Implementation details...
}
```

### 4. Message Approval Components

#### EnhancedMessageViewer

Purpose: Improved display of pending messages with context.

Features:
- Structured view of message content
- Highlighting of key fields
- Context information about origin
- Related message history

```tsx
interface EnhancedMessageViewerProps {
  message: PendingMessage;
  onApprove: () => void;
  onDeny: () => void;
}

const EnhancedMessageViewer: React.FC<EnhancedMessageViewerProps> = ({ 
  message,
  onApprove,
  onDeny
}) => {
  // Implementation details...
}
```

#### MessageFilterPanel

Purpose: Filter and organize pending messages.

Features:
- Filter by type, origin, content
- Sort by various criteria
- Save filter presets
- Apply filters

```tsx
interface MessageFilterPanelProps {
  onFilterChange: (filters: MessageFilters) => void;
}

const MessageFilterPanel: React.FC<MessageFilterPanelProps> = ({ 
  onFilterChange 
}) => {
  // Implementation details...
}
```

#### BatchApprovalInterface

Purpose: Enable batch approval of similar messages.

Features:
- Select multiple messages
- Preview batch action
- Apply action to selection
- Undo capability

```tsx
interface BatchApprovalInterfaceProps {
  messages: PendingMessage[];
  onBatchApprove: (ids: string[]) => void;
  onBatchDeny: (ids: string[]) => void;
}

const BatchApprovalInterface: React.FC<BatchApprovalInterfaceProps> = ({ 
  messages,
  onBatchApprove,
  onBatchDeny
}) => {
  // Implementation details...
}
```

### 5. Wizard Components

#### WizardContainer

Purpose: Reusable wizard framework for guided processes.

Features:
- Step navigation
- Progress tracking
- Validation
- Branching logic

```tsx
interface WizardStep {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  validate?: () => boolean;
}

interface WizardContainerProps {
  steps: WizardStep[];
  initialData: any;
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const WizardContainer: React.FC<WizardContainerProps> = ({ 
  steps,
  initialData,
  onComplete,
  onCancel
}) => {
  // Implementation details...
}
```

#### CreateServerWizard

Purpose: Guide users through server creation.

Features:
- Template selection
- Basic configuration
- Environment variable setup
- Validation and suggestions

```tsx
interface CreateServerWizardProps {
  onComplete: (server: NamedMcpServer) => void;
  onCancel: () => void;
}

const CreateServerWizard: React.FC<CreateServerWizardProps> = ({ 
  onComplete,
  onCancel
}) => {
  // Implementation details...
}
```

#### CreateProfileWizard

Purpose: Guide users through guard profile creation.

Features:
- Profile type selection
- Interceptor configuration
- Chain building (simple)
- Testing and validation

```tsx
interface CreateProfileWizardProps {
  onComplete: (profile: NamedGuardProfile) => void;
  onCancel: () => void;
}

const CreateProfileWizard: React.FC<CreateProfileWizardProps> = ({ 
  onComplete,
  onCancel
}) => {
  // Implementation details...
}
```

## Integration with Existing Components

These new components will integrate with the existing component architecture:

1. **Entity Components**: Enhanced with visual editors while maintaining backward compatibility
2. **Page Components**: Updated to include new filtering and organization tools
3. **Dialog Components**: Augmented with wizard flows as alternatives to direct creation
4. **Shared UI Components**: Leveraged for consistent styling and behavior

## State Management Approach

For the more complex visual editors, we'll need robust state management:

1. **Local Component State**: For simple form-based editors
2. **Two-Way Binding**: Between visual representation and JSON data
3. **Controlled Components**: For maintaining single source of truth
4. **Form Libraries**: React Hook Form for complex forms

## Accessibility Considerations

All new components will maintain accessibility with:

1. **Keyboard Navigation**: Full keyboard support for all interactive elements
2. **ARIA Roles**: Proper roles and attributes for screen readers
3. **Focus Management**: Appropriate focus handling in modals and wizards
4. **Color Contrast**: Sufficient contrast for all text and UI elements

## Implementation Strategy

For efficient development, we'll implement components in the following order:

1. **Foundation Components**:
   - FormBasedServerEditor
   - WizardContainer
   - EnvironmentVariableBuilder

2. **Visual Builders**:
   - GuardProfileVisualBuilder
   - ServerCollectionDiagram
   - EnhancedMessageViewer

3. **Enhancements**:
   - Template selectors
   - Filtering tools
   - Batch operations

This strategy allows for incremental improvement with each component adding immediate value to the user experience.