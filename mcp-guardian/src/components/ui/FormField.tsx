import * as React from "react";
import { cn } from "../../utils";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, children, error, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {children}
        {error && <p className="text-colors-status-danger text-xs">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("block text-sm font-medium text-colors-text-secondary", className)}
        {...props}
      >
        {children}
        {required && <span className="text-colors-status-danger ml-1">*</span>}
      </label>
    );
  }
);

FormLabel.displayName = "FormLabel";

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-colors-text-tertiary text-xs", className)}
        {...props}
      />
    );
  }
);

FormDescription.displayName = "FormDescription";

export { FormField, FormLabel, FormDescription };