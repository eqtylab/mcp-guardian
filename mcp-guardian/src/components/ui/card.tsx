import * as React from "react";
import { cn } from "../../utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "bg-card rounded-md border border-border overflow-hidden relative",
  {
    variants: {
      variant: {
        default: "",
        cyber: "cyber-card",
        elevated: "cyber-card cyber-card-elevated",
        angular: "cyber-card cyber-card-angular",
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
      grid: "none",
      glow: "none",
    },
  }
);

// CSS for cyberpunk card effects
const cyberpunkCardStyles = `
.cyber-card {
  position: relative;
  transition: all 0.3s ease, box-shadow 0.5s ease;
  z-index: 1;
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
  background-size: 20px 20px;
}

.cyber-card-grid::before, 
.cyber-card-grid-subtle::before {
  background-image: 
    linear-gradient(to right, var(--grid-color, rgba(var(--neon-purple-rgb), 0.5)) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-color, rgba(var(--neon-purple-rgb), 0.5)) 1px, transparent 1px);
}

.cyber-card-grid::before {
  opacity: 0.1;
}

.cyber-card-grid-subtle::before {
  opacity: 0.03;
}

.cyber-card-elevated {
  background: linear-gradient(135deg, rgba(20, 20, 40, 0.9), rgba(10, 10, 20, 0.95));
  backdrop-filter: blur(var(--cosmic-blur));
}

.cyber-card-angular {
  /* Use a more subtle angular shape with smaller cuts */
  border-radius: 0; /* Reset border radius */
  mask-image: polygon(
    0 4px, 
    4px 0, 
    calc(100% - 4px) 0, 
    100% 4px, 
    100% calc(100% - 4px), 
    calc(100% - 4px) 100%, 
    4px 100%, 
    0 calc(100% - 4px)
  );
  -webkit-mask-image: polygon(
    0 4px, 
    4px 0, 
    calc(100% - 4px) 0, 
    100% 4px, 
    100% calc(100% - 4px), 
    calc(100% - 4px) 100%, 
    4px 100%, 
    0 calc(100% - 4px)
  );
}

.cyber-card-glow {
  box-shadow: 0 0 10px rgba(var(--neon-purple-rgb), 0.2), inset 0 0 3px rgba(var(--neon-purple-rgb), 0.05);
  border-color: rgba(var(--neon-purple-rgb), 0.3);
}

.cyber-card-glow-hover:hover {
  box-shadow: 0 0 15px rgba(var(--neon-purple-rgb), 0.25), inset 0 0 3px rgba(var(--neon-purple-rgb), 0.1);
  border-color: rgba(var(--neon-purple-rgb), 0.4);
}

.cyber-card-corner::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-image: linear-gradient(135deg, transparent 50%, rgba(var(--neon-purple-rgb), 0.6) 50%);
  opacity: 0.5;
  z-index: 1;
}

/* Light mode adjustments */
:root:not(.dark) .cyber-card {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(var(--cosmic-blur)) saturate(1.2);
}

:root:not(.dark) .cyber-card-elevated {
  background: linear-gradient(135deg, rgba(240, 240, 255, 0.9), rgba(250, 250, 255, 0.95));
}

:root:not(.dark) .cyber-card-glow {
  box-shadow: 0 0 15px rgba(var(--neon-purple-rgb), 0.2), inset 0 0 5px rgba(var(--neon-purple-rgb), 0.05);
  border-color: rgba(var(--neon-purple-rgb), 0.3);
}

:root:not(.dark) .cyber-card-glow-hover:hover {
  box-shadow: 0 0 20px rgba(var(--neon-purple-rgb), 0.3), inset 0 0 5px rgba(var(--neon-purple-rgb), 0.1);
  border-color: rgba(var(--neon-purple-rgb), 0.4);
}

:root:not(.dark) .cyber-title.glow {
  text-shadow: 0 0 5px var(--text-glow-color);
}

.cyber-title {
  position: relative;
  z-index: 1;
}

.cyber-title.glow {
  text-shadow: 0 0 8px var(--text-glow-color);
}
`;

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  withCorner?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, grid, glow, withCorner, ...props }, ref) => {
    // Add the cyberpunk styles to the document once
    React.useEffect(() => {
      const styleId = "cyber-card-styles";
      if (!document.getElementById(styleId)) {
        const styleElement = document.createElement("style");
        styleElement.id = styleId;
        styleElement.textContent = cyberpunkCardStyles;
        document.head.appendChild(styleElement);
        
        return () => {
          const element = document.getElementById(styleId);
          if (element) {
            document.head.removeChild(element);
          }
        };
      }
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, grid, glow }),
          withCorner && "cyber-card-corner",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  glowTitle?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, glowTitle, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-3 bg-muted border-b border-border flex justify-between items-center relative z-10",
        className
      )}
      data-glow-title={glowTitle ? "true" : "false"}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  glow?: boolean;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, glow, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-sm m-0 font-medium cyber-title", 
        glow && "glow",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-4 relative z-10", className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-3 border-t border-border bg-muted relative z-10",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardContent, CardFooter, cardVariants };