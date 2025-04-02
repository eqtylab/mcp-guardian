# MCP Guardian UI Styling Guidelines

## Color System

The MCP Guardian application uses a technical, cybersecurity-focused color system optimized for dark mode. All styling uses CSS variables with semantic naming conventions.

### Core Variables

```css
/* Core Background Palette */
--bg-base: hsl(220, 18%, 8%);        /* Deep blue-black base */
--bg-surface: hsl(220, 16%, 11%);     /* Card and container backgrounds */
--bg-elevated: hsl(220, 14%, 13%);    /* Elevated elements like form fields */
--bg-interactive: hsl(220, 12%, 16%); /* Interactive elements */

/* Typography */
--text-primary: hsl(220, 15%, 92%);   /* Headings and important text */
--text-secondary: hsl(220, 10%, 70%); /* Body text */
--text-tertiary: hsl(220, 8%, 50%);   /* Supplementary information */

/* Technical UI Accents */
--accent-primary: hsl(195, 80%, 50%);   /* Primary actions and highlights */
--accent-secondary: hsl(215, 85%, 65%); /* Secondary accent color */
--accent-tertiary: hsl(190, 90%, 45%);  /* Technical highlights */

/* Functional */
--status-success: hsl(142, 70%, 45%);
--status-warning: hsl(45, 90%, 55%);
--status-danger: hsl(358, 75%, 55%);
--status-info: hsl(210, 80%, 60%);

/* Borders & Lines */
--border-subtle: hsla(220, 15%, 25%, 0.6);
--border-strong: hsla(220, 20%, 35%, 0.8);
--border-focus: var(--accent-primary);
```

## Typography

- Default font: `'Inter', system-ui, -apple-system, sans-serif`
- Code font: `"JetBrains Mono", "SF Mono", "Roboto Mono", "Menlo", monospace`
- Base font size: `14px` (optimize for information density)
- Type scale:
  - `h1`: 1.25rem
  - `h2`: 1.125rem
  - `h3`: 1rem
  - `.text-sm`: 0.875rem
  - `.text-xs`: 0.75rem

## Component Structure

### Layout

- `.main-container`: Main application wrapper
- `.sidebar`: Navigation sidebar (210px width)
- `.content-container`: Main content area

### Cards and Dialogs

Both cards and dialogs must use the same structure to ensure solid backgrounds with no transparency:

```html
<!-- For regular cards -->
<div class="card">
  <div class="card-header">
    <h2>Title</h2>
    <!-- Optional actions -->
  </div>
  <div class="card-content">
    <!-- Content goes here -->
  </div>
</div>

<!-- For modal dialogs - ALWAYS include the card class -->
<div class="fixed ... card">
  <div class="card-header">
    <h2>Dialog Title</h2>
    <button>×</button>
  </div>
  <div class="card-content">
    <!-- Dialog content -->
  </div>
</div>
```

IMPORTANT: All dialogs MUST use the `card` class along with their positioning classes to ensure proper solid background colors with no transparency.

### Buttons

```html
<button>Default</button>
<button class="btn-primary">Primary Action</button>
<button class="btn-secondary">Secondary Action</button>
<button class="btn-success">Success/Approve</button>
<button class="btn-danger">Danger/Delete</button>
<button class="btn-sm">Small Button</button>
```

### Tags

```html
<div class="tag">Default</div>
<div class="tag tag-primary">Primary</div>
<div class="tag tag-success">Success</div>
<div class="tag tag-warning">Warning</div>
<div class="tag tag-danger">Danger</div>
```

## Utility Classes

### Layout

- `.flex-row`: Flex container with row direction, items centered
- `.flex-col`: Flex container with column direction
- `.space-between`: Justify content space-between
- `.w-full`: Width 100%
- `.text-center`: Center-aligned text

### Spacing

- `.gap-sm`: 0.5rem gap
- `.gap-md`: 1rem gap
- `.gap-lg`: 1.5rem gap
- `.mb-sm`: 0.5rem bottom margin
- `.mb-md`: 1rem bottom margin
- `.mb-lg`: 1.5rem bottom margin
- `.p-0`: No padding

## Design Principles

1. **Technical Aesthetics**: Design for advanced users who need efficient access to technical information
2. **Space Efficiency**: Use compact layouts that maximize information density
3. **Clear Hierarchy**: Establish clear visual hierarchy with color and spacing
4. **Consistency**: Maintain consistent spacing, component patterns, and color usage

## Tool Call & Response Styling

Tool calls and responses use custom styling for readability:

```html
<div class="tool-call">
  <!-- Tool call content -->
</div>

<div class="tool-call-response">
  <!-- Tool response content -->
</div>
```

## JSON Formatting

For JSON content, use specific syntax highlighting colors:

```css
.json-key     { color: var(--accent-primary); }
.json-value   { color: var(--accent-secondary); }
.json-string  { color: var(--status-success); }
.json-number  { color: var(--status-warning); }
.json-boolean { color: var(--accent-secondary); }
.json-null    { color: var(--status-danger); }
```

## Rules to Follow

1. Always use the established CSS variables, not hardcoded colors
2. Keep component sizes compact and efficient for advanced technical users
3. Maintain clear visual distinction between interactive and informational elements
4. Minimize unnecessary whitespace while maintaining readability
5. Use monospaced fonts only for code, JSON, and technical data
6. Follow proper semantic hierarchy (h1, h2, h3) throughout the application
7. Ensure sufficient contrast ratios for all text elements