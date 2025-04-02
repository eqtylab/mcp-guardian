import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

// Textarea variant styles
const textareaVariants = cva(
  "w-full bg-card border rounded-sm p-2 text-foreground focus:outline-none focus:ring-1 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border focus:border-primary focus:ring-primary",
        cyber: "cyber-textarea border-border focus:border-primary focus:ring-primary",
        angular: "cyber-textarea cyber-textarea-angular border-border focus:border-primary focus:ring-primary",
      },
      state: {
        default: "",
        error: "border-destructive focus:border-destructive focus:ring-destructive",
      },
      glow: {
        none: "",
        focus: "cyber-textarea-glow-focus",
        always: "cyber-textarea-glow",
      }
    },
    defaultVariants: {
      variant: "default",
      state: "default",
      glow: "none",
    },
  }
);

// CSS for cyberpunk textarea styles - reuses most of the Input styling
const cyberTextareaStyles = `
.cyber-textarea {
  position: relative;
  background-color: rgba(var(--background), 0.7);
  backdrop-filter: blur(4px);
}

.cyber-textarea-angular {
  border-radius: 0;
  position: relative;
}

.cyber-textarea-angular::after {
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

.cyber-textarea-glow {
  box-shadow: 0 0 5px rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.3);
  border-color: rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.4);
}

.cyber-textarea-glow-focus:focus {
  box-shadow: 0 0 8px rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.4);
  border-color: rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.5);
}

/* Error state */
.cyber-textarea.state-error {
  box-shadow: 0 0 5px rgba(var(--destructive-rgb, 236, 72, 153), 0.3);
}

/* Light mode adjustments */
:root:not(.dark) .cyber-textarea {
  background-color: rgba(255, 255, 255, 0.9);
}

:root:not(.dark) .cyber-textarea-glow, 
:root:not(.dark) .cyber-textarea-glow-focus:focus {
  box-shadow: 0 0 5px rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.2);
}
`;

export interface TextareaProps 
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, 
    VariantProps<typeof textareaVariants> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, variant, glow, state, ...props }, ref) => {
    // Add cyberpunk styles once
    React.useEffect(() => {
      const styleId = "cyber-textarea-styles";
      if (!document.getElementById(styleId)) {
        const styleElement = document.createElement("style");
        styleElement.id = styleId;
        styleElement.textContent = cyberTextareaStyles;
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
      <textarea
        className={cn(
          textareaVariants({ 
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
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };