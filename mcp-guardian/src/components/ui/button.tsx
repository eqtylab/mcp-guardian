import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-colors-accent-primary shadow-sm",
  {
    variants: {
      variant: {
        primary: "bg-colors-accent-primary text-[hsla(220,18%,10%,0.9)] hover:bg-[color-mix(in_srgb,var(--colors-accent-primary),white_15%)]",
        secondary: "bg-transparent border border-colors-accent-primary text-colors-accent-primary hover:bg-[hsla(195,80%,50%,0.08)]",
        success: "bg-[color-mix(in_srgb,var(--colors-status-success),black_10%)] text-[hsla(220,18%,10%,0.9)] hover:bg-[color-mix(in_srgb,var(--colors-status-success),white_15%)] border border-[rgba(0,0,0,0.1)]",
        danger: "bg-colors-status-danger text-white hover:bg-[color-mix(in_srgb,var(--colors-status-danger),white_15%)]",
        ghost: "bg-transparent hover:bg-colors-bg-interactive text-colors-text-primary",
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
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, asChild = false, children, ...props }, ref) => {
    const buttonClass = cn(buttonVariants({ variant, size }), className);
    
    // Simply return a button that can contain an anchor when asChild is true
    return (
      <button 
        className={buttonClass} 
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