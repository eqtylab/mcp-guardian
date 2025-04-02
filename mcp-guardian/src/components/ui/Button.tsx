import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-colors-accent-primary",
  {
    variants: {
      variant: {
        primary: "bg-colors-accent-primary text-[hsla(220,18%,10%,0.9)] hover:bg-[color-mix(in_srgb,var(--colors-accent-primary),white_15%)]",
        secondary: "bg-transparent border border-colors-accent-primary text-colors-accent-primary hover:bg-[hsla(195,80%,50%,0.08)]",
        success: "bg-colors-status-success text-[hsla(220,18%,10%,0.9)] hover:bg-[color-mix(in_srgb,var(--colors-status-success),white_15%)]",
        danger: "bg-colors-status-danger text-white hover:bg-[color-mix(in_srgb,var(--colors-status-danger),white_15%)]",
      },
      size: {
        sm: "h-7 px-2 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button 
        className={cn(buttonVariants({ variant, size }), className)} 
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <span className="mr-2">Loading...</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };