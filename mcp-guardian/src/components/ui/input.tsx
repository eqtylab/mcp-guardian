import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

// Input variant styles
const inputVariants = cva(
  "w-full bg-card border rounded-sm p-2 text-foreground focus:outline-none focus:ring-1 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border focus:border-primary focus:ring-primary",
        cyber: "cyber-input border-border focus:border-primary focus:ring-primary",
        angular: "cyber-input cyber-input-angular border-border focus:border-primary focus:ring-primary",
      },
      state: {
        default: "",
        error: "border-destructive focus:border-destructive focus:ring-destructive",
      },
      glow: {
        none: "",
        focus: "cyber-input-glow-focus",
        always: "cyber-input-glow",
      }
    },
    defaultVariants: {
      variant: "default",
      state: "default",
      glow: "none",
    },
  }
);

// CSS for cyberpunk input styles
const cyberInputStyles = `
.cyber-input {
  position: relative;
  background-color: rgba(var(--background), 0.7);
  backdrop-filter: blur(4px);
}

.cyber-input-angular {
  border-radius: 0;
  position: relative;
}

.cyber-input-angular::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 6px;
  background-image: linear-gradient(135deg, transparent 50%, rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.5) 50%);
  opacity: 0.7;
  pointer-events: none;
}

.cyber-input-glow {
  box-shadow: 0 0 5px rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.3);
  border-color: rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.4);
}

.cyber-input-glow-focus:focus {
  box-shadow: 0 0 8px rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.4);
  border-color: rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.5);
}

/* Error state */
.cyber-input.state-error {
  box-shadow: 0 0 5px rgba(var(--destructive-rgb, 236, 72, 153), 0.3);
}

/* Light mode adjustments */
:root:not(.dark) .cyber-input {
  background-color: rgba(255, 255, 255, 0.9);
}

:root:not(.dark) .cyber-input-glow, 
:root:not(.dark) .cyber-input-glow-focus:focus {
  box-shadow: 0 0 5px rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.2);
}
`;

export interface InputProps 
  extends React.InputHTMLAttributes<HTMLInputElement>, 
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, variant, glow, state, ...props }, ref) => {
    // Add cyberpunk styles once
    React.useEffect(() => {
      const styleId = "cyber-input-styles";
      if (!document.getElementById(styleId)) {
        const styleElement = document.createElement("style");
        styleElement.id = styleId;
        styleElement.textContent = cyberInputStyles;
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
      <input
        className={cn(
          inputVariants({ 
            variant, 
            glow,
            state: error ? "error" : state,
          }),
          error && "state-error",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };