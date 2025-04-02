import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { cn } from "../../utils";

const alertVariants = cva(
  "relative w-full rounded-md border p-3 flex items-start gap-3 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-3 [&>svg]:top-3",
  {
    variants: {
      variant: {
        default: "bg-colors-bg-surface border-colors-border-subtle",
        info: "bg-[hsla(210,80%,60%,0.1)] border-colors-status-info text-colors-status-info [&>svg]:text-colors-status-info",
        success: "bg-[hsla(142,70%,45%,0.1)] border-colors-status-success text-colors-status-success [&>svg]:text-colors-status-success",
        warning: "bg-[hsla(45,90%,55%,0.1)] border-colors-status-warning text-colors-status-warning [&>svg]:text-colors-status-warning",
        danger: "bg-[hsla(358,75%,55%,0.1)] border-colors-status-danger text-colors-status-danger [&>svg]:text-colors-status-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & {
      onClose?: () => void;
    }
>(({ className, variant, children, onClose, ...props }, ref) => {
  const IconComponent = variant === 'info' 
    ? Info 
    : variant === 'success' 
    ? CheckCircle 
    : variant === 'danger' 
    ? AlertCircle 
    : null;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {IconComponent && <IconComponent className="h-4 w-4" />}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-auto -mr-1 h-4 w-4 text-colors-text-tertiary hover:text-colors-text-primary"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };