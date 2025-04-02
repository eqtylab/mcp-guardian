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

The color system uses HSL values for better maintainability and semantic organization. With Tailwind CSS v4, we define these directly in the @theme section:

```css
@theme {
  /* Core Background Palette */
  --colors-bg-base: hsl(220 18% 8%);       /* Deep blue-black */
  --colors-bg-surface: hsl(220 16% 11%);    /* Deep slate */
  --colors-bg-elevated: hsl(220 14% 13%);   /* Elevated dark surface */
  --colors-bg-interactive: hsl(220 12% 16%); /* Interactive elements */
  
  /* Typography */
  --colors-text-primary: hsl(220 15% 92%);
  --colors-text-secondary: hsl(220 10% 70%);
  --colors-text-tertiary: hsl(220 8% 50%);
  
  /* Technical UI Accents */
  --colors-accent-primary: hsl(195 80% 50%);  /* Cybersecurity blue */
  --colors-accent-secondary: hsl(215 85% 65%); /* Secondary actions */
  --colors-accent-tertiary: hsl(190 90% 45%);  /* Terminal green */
  
  /* Functional Elements */
  --colors-status-success: hsl(142 70% 45%);
  --colors-status-warning: hsl(45 90% 55%);
  --colors-status-danger: hsl(358 75% 55%);
  --colors-status-info: hsl(210 80% 60%);
}
```

Tailwind CSS v4 automatically makes these variables available through Tailwind classes, and you can also access them directly via standard CSS var() syntax.

### Usage Guidelines

With Tailwind CSS v4, prefer using the utility classes directly:

1. **Backgrounds**: 
   - `bg-colors-bg-base` for main app background
   - `bg-colors-bg-surface` for cards
   - `bg-colors-bg-elevated` for interactive containers

2. **Text**: 
   - `text-colors-text-primary` for headings and important text
   - `text-colors-text-secondary` for body text
   - `text-colors-text-tertiary` for supplementary information

3. **Accents**: 
   - `bg-colors-accent-primary` / `text-colors-accent-primary` / `border-colors-accent-primary` for primary actions
   - `bg-colors-accent-secondary` / `text-colors-accent-secondary` for interactive elements
   - `bg-colors-accent-tertiary` / `text-colors-accent-tertiary` for highlighting technical information

4. **Status**: Use appropriate status colors sparingly to indicate success, warning, danger, or informational states
   - `bg-colors-status-success` / `text-colors-status-success` for success
   - `bg-colors-status-warning` / `text-colors-status-warning` for warnings
   - `bg-colors-status-danger` / `text-colors-status-danger` for errors
   - `bg-colors-status-info` / `text-colors-status-info` for information

## Typography

### Font Stack

Our typography is configured in the Tailwind theme:

```css
@theme {
  --fontFamily-sans: "Inter", system-ui, -apple-system, sans-serif;
  --fontFamily-mono: "JetBrains Mono", "SF Mono", "Roboto Mono", Menlo, monospace;
}
```

Use these with Tailwind utility classes:
- `font-sans` for regular text
- `font-mono` for code and JSON

You can also access them directly with CSS variables:
- `var(--fontFamily-sans)` 
- `var(--fontFamily-mono)`

### Size Scale

The application uses a compact type scale optimized for technical interfaces:

```css
@theme {
  --fontSize-xs: 0.75rem;
  --fontSize-sm: 0.875rem;
  --fontSize-base: 1rem;
  --fontSize-lg: 1.125rem;
  --fontSize-xl: 1.25rem;
}
```

Use these with Tailwind utility classes:
- `text-xs` (0.75rem) for very small text
- `text-sm` (0.875rem) for secondary and smaller text
- `text-base` (1rem) for body text
- `text-lg` (1.125rem) for h2 and subheadings
- `text-xl` (1.25rem) for h1 and major headings

You can also access them directly with CSS variables:
- `var(--fontSize-xs)`, `var(--fontSize-sm)`, etc.

## Component System

### Layout Components

1. **Main Container**: `.main-container` - Full-screen layout wrapper
2. **Sidebar**: `.sidebar` - Navigation sidebar with fixed width
3. **Content Container**: `.content-container` - Main content area with scrolling

### Cards and Dialogs

With Tailwind CSS v4, we use utility classes directly instead of custom component classes:

```html
<!-- Standard card component -->
<div class="bg-colors-bg-surface rounded-md border border-colors-border-subtle overflow-hidden mb-4">
  <div class="p-3 bg-colors-bg-elevated border-b border-colors-border-subtle flex justify-between items-center">
    <h2>Title</h2>
    <button>Action</button>
  </div>
  <div class="p-4 bg-colors-bg-surface">
    Content goes here
  </div>
</div>

<!-- Modal dialog with utility styling -->
<div class="fixed inset-0 flex items-center justify-center bg-colors-bg-base/80">
  <div class="bg-colors-bg-surface rounded-md border border-colors-border-subtle overflow-hidden max-w-md w-full">
    <div class="p-3 bg-colors-bg-elevated border-b border-colors-border-subtle flex justify-between items-center">
      <h2>Dialog Title</h2>
      <button>Close</button>
    </div>
    <div class="p-4 bg-colors-bg-surface">
      Dialog content here
    </div>
  </div>
</div>
```

IMPORTANT: All modal dialogs must ensure proper solid backgrounds with no transparency for the dialog content area. Use `bg-colors-bg-surface` for the main dialog background and `bg-colors-bg-elevated` for header sections.

### Buttons

With Tailwind CSS v4, button variants use utility compositions:

1. **Default**:
   ```html
   <button class="py-2 px-3 rounded-sm bg-colors-bg-interactive border border-colors-border-subtle 
                  text-colors-text-primary text-sm font-medium transition-colors
                  hover:bg-colors-bg-interactive/80 focus:outline-none focus:ring-1 focus:ring-colors-accent-primary">
     Button Text
   </button>
   ```

2. **Primary**:
   ```html
   <button class="py-2 px-3 rounded-sm bg-colors-accent-primary text-bg-base border-0
                  text-sm font-medium transition-colors
                  hover:bg-colors-accent-primary/90 focus:outline-none focus:ring-1 focus:ring-colors-accent-primary">
     Primary Action
   </button>
   ```

3. **Secondary**:
   ```html
   <button class="py-2 px-3 rounded-sm bg-transparent border border-colors-accent-primary
                  text-colors-accent-primary text-sm font-medium transition-colors
                  hover:bg-colors-accent-primary/10 focus:outline-none focus:ring-1 focus:ring-colors-accent-primary">
     Secondary Action
   </button>
   ```

4. **Success**:
   ```html
   <button class="py-2 px-3 rounded-sm bg-colors-status-success text-bg-base border-0
                  text-sm font-medium transition-colors
                  hover:bg-colors-status-success/90 focus:outline-none focus:ring-1 focus:ring-colors-status-success">
     Confirm Action
   </button>
   ```

5. **Danger**:
   ```html
   <button class="py-2 px-3 rounded-sm bg-colors-status-danger text-white border-0
                  text-sm font-medium transition-colors
                  hover:bg-colors-status-danger/90 focus:outline-none focus:ring-1 focus:ring-colors-status-danger">
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

1. **Tool Call**: 
   ```html
   <div class="border-l-2 border-colors-accent-secondary pl-4 py-3 pr-4 
                bg-[hsla(215,85%,65%,0.05)] rounded-sm mb-4">
     <!-- Tool call content -->
   </div>
   ```

2. **Tool Response**: 
   ```html
   <div class="border-l-2 border-colors-accent-tertiary pl-4 py-3 pr-4 
                bg-[hsla(190,90%,45%,0.05)] rounded-sm mb-4">
     <!-- Tool response content -->
   </div>
   ```

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

### Current Implementation (2023-05-22)

We have successfully implemented Tailwind CSS v4 with the following:

1. **@theme Directive**: All theme tokens defined in App.css using Tailwind v4's @theme directive
2. **CSS Variables**: Standard CSS var() syntax used throughout CSS instead of theme() functions
3. **Utility First Components**: Starting to refactor components to use utility classes
4. **Component Examples**: McpServerComponent, GuardProfileComponent, and ServerCollectionComponent refactored as examples

### Best Practices with Tailwind CSS v4

1. **Use Tailwind Utilities**: Prefer Tailwind utility classes over custom CSS classes
2. **Component-Level Styling**: Use inline Tailwind utilities directly in components instead of custom CSS classes
3. **Global vs Component Styles**: Keep App.css focused only on reusable patterns and global styles
4. **Theme Variables**: Use CSS variables defined in the @theme directive when needed
5. **Consistency**: Use the established color tokens and utility patterns consistently
6. **Space Efficiency**: Prioritize compact layouts that minimize scrolling
7. **Technical Focus**: Remember the audience is technical users who need efficient access to information
8. **Visual Hierarchy**: Use color and sizing to guide attention to the most important elements
9. **Dark Mode**: Design with dark mode as the primary experience
10. **Dynamic Values**: Take advantage of Tailwind v4's dynamic utility values for responsive design
11. **Performance**: Leverage Tailwind v4's performance optimizations by keeping CSS minimal

### Component Refactoring Approach

When converting existing components to use Tailwind utility classes:

1. **Preserve Visual Design**: Maintain the exact same visual appearance
2. **Use Theme Tokens**: Access colors, fonts, spacing via utility classes (e.g., bg-bg-surface)
3. **Remove Custom Classes**: Replace custom classes with utility compositions
4. **Refactor One Component at a Time**: Test each refactored component before moving to the next
5. **Maintain Semantics**: Keep semantic HTML structure while changing class names

### Component-Level vs. Global Styling

For an optimal approach to styling, follow these guidelines:

1. **App.css Should Contain:**
   - CSS variables defined in the @theme directive
   - Reset styles and base element styling
   - Truly global styles that affect the entire application
   - Reusable utility classes that can't be built with Tailwind
   - Specialized components that require complex CSS (like tool call visualizations)

2. **Component Files Should Contain:**
   - Direct Tailwind utility classes for layout, spacing, colors, etc.
   - Component-specific styling that doesn't need to be shared
   - Composition of utilities to create consistent patterns

3. **When to Use Custom CSS Classes:**
   - Only for complex components that can't be styled with utilities alone
   - When the same exact styling pattern is used in 3+ different components
   - For dynamic styles that need JavaScript/React interaction
   - For animations or transitions that can't be handled with utility classes

4. **Benefits of Component-Level Styling:**
   - Better code organization and component encapsulation
   - Reduced global CSS file size and complexity
   - Clearer understanding of component styling without switching between files
   - Easier refactoring and component changes without side effects
   - Improved performance through CSS optimization

### Refactoring Examples

#### From Custom CSS Classes to Tailwind Utilities

**Before:**
```tsx
<div className="card">
  <div className="card-header">
    <h2>Dialog Title</h2>
    <button className="p-1 bg-transparent border-0">
      <X size={14} />
    </button>
  </div>
  <div className="card-content">
    <p className="mb-md">Dialog content here</p>
    <div className="btn-group justify-end">
      <button className="btn-sm">Cancel</button>
      <button className="btn-danger btn-sm">Delete</button>
    </div>
  </div>
</div>
```

**After:**
```tsx
<div className="bg-colors-bg-surface border border-colors-border-subtle rounded-md shadow-md overflow-hidden">
  {/* Header */}
  <div className="p-3 bg-colors-bg-elevated border-b border-colors-border-subtle flex justify-between items-center">
    <h2 className="text-sm m-0 font-medium">Dialog Title</h2>
    <button className="p-1 bg-transparent border-0 text-colors-text-primary hover:text-colors-text-secondary transition-colors">
      <X size={14} />
    </button>
  </div>
  
  {/* Content */}
  <div className="p-4 bg-colors-bg-surface">
    <p className="mb-4 text-colors-text-secondary">Dialog content here</p>
    <div className="flex justify-end gap-2">
      <button className="py-1 px-2 text-xs font-medium rounded-sm bg-colors-bg-interactive border border-colors-border-subtle
                         text-colors-text-primary hover:bg-colors-bg-interactive/80">
        Cancel
      </button>
      <button className="py-1 px-2 text-xs font-medium rounded-sm bg-colors-status-danger text-white border-0
                        hover:bg-colors-status-danger/90">
        Delete
      </button>
    </div>
  </div>
</div>
```

#### Best Practices in Refactored Components

1. **Use comments to organize sections:**
   ```tsx
   {/* Header */}
   <div className="...">...</div>
   
   {/* Content */}
   <div className="...">...</div>
   ```

2. **Format long className strings for readability:**
   ```tsx
   <button 
     className="py-2 px-3 rounded-sm bg-colors-status-success 
               text-bg-base border-0 text-sm font-medium 
               transition-colors hover:bg-colors-status-success/90
               focus:outline-none focus:ring-1 focus:ring-colors-status-success"
   >
     Save
   </button>
   ```

3. **Use semantic class grouping:**
   - Layout properties first (flex, grid, positioning)
   - Sizing and spacing (width, height, padding, margin)
   - Visual properties (colors, borders, shadows)
   - Typography (font, text)
   - Interactive states (hover, focus)

## JSON Editor Styling

JSON content should use consistent syntax highlighting, leveraging our CSS variables:

```css
.json-key     { color: var(--colors-accent-primary); }
.json-value   { color: var(--colors-accent-secondary); }
.json-string  { color: var(--colors-status-success); }
.json-number  { color: var(--colors-status-warning); }
.json-boolean { color: var(--colors-accent-secondary); }
.json-null    { color: var(--colors-status-danger); }
```