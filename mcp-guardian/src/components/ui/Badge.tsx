import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-colors-bg-elevated text-colors-text-secondary",
        primary: "bg-[hsla(195,80%,50%,0.15)] text-colors-accent-primary",
        success: "bg-[hsla(142,70%,45%,0.15)] text-colors-status-success",
        warning: "bg-[hsla(45,90%,55%,0.15)] text-colors-status-warning",
        danger: "bg-[hsla(358,75%,55%,0.15)] text-colors-status-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };