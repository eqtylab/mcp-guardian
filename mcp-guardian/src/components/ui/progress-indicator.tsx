import * as React from "react";
import { cn } from "../../utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    indeterminate = false,
    size = "md",
    variant = "primary",
    ...props 
  }, ref) => {
    // Calculate percentage, ensuring it's between 0-100
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
    
    const sizeStyles = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    };
    
    const variantStyles = {
      default: "bg-colors-bg-interactive",
      primary: "bg-colors-accent-primary",
      success: "bg-colors-status-success",
      warning: "bg-colors-status-warning",
      danger: "bg-colors-status-danger",
    };

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        className={cn(
          "w-full overflow-hidden rounded-full bg-colors-bg-elevated",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full flex-1 transition-all",
            sizeStyles[size],
            variantStyles[variant],
            indeterminate && "animate-progress-indeterminate w-1/3",
          )}
          style={{
            width: indeterminate ? undefined : `${percentage}%`
          }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

// Define animate-progress-indeterminate
// Add this to your CSS or use TailwindCSS to define the animation
// @keyframes progress-indeterminate {
//   0% { left: -50%; }
//   100% { left: 100%; }
// }

// Circular progress indicator (spinner)
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", variant = "primary", ...props }, ref) => {
    const sizeStyles = {
      sm: "h-4 w-4 border-2",
      md: "h-6 w-6 border-2",
      lg: "h-8 w-8 border-3",
    };
    
    const variantStyles = {
      default: "border-colors-bg-interactive",
      primary: "border-colors-accent-primary",
      success: "border-colors-status-success",
      warning: "border-colors-status-warning",
      danger: "border-colors-status-danger",
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-solid border-t-transparent",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Spinner.displayName = "Spinner";

export { Progress, Spinner };