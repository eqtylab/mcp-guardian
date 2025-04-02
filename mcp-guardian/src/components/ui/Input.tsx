import * as React from "react";
import { cn } from "../../utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          "w-full bg-colors-bg-elevated border rounded-sm p-2 text-colors-text-primary focus:outline-none focus:ring-1",
          error
            ? "border-colors-status-danger focus:border-colors-status-danger focus:ring-colors-status-danger"
            : "border-colors-border-subtle focus:border-colors-accent-primary focus:ring-colors-accent-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };