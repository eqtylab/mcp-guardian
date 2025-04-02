import { forwardRef, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 cyber-btn cyber-btn-primary",
        secondary: "bg-transparent border border-primary text-primary hover:bg-primary/10 cyber-btn cyber-btn-secondary",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 cyber-btn cyber-btn-accent",
        success: "bg-[hsl(142,70%,45%)] text-white hover:bg-[hsl(142,70%,45%)]/90 border border-[rgba(0,0,0,0.1)] cyber-btn cyber-btn-success",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 cyber-btn cyber-btn-destructive",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 cyber-btn cyber-btn-destructive",
        ghost: "bg-transparent hover:bg-muted text-foreground cyber-btn cyber-btn-ghost",
        cyber: "bg-gradient-to-r from-primary/20 to-primary/5 text-primary-foreground border border-primary/30 cyber-btn cyber-btn-cyber",
      },
      size: {
        sm: "h-7 px-2 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-sm",
      },
      glow: {
        none: "",
        hover: "cyber-btn-glow-hover",
        always: "cyber-btn-glow",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      glow: "hover",
    },
  }
);

// CSS for cyberpunk button effects
const cyberpunkButtonStyles = `
.cyber-btn {
  position: relative;
  transition: all 0.2s ease;
  z-index: 1;
}

.cyber-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}

/* Remove digital static effect for a more professional look */
.cyber-btn:active {
  transform: translateY(1px); /* Subtle press effect instead */
}

.cyber-btn-glow:not(:disabled) {
  box-shadow: 0 0 8px var(--glow-color);
  border-color: var(--glow-color);
}

.cyber-btn-glow-hover:hover:not(:disabled) {
  box-shadow: 0 0 10px var(--glow-color);
  border-color: var(--glow-color);
  /* Remove the animation for a more professional look */
}

.cyber-btn-primary {
  --glow-color: rgba(var(--neon-purple-rgb), 0.5);
  --glow-color-secondary: rgba(var(--neon-blue-rgb), 0.3);
}

.cyber-btn-secondary {
  --glow-color: rgba(var(--neon-blue-rgb), 0.5);
  --glow-color-secondary: rgba(var(--neon-purple-rgb), 0.3);
}

.cyber-btn-accent {
  --glow-color: rgba(var(--neon-cyan-rgb), 0.5);
  --glow-color-secondary: rgba(var(--neon-blue-rgb), 0.3);
}

.cyber-btn-success {
  --glow-color: rgba(var(--neon-green-rgb), 0.5);
  --glow-color-secondary: rgba(var(--neon-blue-rgb), 0.3);
}

.cyber-btn-destructive, .cyber-btn-danger {
  --glow-color: rgba(var(--neon-pink-rgb), 0.5);
  --glow-color-secondary: rgba(236, 72, 153, 0.3);
}

.cyber-btn-cyber {
  --glow-color: rgba(var(--neon-purple-rgb), 0.7);
  --glow-color-secondary: rgba(var(--neon-cyan-rgb), 0.4);
  border-color: rgba(var(--neon-purple-rgb), 0.5);
}

/* Enhanced contrast for light mode */
:root:not(.dark) .cyber-btn {
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

:root:not(.dark) .cyber-btn-primary {
  --glow-color: rgba(var(--neon-purple-rgb), 0.3);
}

:root:not(.dark) .cyber-btn-secondary {
  --glow-color: rgba(var(--neon-blue-rgb), 0.3);
}

:root:not(.dark) .cyber-btn-cyber {
  color: var(--neon-purple);
  border-color: rgba(var(--neon-purple-rgb), 0.4);
  background: linear-gradient(to right, rgba(var(--neon-purple-rgb), 0.1), rgba(var(--neon-cyan-rgb), 0.05));
}

.cyber-btn-loader {
  position: relative;
  overflow: hidden;
}

.cyber-btn-loader::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(var(--neon-blue-rgb), 0.5), 
    transparent
  );
  animation: subtle-scan 1.5s linear infinite;
}
`;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glow, isLoading, asChild = false, children, ...props }, ref) => {
    // Add the cyberpunk styles to the document once
    useEffect(() => {
      const styleId = "cyber-button-styles";
      if (!document.getElementById(styleId)) {
        const styleElement = document.createElement("style");
        styleElement.id = styleId;
        styleElement.textContent = cyberpunkButtonStyles;
        document.head.appendChild(styleElement);
        
        return () => {
          const element = document.getElementById(styleId);
          if (element) {
            document.head.removeChild(element);
          }
        };
      }
    }, []);

    const buttonClass = cn(
      buttonVariants({ variant, size, glow }), 
      isLoading && "cyber-btn-loader",
      className
    );
    
    // Simply return a button that can contain an anchor when asChild is true
    return (
      <button 
        className={buttonClass} 
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <span className="mr-2 opacity-70">Processing</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };