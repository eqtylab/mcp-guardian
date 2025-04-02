import * as React from "react";
import { cn } from "../../utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
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
Textarea.displayName = "Textarea";

export { Textarea };