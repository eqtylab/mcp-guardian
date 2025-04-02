# Phase 1 Interject: Radix UI Integration & Component Library Development

## Overview

This interject to Phase 1 focuses on elevating our component architecture by integrating Radix UI for accessible, unstyled primitives and establishing a comprehensive component library. This approach enables us to encapsulate styling and behavior in reusable components rather than global CSS, improving maintainability and consistency.

## Goals

1. **Radix UI Integration**: Integrate Radix UI primitives for accessible, headless components
2. **Component Library Development**: Create a component library with consistent styling
3. **CSS Architecture Optimization**: Move component-specific styles from App.css to their respective components
4. **Documentation & Usage Patterns**: Establish clear patterns for component usage

## Task List and Progress

### 1. Radix UI Integration

- [x] **Setup & Dependencies**
  - [x] Add Radix UI core dependencies (`@radix-ui/react-dialog`, `@radix-ui/react-popover`, etc.)
  - [x] Add utility packages for component variants (`class-variance-authority`, `clsx`)
  - [x] Configure Radix UI with Tailwind CSS
  - [x] Create integration examples

- [ ] **Accessibility Audit**
  - [ ] Review current components for accessibility issues
  - [ ] Document accessibility improvements needed
  - [ ] Create accessibility testing plan

### 2. Component Library Development

- [x] **Core Component Library Structure**
  - [x] Create a `/components/ui` directory for reusable components
  - [x] Establish component architecture (props, variants, etc.)
  - [x] Define naming conventions and file structure

- [x] **Button Component System**
  - [x] Create `Button.tsx` component with variants (primary, secondary, success, danger)
  - [x] Implement size variants (small, medium, large)
  - [x] Support for icons and loading states
  - [x] Document usage patterns

- [x] **Dialog Component System**
  - [x] Create `Dialog.tsx` component using Radix UI Dialog primitive
  - [x] Implement header, content, and footer compound components
  - [x] Design consistent styling with animations
  - [x] Support various sizes and fullscreen mode

- [x] **Form Components**
  - [x] Create `Input.tsx` component with validation states
  - [x] Create `Textarea.tsx` component
  - [x] Create `Select.tsx` component using Radix UI Select primitive
  - [x] Create `Checkbox.tsx` component using Radix UI Checkbox primitive
  - [x] Create `Label.tsx` and `FormField.tsx` components for layout and validation
  - [x] Support for helper text and required indicators

- [x] **Card Component System**
  - [x] Create `Card.tsx` component with header, content, and footer
  - [x] Support various visual styles and sizes
  - [ ] Implement loading states and empty states

- [x] **Data Display Components**
  - [x] Create `Badge.tsx` component with variants (status, size)
  - [x] Create `JSONViewer.tsx` component for technical JSON display
  - [x] Create `Collapsible.tsx` component using Radix UI Collapsible
  - [x] Create improved `ToolCall.tsx` and `ToolCallResponse.tsx` components

- [x] **Navigation Components**
  - [x] Create `Tabs.tsx` component using Radix UI Tabs
  - [x] Create `NavigationMenu.tsx` using Radix UI NavigationMenu
  - [x] Create `Breadcrumb.tsx` component 

- [x] **Feedback Components**
  - [x] Create `Toast.tsx` component using Radix UI Toast
  - [x] Create `Alert.tsx` component for status notifications
  - [x] Create `ProgressIndicator.tsx` for operation feedback

### 3. CSS Architecture Optimization

- [x] **Refactor App.css**
  - [x] Move button styles from App.css to Button component
  - [x] Move dialog/card styles from App.css to respective components
  - [x] Move form element styles to form components
  - [x] Keep only theme variables and truly global styles in App.css

- [x] **Component-Specific Styling**
  - [x] Implement consistent class naming within components
  - [x] Use CSS variables from theme in components
  - [x] Document component variant API

### 4. Migration & Documentation

- [x] **Component Migration Plan**
  - [x] Identify all existing components to be migrated
  - [x] Prioritize components by usage frequency
  - [x] Create migration schedule

- [x] **Component Documentation**
  - [x] Document each component's API, variants, and usage
  - [x] Create example usage patterns
  - [ ] Document accessibility features

## Implementation Strategy

### Component Architecture

Each UI component should follow these principles:

1. **Composable**: Support composition through children or compound components
2. **Self-contained**: Include all necessary styles within the component
3. **Accessible**: Built on Radix UI primitives where appropriate
4. **Themeable**: Use CSS variables from our theme
5. **Variant-based**: Support various visual styles through variant props

### Example Component Structure

```tsx
// components/ui/Button.tsx
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-colors-accent-primary",
  {
    variants: {
      variant: {
        primary: "bg-colors-accent-primary text-[hsla(220,18%,10%,0.9)] hover:bg-[color-mix(in_srgb,var(--colors-accent-primary),white_15%)]",
        secondary: "bg-transparent border border-colors-accent-primary text-colors-accent-primary hover:bg-[hsla(195,80%,50%,0.08)]",
        success: "bg-colors-status-success text-[hsla(220,18%,10%,0.9)] hover:bg-[color-mix(in_srgb,var(--colors-status-success),white_15%)]",
        danger: "bg-colors-status-danger text-white hover:bg-[color-mix(in_srgb,var(--colors-status-danger),white_15%)]",
      },
      size: {
        sm: "h-7 px-2 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button 
        className={cn(buttonVariants({ variant, size }), className)} 
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <span className="mr-2">Loading...</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

### Usage Example

```tsx
// Before
<button className="btn-primary">Save</button>
<button className="btn-sm btn-secondary">Cancel</button>

// After
<Button variant="primary">Save</Button>
<Button variant="secondary" size="sm">Cancel</Button>
```

## Success Criteria

- [x] All core UI components migrated to Radix UI + component library
- [x] App.css reduced to only theme variables and global styles
- [x] Improved accessibility across all components
- [x] Consistent styling and behavior across application
- [x] Well-documented component API and usage patterns
- [x] Reduced duplication of styling code
- [x] Clear separation of concerns between global styling and component-specific styling

## Next Steps

1. ✅ Create the component library structure and implement core components (Button, Dialog, Card)
2. ✅ Add form components (Input, Textarea, Select, Checkbox)
3. ✅ Add feedback components (Toast, Alert, ProgressIndicator)
4. ✅ Refactor App.css to remove component-specific styles
5. ✅ Create comprehensive documentation for the component library
6. Continue migrating existing components to use the new component library
7. Consider creating a comprehensive accessibility audit tool/plan