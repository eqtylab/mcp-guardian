# Phase 3: Animation & Effects Guide

This guide outlines the principles, techniques, and implementation strategies for animations and effects in our cyberpunk-inspired UI.

## Animation Principles

For our cyberpunk UI, animations should follow these key principles:

1. **Purpose-Driven**: Every animation should serve a functional purpose (feedback, direction, status)
2. **Subtle but Noticeable**: Effects should enhance without overwhelming
3. **Tech-Inspired**: Animations should feel digital, mechanical, or electronic
4. **Performance-Optimized**: All animations must maintain 60fps on target devices

## Effect Categories

### 1. Micro-Interactions

Small, subtle animations that provide immediate feedback to user actions:

- **Button Press**: Quick scale reduction + digital distortion effect
- **Toggle State**: Slide with glitch/digital transition
- **Form Input**: Subtle glow on focus/input
- **Hover States**: Border illumination + subtle color shift

```css
/* Example: Button Press Animation */
@keyframes cyber-press {
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(0.97); filter: brightness(1.15) hue-rotate(5deg); }
  100% { transform: scale(1); filter: brightness(1); }
}

.cyber-element:active {
  animation: cyber-press 0.2s ease forwards;
}
```

### 2. State Transitions

Animations for component state changes:

- **Loading States**: Scan line or digital noise effect
- **Error States**: Digital glitch or distortion
- **Success States**: Pulse with expanding glow effect
- **Selection States**: Illuminate and enhance borders

```css
/* Example: Loading Scan Effect */
@keyframes cyber-scan {
  0% { background-position: 0% 0%; }
  100% { background-position: 0% 100%; }
}

.cyber-loading {
  position: relative;
  overflow: hidden;
}

.cyber-loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(var(--neon-cyan-rgb), 0.5), 
    transparent
  );
  background-size: 100% 100%;
  animation: cyber-scan 1.5s infinite;
  z-index: 2;
}
```

### 3. Page Transitions

Animations for navigating between routes or views:

- **Digital Fade**: Content dissolves into digital particles
- **Glitch Transition**: Brief controlled distortion during change
- **Slide with Data Effect**: Content slides with trailing "data" effects
- **Terminal-style Refresh**: Content redraws line by line

```tsx
// Example: Page Transition Component
import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    filter: "brightness(1.5) blur(10px)",
  },
  in: {
    opacity: 1,
    filter: "brightness(1) blur(0px)",
  },
  out: {
    opacity: 0,
    filter: "brightness(1.5) blur(10px)",
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};

export const CyberPageTransition = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);
```

### 4. Ambient Effects

Subtle background animations that create atmosphere:

- **Pulse Effect**: Slow, subtle color or glow pulsing
- **Digital Rain**: Very faint matrix-style effects in backgrounds
- **Grid Fluctuation**: Background grid patterns that subtly animate
- **Particle Systems**: Floating digital particles in certain areas

```css
/* Example: Subtle Background Pulse */
@keyframes cyber-ambient-pulse {
  0%, 100% { background-position: 0% 50%; opacity: 0.3; }
  50% { background-position: 100% 50%; opacity: 0.5; }
}

.cyber-background {
  position: relative;
}

.cyber-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    rgba(var(--neon-purple-rgb), 0.05),
    rgba(var(--neon-blue-rgb), 0.05),
    rgba(var(--neon-purple-rgb), 0.05)
  );
  background-size: 200% 100%;
  animation: cyber-ambient-pulse 15s ease infinite;
  pointer-events: none;
  z-index: 0;
}
```

## Implementation Guidelines

### Performance Considerations

- Use hardware-accelerated properties (`transform`, `opacity`) instead of layout properties
- Implement animation throttling for low-power devices
- Test animations on various devices and connection speeds
- Use `will-change` property sparingly and only when needed

```css
/* Good practice */
.cyber-effect {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.cyber-effect:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* Avoid (causes layout shifts) */
.cyber-effect {
  transition: width 0.3s ease, height 0.3s ease;
}
.cyber-effect:hover {
  width: 105%;
  height: 105%;
}
```

### Accessibility Considerations

- All animations must respect the user's `prefers-reduced-motion` setting
- No animations should flash more than 3 times per second
- Critical information should never rely solely on animation
- Provide static alternatives for animated states

```css
/* Respecting reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .cyber-animation-decorative {
    display: none !important;
  }
}
```

## Animation Library Recommendations

For more complex animations, consider these libraries:

1. **Framer Motion**: For component and page transitions
2. **AutoAnimate**: For automatic list/element animations
3. **React Spring**: For physics-based animations
4. **GSAP**: For highly complex animation sequences

## Priority Implementation Order

1. Micro-interactions (highest impact, lowest effort)
2. State transitions (important for UX feedback)
3. Ambient effects (creates atmosphere)
4. Page transitions (feels polished but requires more work)

## Examples in Context

### Loading Button

```tsx
const CyberLoadingButton = ({ loading, children, ...props }) => (
  <Button 
    {...props}
    className={cn(
      props.className,
      loading && "cyber-loading relative overflow-hidden"
    )}
    disabled={loading || props.disabled}
  >
    {loading ? (
      <>
        <span className="opacity-0">{children}</span>
        <span className="absolute inset-0 flex items-center justify-center">
          Processing<span className="cyber-dots">...</span>
        </span>
      </>
    ) : children}
  </Button>
);
```

### Error Input Animation

```css
@keyframes cyber-error-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
  60% { transform: translateX(-1px); }
  80% { transform: translateX(1px); }
}

.cyber-input-error {
  animation: cyber-error-shake 0.4s;
  border-color: var(--destructive) !important;
  box-shadow: 0 0 8px rgba(var(--neon-red-rgb), 0.6) !important;
}
```