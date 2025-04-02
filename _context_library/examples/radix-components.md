# MCP Guardian Component Library Usage Guide

This document provides a comprehensive guide to using the MCP Guardian component library, which is built on Radix UI primitives for accessibility and consistency. These components follow modern best practices with variant-based APIs, TypeScript typing, and self-contained styling.

## Table of Contents

- [Basic Components](#basic-components)
  - [Button](#button)
  - [Badge](#badge)
  - [Card](#card)
- [Form Components](#form-components)
  - [Input](#input)
  - [Textarea](#textarea)
  - [Select](#select)
  - [Checkbox](#checkbox)
  - [FormField](#formfield)
- [Dialog & Modals](#dialog--modals)
  - [Dialog](#dialog)
- [Navigation](#navigation)
  - [Tabs](#tabs)
  - [NavigationMenu](#navigationmenu)
  - [Breadcrumb](#breadcrumb)
- [Data Display](#data-display)
  - [JSONViewer](#jsonviewer)
  - [Collapsible](#collapsible)
- [Feedback](#feedback)
  - [Alert](#alert)
  - [Toast](#toast)
  - [ProgressIndicator](#progressindicator)
- [Migration Examples](#migration-examples)

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

### Input

```tsx
import { Input } from "../components/ui/Input";

// Basic input
<Input placeholder="Basic input" />

// Input with error state
<Input error placeholder="Error state input" />
```

### FormField

```tsx
import { FormField, FormLabel, FormDescription } from "../components/ui/FormField";
import { Input } from "../components/ui/Input";

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

### Select

```tsx
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectValue 
} from "../components/ui/Select";

// Basic select component
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>

// With error state
<Select>
  <SelectTrigger error>
    <SelectValue placeholder="Error state" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>

// With form field
<FormField error="Please select an option">
  <FormLabel htmlFor="color" required>Favorite Color</FormLabel>
  <Select>
    <SelectTrigger error>
      <SelectValue placeholder="Select a color" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="red">Red</SelectItem>
      <SelectItem value="green">Green</SelectItem>
      <SelectItem value="blue">Blue</SelectItem>
    </SelectContent>
  </Select>
</FormField>
```

### Checkbox

```tsx
import { Checkbox } from "../components/ui/Checkbox";

// Basic checkbox
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label htmlFor="terms" className="text-sm font-medium leading-none">
    Accept terms and conditions
  </label>
</div>

// With form field
<FormField>
  <div className="flex items-center space-x-2">
    <Checkbox id="marketing" />
    <FormLabel htmlFor="marketing" className="leading-none">
      Receive marketing emails
    </FormLabel>
  </div>
</FormField>
```

## Dialog & Modals

### Dialog

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

// Controlled dialog
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Controlled Dialog</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>
      <p>This dialog is controlled via state.</p>
    </DialogBody>
    <DialogFooter>
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<Button onClick={() => setOpen(true)}>
  Open Dialog
</Button>
```

## Navigation

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <h3>Account Settings</h3>
    <p>Manage your account information.</p>
  </TabsContent>
  <TabsContent value="password">
    <h3>Password</h3>
    <p>Change your password here.</p>
  </TabsContent>
  <TabsContent value="settings">
    <h3>Settings</h3>
    <p>Manage application settings.</p>
  </TabsContent>
</Tabs>
```

### NavigationMenu

```tsx
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "../components/ui/NavigationMenu";

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-3 p-4 w-[400px]">
          <NavigationMenuLink className="block p-2 hover:bg-colors-bg-interactive rounded-sm" href="/docs/introduction">
            Introduction
          </NavigationMenuLink>
          <NavigationMenuLink className="block p-2 hover:bg-colors-bg-interactive rounded-sm" href="/docs/installation">
            Installation
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink className="block p-2" href="/docs/components">
        Components
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Breadcrumb

```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../components/ui/Breadcrumb";

<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink href="/servers">MCP Servers</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink current>Server Details</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
```

## Data Display

### JSONViewer

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

### Collapsible

```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../components/ui/Collapsible";
import { useState } from "react";

// Uncontrolled
<Collapsible>
  <CollapsibleTrigger>Click to expand</CollapsibleTrigger>
  <CollapsibleContent>
    <p>This content will be shown/hidden when the trigger is clicked.</p>
  </CollapsibleContent>
</Collapsible>

// Controlled
const [isOpen, setIsOpen] = useState(false);

<Collapsible open={isOpen} onOpenChange={setIsOpen}>
  <CollapsibleTrigger>
    {isOpen ? "Hide Details" : "Show Details"}
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div className="p-4">
      <p>Expanded content goes here.</p>
    </div>
  </CollapsibleContent>
</Collapsible>
```

## Feedback

### Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from "../components/ui/Alert";

// Basic alert
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    This is a default alert with a title and description.
  </AlertDescription>
</Alert>

// Alert variants
<Alert variant="info">
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>This is an informational alert.</AlertDescription>
</Alert>

<Alert variant="success">
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>Operation completed successfully.</AlertDescription>
</Alert>

<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>This action may have consequences.</AlertDescription>
</Alert>

<Alert variant="danger">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong. Please try again.</AlertDescription>
</Alert>

// With close button
<Alert variant="info" onClose={() => console.log("Alert closed")}>
  <AlertTitle>Dismissible Alert</AlertTitle>
  <AlertDescription>Click the X to dismiss this alert.</AlertDescription>
</Alert>
```

### ProgressIndicator

```tsx
import { Progress, Spinner } from "../components/ui/ProgressIndicator";

// Linear progress bar
<Progress value={35} max={100} />

// Progress bar variants
<Progress value={25} max={100} variant="primary" />
<Progress value={50} max={100} variant="success" />
<Progress value={75} max={100} variant="warning" />
<Progress value={90} max={100} variant="danger" />

// Progress bar sizes
<Progress value={33} max={100} size="sm" />
<Progress value={66} max={100} size="md" />
<Progress value={99} max={100} size="lg" />

// Indeterminate progress
<Progress indeterminate />

// Spinner (circular progress)
<Spinner />
<Spinner size="sm" variant="primary" />
<Spinner size="md" variant="success" />
<Spinner size="lg" variant="warning" />
```

### Toast

```tsx
import { 
  ToastProvider, 
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose
} from "../components/ui/Toast";

// Toast Provider (add to your app root)
<ToastProvider>
  {children}
  <ToastViewport />
</ToastProvider>

// Creating a toast
<Toast>
  <ToastTitle>Success</ToastTitle>
  <ToastDescription>Your changes have been saved.</ToastDescription>
  <ToastClose />
</Toast>

// Toast with action
<Toast>
  <ToastTitle>New notification</ToastTitle>
  <ToastDescription>You have a new message.</ToastDescription>
  <ToastAction altText="View message">View</ToastAction>
  <ToastClose />
</Toast>

// Using with react-toastify or custom toast management
// 1. Create a wrapper component
// 2. Use react-toastify to manage toast state
// See toast.ts for implementation
```

## Migration Examples

Before migrating components to use the new library, identify areas for improvement:

1. **Replace custom modals with Dialog component**
2. **Use Card components for content areas**
3. **Replace form elements with Input, Select, etc.**
4. **Use Badge instead of custom tags**

### Before (Custom Dialog)

```tsx
// Modal backdrop
<div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

// Modal content
<div 
  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
      w-full max-w-2xl max-h-[85vh] overflow-y-auto z-50 
      bg-colors-bg-surface
      border border-colors-border-subtle
      rounded-md shadow-md"
  role="dialog"
>
  {/* Header */}
  <div className="p-3 bg-colors-bg-elevated border-b border-colors-border-subtle flex justify-between items-center">
    <h2 className="text-sm m-0 font-medium">
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
    <div className="flex justify-end gap-4 mt-6">
      <button onClick={onClose}>Cancel</button>
      <button onClick={handleCreate}>Create Server</button>
    </div>
  </div>
</div>
```

### After (with Component Library)

```tsx
<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New MCP Server</DialogTitle>
      <DialogClose />
    </DialogHeader>
    <DialogBody>
      {/* Form fields using new components */}
      <FormField className="mb-4">
        <FormLabel htmlFor="namespace">Namespace</FormLabel>
        <Input 
          id="namespace" 
          value={namespace} 
          onChange={(e) => setNamespace(e.target.value)} 
          placeholder="e.g., development" 
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