# MCP Guardian Styling Guide

## Overview

MCP Guardian uses a technical, cybersecurity-focused design system optimized for advanced users who need to efficiently monitor and manage AI tool interactions. The styling prioritizes:

1. **Technical Aesthetics**: Professional, sleek interface with a cybersecurity focus
2. **Space Efficiency**: Compact layouts that maximize information density
3. **Visual Hierarchy**: Clear differentiation between interactive and informational elements
4. **Dark Mode Optimization**: Designed primarily for dark mode operation

## Tailwind CSS v4 Framework

MCP Guardian uses Tailwind CSS v4 as its utility-first CSS framework. This choice provides several advantages:

1. **Performance**: Up to 8x faster build times compared to previous versions
2. **Simplified Configuration**: Direct CSS-based configuration without separate config files
3. **Modern CSS Features**: Native support for CSS variables, color-mix(), and logical properties
4. **Utility-First Approach**: Component styling through utility class composition

## Color System

### Base Palette

The color system uses HSL values for better maintainability and semantic organization. With Tailwind CSS v4, we define these directly in the @config section:

```css
@config {
  theme: {
    colors: {
      /* Core Background Palette */
      bg: {
        base: hsl(220, 18%, 8%),       /* Deep blue-black */
        surface: hsl(220, 16%, 11%),    /* Deep slate */
        elevated: hsl(220, 14%, 13%),   /* Elevated dark surface */
        interactive: hsl(220, 12%, 16%), /* Interactive elements */
      },
      /* Typography */
      text: {
        primary: hsl(220, 15%, 92%),
        secondary: hsl(220, 10%, 70%),
        tertiary: hsl(220, 8%, 50%),
      },
      /* Technical UI Accents */
      accent: {
        primary: hsl(195, 80%, 50%),  /* Cybersecurity blue */
        secondary: hsl(215, 85%, 65%), /* Secondary actions */
        tertiary: hsl(190, 90%, 45%),  /* Terminal green */
      },
      /* Functional Elements */
      status: {
        success: hsl(142, 70%, 45%),
        warning: hsl(45, 90%, 55%),
        danger: hsl(358, 75%, 55%),
        info: hsl(210, 80%, 60%),
      },
    },
  },
}
```

Tailwind CSS v4 automatically exposes all these tokens as CSS variables, so you can access them both via Tailwind classes (like `bg-bg-base`) and via CSS variables when needed.

### Usage Guidelines

With Tailwind CSS v4, prefer using the utility classes directly:

1. **Backgrounds**: 
   - `bg-bg-base` for main app background
   - `bg-bg-surface` for cards
   - `bg-bg-elevated` for interactive containers

2. **Text**: 
   - `text-text-primary` for headings and important text
   - `text-text-secondary` for body text
   - `text-text-tertiary` for supplementary information

3. **Accents**: 
   - `bg-accent-primary` / `text-accent-primary` / `border-accent-primary` for primary actions
   - `bg-accent-secondary` / `text-accent-secondary` for interactive elements
   - `bg-accent-tertiary` / `text-accent-tertiary` for highlighting technical information

4. **Status**: Use appropriate status colors sparingly to indicate success, warning, danger, or informational states
   - `bg-status-success` / `text-status-success` for success
   - `bg-status-warning` / `text-status-warning` for warnings
   - `bg-status-danger` / `text-status-danger` for errors
   - `bg-status-info` / `text-status-info` for information

## Typography

### Font Stack

Our typography is configured in the Tailwind config:

```css
@config {
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['"JetBrains Mono"', '"SF Mono"', '"Roboto Mono"', 'Menlo', 'monospace'],
    },
  }
}
```

Use these with Tailwind utility classes:
- `font-sans` for regular text
- `font-mono` for code and JSON

### Size Scale

The application uses a compact type scale optimized for technical interfaces:

```css
@config {
  theme: {
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem", 
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
    },
  }
}
```

Use these with Tailwind utility classes:
- `text-xs` (0.75rem) for very small text
- `text-sm` (0.875rem) for secondary and smaller text
- `text-base` (1rem) for body text
- `text-lg` (1.125rem) for h2 and subheadings
- `text-xl` (1.25rem) for h1 and major headings

## Component System

### Layout Components

1. **Main Container**: `.main-container` - Full-screen layout wrapper
2. **Sidebar**: `.sidebar` - Navigation sidebar with fixed width
3. **Content Container**: `.content-container` - Main content area with scrolling

### Cards and Dialogs

With Tailwind CSS v4, we use utility classes directly instead of custom component classes:

```html
<!-- Standard card component -->
<div class="bg-bg-surface rounded-md border border-border-subtle overflow-hidden mb-4">
  <div class="p-3 bg-bg-elevated border-b border-border-subtle flex justify-between items-center">
    <h2>Title</h2>
    <button>Action</button>
  </div>
  <div class="p-4 bg-bg-surface">
    Content goes here
  </div>
</div>

<!-- Modal dialog with utility styling -->
<div class="fixed inset-0 flex items-center justify-center bg-bg-base/80">
  <div class="bg-bg-surface rounded-md border border-border-subtle overflow-hidden max-w-md w-full">
    <div class="p-3 bg-bg-elevated border-b border-border-subtle flex justify-between items-center">
      <h2>Dialog Title</h2>
      <button>Close</button>
    </div>
    <div class="p-4 bg-bg-surface">
      Dialog content here
    </div>
  </div>
</div>
```

IMPORTANT: All modal dialogs must ensure proper solid backgrounds with no transparency for the dialog content area. Use `bg-bg-surface` for the main dialog background and `bg-bg-elevated` for header sections.

### Buttons

With Tailwind CSS v4, button variants use utility compositions:

1. **Default**:
   ```html
   <button class="py-2 px-3 rounded-sm bg-bg-interactive border border-border-subtle 
                  text-text-primary text-sm font-medium transition-colors duration-fast
                  hover:bg-bg-interactive/80 focus:outline-none focus:ring-1 focus:ring-accent-primary">
     Button Text
   </button>
   ```

2. **Primary**:
   ```html
   <button class="py-2 px-3 rounded-sm bg-accent-primary text-bg-base border-0
                  text-sm font-medium transition-colors duration-fast
                  hover:bg-accent-primary/90 focus:outline-none focus:ring-1 focus:ring-accent-primary">
     Primary Action
   </button>
   ```

3. **Secondary**:
   ```html
   <button class="py-2 px-3 rounded-sm bg-transparent border border-accent-primary
                  text-accent-primary text-sm font-medium transition-colors duration-fast
                  hover:bg-accent-primary/10 focus:outline-none focus:ring-1 focus:ring-accent-primary">
     Secondary Action
   </button>
   ```

4. **Success**:
   ```html
   <button class="py-2 px-3 rounded-sm bg-status-success text-bg-base border-0
                  text-sm font-medium transition-colors duration-fast
                  hover:bg-status-success/90 focus:outline-none focus:ring-1 focus:ring-status-success">
     Confirm Action
   </button>
   ```

5. **Danger**:
   ```html
   <button class="py-2 px-3 rounded-sm bg-status-danger text-white border-0
                  text-sm font-medium transition-colors duration-fast
                  hover:bg-status-danger/90 focus:outline-none focus:ring-1 focus:ring-status-danger">
     Delete
   </button>
   ```

6. **Small**:
   ```html
   <button class="py-1 px-2 rounded-sm text-xs font-medium">
     Small Button
   </button>
   ```

### Tags

Tags provide visual classification:

```html
<div class="tag">Default</div>
<div class="tag tag-primary">Primary</div>
<div class="tag tag-success">Success</div>
<div class="tag tag-warning">Warning</div>
<div class="tag tag-danger">Danger</div>
```

### Tool Visualization

Tool calls and responses use specialized components with optimized styling:

1. **Tool Call**: `.tool-call` - For outbound tool call requests
2. **Tool Response**: `.tool-call-response` - For inbound tool responses

## Utility Classes with Tailwind CSS v4

Tailwind already provides comprehensive utility classes for layout, spacing, and more. Use Tailwind's native utilities instead of custom classes:

### Layout

```css
/* Instead of .flex-row */
flex items-center    /* Flex row layout with items centered */

/* Instead of .flex-col */
flex flex-col        /* Flex column layout */

/* Instead of .space-between */
justify-between      /* Justify content space between */

/* Instead of .w-full */
w-full               /* Full width */

/* Instead of .text-center */
text-center          /* Center align text */
```

### Spacing

```css
/* Instead of custom gap classes */
gap-2                /* Small gap (0.5rem) */
gap-4                /* Medium gap (1rem) */
gap-6                /* Large gap (1.5rem) */

/* Instead of custom margin classes */
mb-2                 /* Small margin bottom (0.5rem) */
mb-4                 /* Medium margin bottom (1rem) */
mb-6                 /* Large margin bottom (1.5rem) */

/* Instead of .p-0 */
p-0                  /* No padding */
```

### Responsive Design

Take advantage of Tailwind's responsive prefixes:

```css
sm:flex md:grid lg:flex-row xl:w-1/2
```

### Dynamic Values in Tailwind v4

Tailwind v4 supports dynamic values using bracket notation:

```css
w-[calc(100%-2rem)]
text-[var(--dynamic-size)]
grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]
```

## Implementation Status & Best Practices

### Current Implementation (2023-05-18)

We have successfully implemented Tailwind CSS v4 with the following:

1. **@config Directive**: All theme tokens defined in App.css using Tailwind v4's @config
2. **Theme Functions**: CSS variables replaced with theme() functions throughout CSS
3. **Utility First Components**: Starting to refactor components to use utility classes
4. **Component Examples**: McpServerComponent refactored as an example for other components

### Best Practices with Tailwind CSS v4

1. **Use Tailwind Utilities**: Prefer Tailwind utility classes over custom CSS classes
2. **Theme Extension**: Use the @config directive in App.css rather than custom variables
3. **Consistency**: Use the established color tokens and utility patterns consistently
4. **Space Efficiency**: Prioritize compact layouts that minimize scrolling
5. **Technical Focus**: Remember the audience is technical users who need efficient access to information
6. **Visual Hierarchy**: Use color and sizing to guide attention to the most important elements
7. **Dark Mode**: Design with dark mode as the primary experience
8. **Dynamic Values**: Take advantage of Tailwind v4's dynamic utility values for responsive design
9. **Performance**: Leverage Tailwind v4's performance optimizations by keeping CSS minimal

### Component Refactoring Approach

When converting existing components to use Tailwind utility classes:

1. **Preserve Visual Design**: Maintain the exact same visual appearance
2. **Use Theme Tokens**: Access colors, fonts, spacing via utility classes (e.g., bg-bg-surface)
3. **Remove Custom Classes**: Replace custom classes with utility compositions
4. **Refactor One Component at a Time**: Test each refactored component before moving to the next
5. **Maintain Semantics**: Keep semantic HTML structure while changing class names

## JSON Editor Styling

JSON content should use consistent syntax highlighting, leveraging Tailwind's theme colors through CSS:

```css
.json-key     { color: theme(colors.accent.primary); }
.json-value   { color: theme(colors.accent.secondary); }
.json-string  { color: theme(colors.status.success); }
.json-number  { color: theme(colors.status.warning); }
.json-boolean { color: theme(colors.accent.secondary); }
.json-null    { color: theme(colors.status.danger); }
```