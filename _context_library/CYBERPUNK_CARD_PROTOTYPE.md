# Cyberpunk Card Component Prototype

The cyberpunk card component will be a key element in our visual system, serving as containers for content with a futuristic, high-tech aesthetic.

## Design Concepts

The cyberpunk card will feature:
- Subtle cyberpunk grid background pattern
- Glowing neon border effects that activate on hover
- Gradient background with semi-transparent overlay
- Optional "digital" corner accents
- Angular clip-path for non-rectangular shape options

## Implementation

```tsx
// cyber-card.tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

const cardVariants = cva(
  // Base styles for all cyberpunk cards
  "cyber-card relative rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: 
          "border-border/40 bg-gradient-to-b from-muted/30 to-transparent backdrop-blur-sm",
        primary: 
          "border-primary/30 bg-gradient-to-b from-primary/10 to-transparent shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]",
        secondary: 
          "border-secondary/30 bg-gradient-to-b from-secondary/10 to-transparent shadow-[0_0_20px_rgba(var(--secondary-rgb),0.1)]",
        outline: 
          "border-border/60 backdrop-blur-sm bg-background/50",
        angular: 
          "cyber-card-angular border-primary/30 bg-gradient-to-b from-primary/10 to-transparent shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]",
      },
      grid: {
        none: "",
        subtle: "cyber-card-grid-subtle",
        visible: "cyber-card-grid",
      },
      glow: {
        none: "",
        hover: "cyber-card-glow-hover",
        always: "cyber-card-glow",
      }
    },
    defaultVariants: {
      variant: "default",
      grid: "subtle",
      glow: "hover",
    },
  }
);

// Add keyframes and styles for card animations in global CSS
const cssStyles = `
.cyber-card {
  transition: all 0.3s ease, box-shadow 0.5s ease;
  position: relative;
}

.cyber-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.05;
}

.cyber-card-grid::before, 
.cyber-card-grid-subtle::before {
  background-image: 
    linear-gradient(to right, var(--grid-color, rgba(var(--primary-rgb), 0.5)) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-color, rgba(var(--primary-rgb), 0.5)) 1px, transparent 1px);
  background-size: 20px 20px;
}

.cyber-card-grid::before {
  opacity: 0.1;
}

.cyber-card-grid-subtle::before {
  opacity: 0.03;
}

.cyber-card-angular {
  clip-path: polygon(
    0 10px, 
    10px 0, 
    calc(100% - 10px) 0, 
    100% 10px, 
    100% calc(100% - 10px), 
    calc(100% - 10px) 100%, 
    10px 100%, 
    0 calc(100% - 10px)
  );
}

.cyber-card-glow {
  box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.3), inset 0 0 5px rgba(var(--primary-rgb), 0.1);
  border-color: rgba(var(--primary-rgb), 0.5);
}

.cyber-card-glow-hover:hover {
  box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4), inset 0 0 5px rgba(var(--primary-rgb), 0.2);
  border-color: rgba(var(--primary-rgb), 0.6);
}

/* Digital corner accent for cards */
.cyber-card-corner::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background-image: linear-gradient(135deg, transparent 50%, rgba(var(--primary-rgb), 0.8) 50%);
  opacity: 0.7;
}
`;

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, grid, glow, ...props }, ref) => {
  // Add the CSS styles to the document once
  React.useEffect(() => {
    const styleId = "cyber-card-styles";
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.textContent = cssStyles;
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, []);

  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, grid, glow, className }))}
      {...props}
    />
  );
});
Card.displayName = "CyberCard";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 relative z-10", className)}
    {...props}
  />
));
CardHeader.displayName = "CyberCardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight cyber-text-glow",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CyberCardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground relative z-10", className)}
    {...props}
  />
));
CardDescription.displayName = "CyberCardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 relative z-10", className)} {...props} />
));
CardContent.displayName = "CyberCardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 relative z-10", className)}
    {...props}
  />
));
CardFooter.displayName = "CyberCardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
```

## CSS Variables to Add to App.css

```css
:root {
  /* Existing variables */
  
  /* Grid background settings */
  --grid-color-light: rgba(99, 102, 241, 0.2);
  --grid-color-dark: rgba(124, 58, 237, 0.3);
  
  /* Glow text effect for cards */
  --text-glow-color-light: rgba(99, 102, 241, 0.4);
  --text-glow-color-dark: rgba(124, 58, 237, 0.5);
}

.dark {
  --grid-color: var(--grid-color-dark);
  --text-glow-color: var(--text-glow-color-dark);
}

.light {
  --grid-color: var(--grid-color-light);
  --text-glow-color: var(--text-glow-color-light);
}

.cyber-text-glow {
  text-shadow: 0 0 8px var(--text-glow-color);
}
```

## Usage Example

```tsx
// In a page component
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/cyber-card";
import { Button } from "@/components/ui/cyber-button";

export default function CyberpunkCardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Standard Card */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Card</CardTitle>
          <CardDescription>With subtle grid background</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card uses the default styling with a subtle grid pattern.</p>
        </CardContent>
        <CardFooter>
          <Button variant="default" size="sm">Action Button</Button>
        </CardFooter>
      </Card>
      
      {/* Primary Card with visible grid */}
      <Card variant="primary" grid="visible">
        <CardHeader>
          <CardTitle>Primary Card</CardTitle>
          <CardDescription>With visible grid lines</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card uses the primary styling with more visible grid pattern.</p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" size="sm">Action Button</Button>
        </CardFooter>
      </Card>
      
      {/* Angular Card */}
      <Card variant="angular" glow="always" className="cyber-card-corner">
        <CardHeader>
          <CardTitle>Angular Card</CardTitle>
          <CardDescription>With corner accent and permanent glow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card uses an angular clip-path with permanent glow effect.</p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" size="sm">Action Button</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

## Design Considerations

1. **Accessibility**:
   - Ensure content remains readable despite background patterns
   - Maintain sufficient contrast with text elements
   - Angular variants should not cut off content in a confusing way

2. **Performance**:
   - Use CSS generated patterns instead of image assets where possible
   - Optimize animations and transitions for performance
   - Consider using `will-change` for hardware acceleration on hover effects

3. **Customization**:
   - All effects can be toggled independently (grid, glow, shape)
   - Color schemes follow the theme's primary/secondary colors
   - Effects scale appropriately with card content