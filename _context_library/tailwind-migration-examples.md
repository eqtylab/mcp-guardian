# Tailwind CSS v4 Migration Examples

This document provides examples of how to refactor our current custom CSS to leverage Tailwind v4's utility classes more effectively.

## Current Approach

We currently use a mix of:
- Inline utility classes (some from Tailwind, some custom)
- Custom CSS classes defined in App.css
- Direct CSS variable usage

## Recommended Approach With Tailwind v4

We should:
1. Use Tailwind's utility classes directly in components
2. Configure Tailwind v4 directly in App.css with @config directive
3. Minimize custom CSS classes
4. Use theme() functions to access our design tokens
5. Use Tailwind's `@apply` for any repeated patterns

## Examples

### Example 1: Button Component

**Current Implementation:**
```jsx
<button 
  onClick={updateMcpServer}
  className="btn-success flex items-center gap-2"
  title="Save server changes"
>
  <Save size={16} />
  Save Changes
</button>
```

With custom CSS:
```css
.btn-success {
  background-color: var(--status-success);
  color: hsla(220, 18%, 10%, 0.9);
  border-color: transparent;
}

.btn-success:hover {
  background-color: color-mix(in srgb, var(--status-success), white 15%);
}
```

**Tailwind-Optimized Implementation:**
```jsx
<button 
  onClick={updateMcpServer}
  className="bg-status-success text-bg-base hover:bg-status-success/90 
             border-transparent rounded-sm py-2 px-3 font-medium text-sm
             flex items-center gap-2 transition-colors duration-fast"
  title="Save server changes"
>
  <Save size={16} />
  Save Changes
</button>
```

### Example 2: Card Component

**Current Implementation:**
```jsx
<div className="card">
  <div className="card-header">
    <h2>Title</h2>
    <button>Action</button>
  </div>
  <div className="card-content">
    Content goes here
  </div>
</div>
```

With custom CSS:
```css
.card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
  margin-bottom: 1rem;
}

.card-header {
  padding: 0.75rem 1rem;
  background-color: hsl(220, 15%, 12%);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  padding: 1rem;
  background-color: var(--bg-surface);
}
```

**Tailwind-Optimized Implementation:**
```jsx
<div className="bg-bg-surface rounded-md border border-border-subtle overflow-hidden mb-4">
  <div className="p-3 bg-bg-elevated border-b border-border-subtle flex justify-between items-center">
    <h2>Title</h2>
    <button>Action</button>
  </div>
  <div className="p-4 bg-bg-surface">
    Content goes here
  </div>
</div>
```

### Example 3: Navigation Item

**Current Implementation:**
```jsx
<button
  onClick={onClick}
  className={`nav-item ${isActive ? "active" : ""}`}
  title={description}
  role="tab"
  aria-selected={isActive}
>
  <Icon size={16} strokeWidth={2} />
  <span>{label}</span>
</button>
```

With custom CSS:
```css
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
  border-left: 2px solid transparent;
  cursor: pointer;
  margin: 0;
  width: 100%;
  text-align: left;
  border-radius: 0;
  background: transparent;
}

.nav-item:hover {
  background-color: var(--bg-elevated);
  color: var(--text-primary);
}

.nav-item.active {
  color: var(--text-primary);
  background-color: var(--bg-elevated);
  border-left-color: var(--accent-primary);
}
```

**Tailwind-Optimized Implementation:**
```jsx
<button
  onClick={onClick}
  className={`flex items-center gap-3 py-2 px-4 text-text-secondary
              transition-all duration-fast border-l-2 border-transparent w-full 
              text-left rounded-none bg-transparent cursor-pointer m-0
              hover:bg-bg-elevated hover:text-text-primary
              ${isActive ? 
                "text-text-primary bg-bg-elevated border-l-accent-primary" : 
                ""}`}
  title={description}
  role="tab"
  aria-selected={isActive}
>
  <Icon size={16} strokeWidth={2} />
  <span>{label}</span>
</button>
```

## Benefits of Tailwind v4 Migration

1. **Simplified Configuration**: No separate config file needed, everything in App.css
2. **Consistency**: Standardized approach to styling across components
3. **Maintainability**: Easier to update styles directly in components
4. **Performance**: Automatic CSS optimization with v4
5. **Developer Experience**: Faster development with utility-first approach
6. **Flexibility**: Easier to make one-off customizations without modifying CSS files
7. **Type Safety**: Better theme() function with type checking and autocomplete

## Migration Strategy

1. Update App.css with the Tailwind v4 @config directive
2. Replace CSS variables with theme() functions in our CSS
3. Start with new components using the Tailwind-optimized approach
4. Gradually refactor existing components, starting with the most reused ones
5. Create a few composable components for very common patterns
6. Document the new approach for consistent team implementation