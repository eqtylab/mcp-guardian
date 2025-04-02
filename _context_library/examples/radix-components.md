# Radix UI Component Usage Examples

This document provides examples of how to use the new Radix UI-based component library in the MCP Guardian application.

## Basic Components

### Button

```tsx
import { Button } from "../components/ui/Button";

// Basic usage with variants
<Button>Default Button</Button>
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="success">Success Button</Button>
<Button variant="danger">Danger Button</Button>

// Size variants
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button</Button>
<Button size="lg">Large Button</Button>

// Loading state
<Button isLoading>Loading...</Button>

// Combined with icons
<Button>
  <Save className="mr-2" size={14} />
  Save Changes
</Button>
```

### Badge

```tsx
import { Badge } from "../components/ui/Badge";

// Basic usage with variants
<Badge>Default Badge</Badge>
<Badge variant="primary">Primary Badge</Badge>
<Badge variant="success">Success Badge</Badge>
<Badge variant="warning">Warning Badge</Badge>
<Badge variant="danger">Danger Badge</Badge>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";

// Basic card with header, content and footer
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>This is the card content.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Form Components

### Input and FormField

```tsx
import { Input } from "../components/ui/Input";
import { FormField, FormLabel, FormDescription } from "../components/ui/FormField";

// Basic input
<Input placeholder="Basic input" />

// Input with error state
<Input error placeholder="Error state input" />

// Complete form field
<FormField>
  <FormLabel htmlFor="username" required>Username</FormLabel>
  <Input id="username" placeholder="Enter username" />
  <FormDescription>Your unique username for the platform.</FormDescription>
</FormField>

// Form field with error
<FormField error="Username is required">
  <FormLabel htmlFor="username" required>Username</FormLabel>
  <Input id="username" error placeholder="Enter username" />
</FormField>
```

### Textarea

```tsx
import { Textarea } from "../components/ui/Textarea";

// Basic textarea
<Textarea placeholder="Enter your message" rows={4} />

// Textarea with error state
<Textarea error placeholder="Error state textarea" rows={4} />
```

## Dialog (Modal)

```tsx
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogBody,
  DialogFooter
} from "../components/ui/Dialog";
import { Button } from "../components/ui/Button";

// Complete dialog example
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>
      <p>This is the dialog content where you can put your form or information.</p>
    </DialogBody>
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button>Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## JSON Viewer

```tsx
import { JSONViewer } from "../components/ui/JSONViewer";

// Basic JSON data display
const jsonData = {
  id: "123",
  name: "Example",
  settings: {
    enabled: true,
    count: 42
  }
};

<JSONViewer data={jsonData} />

// With title and collapsible
<JSONViewer 
  data={jsonData} 
  title="Configuration" 
  collapsible 
  expanded={true} 
/>
```

## Migration Examples

Here are examples of how to migrate existing components to the new component library:

### Before (CreateMcpServerDialog.tsx)

```tsx
// Modal backdrop
<div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} aria-hidden="true" />

// Modal content
<div 
  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
      w-full max-w-2xl max-h-[85vh] overflow-y-auto z-50 
      bg-colors-bg-surface
      border border-colors-border-subtle
      rounded-md shadow-md"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  {/* Header */}
  <div className="p-3 bg-colors-bg-elevated border-b border-colors-border-subtle flex justify-between items-center">
    <h2 id="modal-title" className="text-sm m-0 font-medium">
      Create New MCP Server
    </h2>
    <button
      onClick={onClose}
      className="p-1 bg-transparent border-0 text-colors-text-primary hover:text-colors-text-secondary transition-colors"
      aria-label="Close dialog"
    >
      <X size={14} strokeWidth={2.5} />
    </button>
  </div>
  
  {/* Content */}
  <div className="p-4 bg-colors-bg-surface">
    {/* Form fields */}
    <button 
      onClick={onClose}
      className="py-2 px-3 rounded-sm bg-colors-bg-interactive border border-colors-border-subtle
                text-colors-text-primary text-sm font-medium transition-colors
                hover:bg-colors-bg-interactive/80 focus:outline-none focus:ring-1 
                focus:ring-colors-accent-primary"
    >
      Cancel
    </button>
    <button
      onClick={handleCreate}
      className="py-2 px-3 rounded-sm bg-colors-status-success text-[hsla(220,18%,10%,0.9)]
                border-transparent text-sm font-medium transition-colors
                hover:bg-colors-status-success/90 focus:outline-none focus:ring-1
                focus:ring-colors-status-success disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={!isValid || !namespace || !name}
    >
      Create Server
    </button>
  </div>
</div>
```

### After (with new component library)

```tsx
<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New MCP Server</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>
      {/* Form fields using new Input components */}
      <FormField className="mb-4">
        <FormLabel htmlFor="namespace">Namespace</FormLabel>
        <Input 
          id="namespace" 
          value={namespace} 
          onChange={(e) => setNamespace(e.target.value)} 
          placeholder="e.g., development" 
        />
      </FormField>
      
      <FormField className="mb-4">
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g., local-server" 
        />
      </FormField>
      
      <FormField error={!isValid ? "Invalid JSON configuration" : undefined}>
        <FormLabel htmlFor="config">Configuration</FormLabel>
        <Textarea
          id="config"
          value={config}
          onChange={(e) => {
            setConfig(e.target.value);
            validateConfig(e.target.value);
          }}
          className="font-mono text-sm"
          rows={10}
          placeholder="Enter server configuration in JSON format"
          error={!isValid}
        />
      </FormField>
    </DialogBody>
    <DialogFooter>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        variant="success" 
        onClick={handleCreate}
        disabled={!isValid || !namespace || !name}
      >
        Create Server
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

This demonstrates how the new component library greatly simplifies markup, improves accessibility, and maintains consistent styling.