import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-transparent border border-primary text-primary hover:bg-primary/10",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        success: "bg-[hsl(142,70%,45%)] text-white hover:bg-[hsl(142,70%,45%)]/90 border border-[rgba(0,0,0,0.1)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "bg-transparent hover:bg-muted text-foreground",
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