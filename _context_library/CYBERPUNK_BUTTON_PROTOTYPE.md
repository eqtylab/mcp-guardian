# Cyberpunk Button Component Prototype

The button component will be our first implementation of the cyberpunk visual system, serving as a showcase for the new aesthetic while remaining functional and accessible.

## Design Concepts

The cyberpunk button will feature:
- Neon border glow effects that intensify on hover/focus
- Subtle background gradient with shimmering animation
- "Digital distortion" effect on click
- Variant options for different neon color schemes

## Implementation

```tsx
// cyber-button.tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const buttonVariants = cva(
  // Base styles for all cyberpunk buttons
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 
          "cyber-btn cyber-btn-primary bg-gradient-to-r from-primary/10 to-primary/5 text-primary-foreground border border-primary/30 shadow-[0_0_10px_rgba(var(--neon-purple-rgb),0.3)]",
        secondary: 
          "cyber-btn cyber-btn-secondary bg-gradient-to-r from-secondary/10 to-secondary/5 text-secondary-foreground border border-secondary/30 shadow-[0_0_10px_rgba(var(--neon-cyan-rgb),0.3)]",
        destructive: 
          "cyber-btn cyber-btn-destructive bg-gradient-to-r from-destructive/10 to-destructive/5 text-destructive-foreground border border-destructive/30 shadow-[0_0_10px_rgba(var(--neon-pink-rgb),0.3)]",
        ghost: 
          "cyber-btn cyber-btn-ghost hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Add keyframes for button animations in global CSS
const cssKeyframes = `
@keyframes cyber-btn-glow {
  0%, 100% { box-shadow: 0 0 5px var(--glow-color), 0 0 10px var(--glow-color-secondary, var(--glow-color)); }
  50% { box-shadow: 0 0 15px var(--glow-color), 0 0 20px var(--glow-color-secondary, var(--glow-color)); }
}

@keyframes cyber-btn-press {
  0% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(0.97); filter: brightness(1.2) hue-rotate(10deg); }
  100% { transform: scale(1); filter: brightness(1); }
}

@keyframes cyber-static {
  0% { opacity: 0; }
  50% { opacity: 0.3; }
  100% { opacity: 0; }
}

.cyber-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}

.cyber-btn:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}

.cyber-btn:hover {
  animation: cyber-btn-glow 2s infinite;
  border-color: var(--primary);
}

.cyber-btn:active:before {
  animation: cyber-static 0.2s;
}

.cyber-btn:active {
  animation: cyber-btn-press 0.2s;
}

.cyber-btn-primary {
  --glow-color: rgba(var(--neon-purple-rgb), 0.5);
  --glow-color-secondary: rgba(var(--neon-blue-rgb), 0.3);
}

.cyber-btn-secondary {
  --glow-color: rgba(var(--neon-cyan-rgb), 0.5);
  --glow-color-secondary: rgba(var(--neon-blue-rgb), 0.3);
}

.cyber-btn-destructive {
  --glow-color: rgba(var(--neon-pink-rgb), 0.5);
  --glow-color-secondary: rgba(var(--neon-red-rgb), 0.3);
}
`;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Add the CSS keyframes to the document once
    React.useEffect(() => {
      const styleId = "cyber-button-styles";
      if (!document.getElementById(styleId)) {
        const styleElement = document.createElement("style");
        styleElement.id = styleId;
        styleElement.textContent = cssKeyframes;
        document.head.appendChild(styleElement);
        
        return () => {
          document.head.removeChild(styleElement);
        };
      }
    }, []);

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "CyberButton";

export { Button, buttonVariants };
```

## CSS Variables to Add to App.css

```css
.dark {
  /* Existing variables */
  
  /* New neon colors for cyberpunk UI */
  --neon-purple-rgb: 124, 58, 237;
  --neon-blue-rgb: 37, 99, 235;
  --neon-cyan-rgb: 6, 182, 212;
  --neon-pink-rgb: 236, 72, 153;
  --neon-green-rgb: 16, 185, 129;
  --neon-red-rgb: 239, 68, 68;
  
  /* Convert HSL to RGB for shadow effects */
  --primary-rgb: var(--neon-purple-rgb);
  --secondary-rgb: var(--neon-cyan-rgb);
  --accent-rgb: var(--neon-pink-rgb);
}
```

## Usage Example

```tsx
// In a page component
import { Button } from "@/components/ui/cyber-button";

export default function CyberpunkDemo() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Cyberpunk Button Variants</h2>
      
      <div className="flex flex-wrap gap-4">
        <Button variant="default">Primary Action</Button>
        <Button variant="secondary">Secondary Action</Button>
        <Button variant="destructive">Danger Action</Button>
        <Button variant="ghost">Ghost Button</Button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Button size="sm">Small Button</Button>
        <Button size="default">Default Size</Button>
        <Button size="lg">Large Button</Button>
      </div>
    </div>
  );
}
```

## Design Considerations

1. **Accessibility**:
   - Maintain sufficient contrast for text legibility
   - Ensure animation can be disabled via reduced motion settings
   - Provide clear focus states that work with keyboard navigation

2. **Performance**:
   - Use hardware-accelerated properties for animations (transform, opacity)
   - Keep shadow effects reasonable to avoid rendering issues
   - Consider fallbacks for older browsers

3. **Customization**:
   - The neon colors can be easily adjusted through CSS variables
   - Animation timings and intensities can be tuned for preference
   - Effects scale appropriately with button size variants