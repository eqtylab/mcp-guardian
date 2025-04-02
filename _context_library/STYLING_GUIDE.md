# MCP Guardian Styling Guide

## Overview

MCP Guardian uses a technical, cybersecurity-focused design system optimized for advanced users who need to efficiently monitor and manage AI tool interactions. The styling prioritizes:

1. **Technical Aesthetics**: Professional, sleek interface with a cybersecurity focus
2. **Space Efficiency**: Compact layouts that maximize information density
3. **Visual Hierarchy**: Clear differentiation between interactive and informational elements
4. **Dark Mode Optimization**: Designed primarily for dark mode operation

## Color System

### Base Palette

The color system uses HSL values for better maintainability and semantic organization:

```css
/* Core Background Palette */
--bg-base: hsl(220, 18%, 8%);       /* Deep blue-black */
--bg-surface: hsl(220, 16%, 11%);    /* Deep slate */
--bg-elevated: hsl(220, 14%, 13%);   /* Elevated dark surface */
--bg-interactive: hsl(220, 12%, 16%); /* Interactive elements */

/* Typography */
--text-primary: hsl(220, 15%, 92%);
--text-secondary: hsl(220, 10%, 70%);
--text-tertiary: hsl(220, 8%, 50%);

/* Technical UI Accents */
--accent-primary: hsl(195, 80%, 50%);  /* Cybersecurity blue */
--accent-secondary: hsl(215, 85%, 65%); /* Secondary actions */
--accent-tertiary: hsl(190, 90%, 45%);  /* Terminal green */

/* Functional Elements */
--status-success: hsl(142, 70%, 45%);
--status-warning: hsl(45, 90%, 55%);
--status-danger: hsl(358, 75%, 55%);
--status-info: hsl(210, 80%, 60%);
```

### Usage Guidelines

1. **Backgrounds**: Use `--bg-base` for main app background, `--bg-surface` for cards, and `--bg-elevated` for interactive containers
2. **Text**: Use `--text-primary` for headings and important text, `--text-secondary` for body text, and `--text-tertiary` for supplementary information
3. **Accents**: Use `--accent-primary` for primary actions, `--accent-secondary` for interactive elements, and `--accent-tertiary` for highlighting technical information
4. **Status**: Use appropriate status colors sparingly to indicate success, warning, danger, or informational states

## Typography

### Font Stack

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

For code and JSON:
```css
font-family: "JetBrains Mono", "SF Mono", "Roboto Mono", "Menlo", monospace;
```

### Size Scale

The application uses a compact type scale optimized for technical interfaces:

```css
body { font-size: 14px; line-height: 1.5; }
h1 { font-size: 1.25rem; }
h2 { font-size: 1.125rem; }
h3 { font-size: 1rem; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
```

## Component System

### Layout Components

1. **Main Container**: `.main-container` - Full-screen layout wrapper
2. **Sidebar**: `.sidebar` - Navigation sidebar with fixed width
3. **Content Container**: `.content-container` - Main content area with scrolling

### Cards and Dialogs

Cards and dialogs use a standardized structure with solid backgrounds (no transparency):

```html
<!-- Standard card component -->
<div class="card">
  <div class="card-header">
    <h2>Title</h2>
    <button>Action</button>
  </div>
  <div class="card-content">
    Content goes here
  </div>
</div>

<!-- Modal dialog with card styling -->
<div class="fixed ... bg-bg-surface ... card">
  <div class="card-header">
    <h2>Dialog Title</h2>
    <button>Close</button>
  </div>
  <div class="card-content">
    Dialog content here
  </div>
</div>
```

IMPORTANT: All modal dialogs must include the `card` class in addition to their positioning classes to ensure proper solid backgrounds with no transparency. The `card-header` and `card-content` classes provide solid background colors.

### Buttons

Button variants follow a consistent pattern:

1. **Default**: Base button styling
2. **Primary**: `.btn-primary` - Most important actions
3. **Secondary**: `.btn-secondary` - Secondary actions
4. **Success**: `.btn-success` - Confirmations and positive actions
5. **Danger**: `.btn-danger` - Destructive actions
6. **Small**: `.btn-sm` - Compact button variant

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

## Utility Classes

The system includes utility classes for common layout and spacing needs:

### Layout

```css
.flex-row      /* Flex row layout with items centered */
.flex-col      /* Flex column layout */
.space-between /* Justify content space between */
.w-full        /* Full width */
.text-center   /* Center align text */
```

### Spacing

```css
.gap-sm        /* Small gap (0.5rem) */
.gap-md        /* Medium gap (1rem) */
.gap-lg        /* Large gap (1.5rem) */
.mb-sm         /* Small margin bottom (0.5rem) */
.mb-md         /* Medium margin bottom (1rem) */
.mb-lg         /* Large margin bottom (1.5rem) */
.p-0           /* No padding */
```

## Best Practices

1. **Consistency**: Use the established color tokens and components consistently
2. **Space Efficiency**: Prioritize compact layouts that minimize scrolling
3. **Technical Focus**: Remember the audience is technical users who need efficient access to information
4. **Visual Hierarchy**: Use color and sizing to guide attention to the most important elements
5. **Dark Mode**: Design with dark mode as the primary experience

## JSON Editor Styling

JSON content should use consistent syntax highlighting:

```css
.json-key     { color: var(--accent-primary); }
.json-value   { color: var(--accent-secondary); }
.json-string  { color: var(--status-success); }
.json-number  { color: var(--status-warning); }
.json-boolean { color: var(--accent-secondary); }
.json-null    { color: var(--status-danger); }
```