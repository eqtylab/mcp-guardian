import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../utils";
import { cva, type VariantProps } from "class-variance-authority";

const CyberDialog = DialogPrimitive.Root;
const CyberDialogTrigger = DialogPrimitive.Trigger;
const CyberDialogPortal = DialogPrimitive.Portal;

// Simple inline style component
const CyberDialogStyles = () => (
  <style>
    {`
    .cyber-dialog-overlay {
      backdrop-filter: blur(2px);
      background: rgba(0, 0, 0, 0.7);
      animation: cyber-dialog-overlay-in 0.15s ease-out forwards;
    }
    
    @keyframes cyber-dialog-overlay-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Remove animation for now to ensure proper centering */
    .cyber-dialog-content {
      opacity: 1;
    }
    
    .cyber-dialog-content::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(to right, 
        transparent, 
        rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.2), 
        transparent
      );
      z-index: 1;
    }
    
    .cyber-dialog-angular {
      border-radius: 0;
      mask-image: polygon(
        0 4px, 
        4px 0, 
        calc(100% - 4px) 0, 
        100% 4px, 
        100% calc(100% - 4px), 
        calc(100% - 4px) 100%, 
        4px 100%, 
        0 calc(100% - 4px)
      );
      -webkit-mask-image: polygon(
        0 4px, 
        4px 0, 
        calc(100% - 4px) 0, 
        100% 4px, 
        100% calc(100% - 4px), 
        calc(100% - 4px) 100%, 
        4px 100%, 
        0 calc(100% - 4px)
      );
    }
    
    .cyber-dialog-glow {
      box-shadow: 0 0 10px rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.15);
      border-color: rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.2);
    }
    
    .cyber-dialog-close {
      position: relative;
      transition: all 0.2s ease;
    }
    
    .cyber-dialog-close:hover {
      color: var(--primary);
    }
    
    .dark .cyber-dialog-close:hover {
      text-shadow: 0 0 4px rgba(var(--primary-rgb), 0.4);
    }
    
    /* Light mode adjustments */
    :root:not(.dark) .cyber-dialog-overlay {
      backdrop-filter: blur(1px);
      background: rgba(240, 240, 250, 0.4);
    }
    
    :root:not(.dark) .cyber-dialog-content {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }
    
    :root:not(.dark) .cyber-dialog-content::before {
      opacity: 0.3;
    }
    
    :root:not(.dark) .cyber-dialog-glow {
      box-shadow: 0 0 8px rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.1);
    }
    `}
  </style>
);

// Overlay variants
const overlayVariants = cva(
  "fixed inset-0 z-[999]",
  {
    variants: {
      variant: {
        default: "bg-black/50",
        cyber: "cyber-dialog-overlay",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const CyberDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & 
  VariantProps<typeof overlayVariants>
>(({ className, variant, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(overlayVariants({ variant }), className)}
    {...props}
  />
));
CyberDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Content variants - simplified for better positioning
const contentVariants = cva(
  "w-full max-w-lg max-h-[85vh] overflow-y-auto border shadow-md",
  {
    variants: {
      variant: {
        default: "bg-card rounded-md border-border",
        cyber: "cyber-dialog-content bg-card/90 backdrop-blur-md border-border/50",
        angular: "cyber-dialog-content cyber-dialog-angular bg-card/90 backdrop-blur-md border-border/50",
      },
      glow: {
        none: "",
        subtle: "cyber-dialog-glow",
      }
    },
    defaultVariants: {
      variant: "default",
      glow: "none",
    },
  }
);

const CyberDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof contentVariants>
>(({ className, children, variant, glow, ...props }, ref) => {
  return (
    <CyberDialogPortal>
      {/* Include styles inline */}
      <CyberDialogStyles />
      <CyberDialogOverlay variant={variant === "default" ? "default" : "cyber"} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000]",
          contentVariants({ variant, glow }),
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </CyberDialogPortal>
  );
});
CyberDialogContent.displayName = DialogPrimitive.Content.displayName;

// Header variants
const headerVariants = cva(
  "p-3 border-b flex justify-between items-center relative",
  {
    variants: {
      variant: {
        default: "bg-muted border-border",
        cyber: "bg-muted/80 border-border/50 backdrop-blur-sm",
      },
      glow: {
        none: "",
        subtle: "before:absolute before:left-0 before:right-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/30 before:to-transparent",
      }
    },
    defaultVariants: {
      variant: "default",
      glow: "none",
    },
  }
);

interface CyberDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement>, 
  VariantProps<typeof headerVariants> {}

const CyberDialogHeader = ({
  className,
  variant,
  glow,
  ...props
}: CyberDialogHeaderProps) => (
  <div
    className={cn(headerVariants({ variant, glow }), className)}
    {...props}
  />
);
CyberDialogHeader.displayName = "CyberDialogHeader";

// Title variants
const titleVariants = cva(
  "text-sm m-0 font-medium",
  {
    variants: {
      glow: {
        none: "",
        subtle: "cyber-text-glow",
      }
    },
    defaultVariants: {
      glow: "none",
    },
  }
);

interface CyberDialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>,
  VariantProps<typeof titleVariants> {}

const CyberDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  CyberDialogTitleProps
>(({ className, glow, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(titleVariants({ glow }), className)}
    {...props}
  />
));
CyberDialogTitle.displayName = DialogPrimitive.Title.displayName;

const CyberDialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> & {
    variant?: "default" | "cyber";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "p-1 bg-transparent border-0 text-foreground transition-colors",
      variant === "cyber" && "cyber-dialog-close text-foreground/80 hover:text-foreground",
      className
    )}
    {...props}
  >
    <X size={14} strokeWidth={2.5} />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
));
CyberDialogClose.displayName = DialogPrimitive.Close.displayName;

// Body variants
const bodyVariants = cva(
  "p-4 relative",
  {
    variants: {
      variant: {
        default: "bg-card",
        cyber: "bg-card/90 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CyberDialogBodyProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof bodyVariants> {}

const CyberDialogBody = ({
  className,
  variant,
  ...props
}: CyberDialogBodyProps) => (
  <div
    className={cn(bodyVariants({ variant }), className)}
    {...props}
  />
);
CyberDialogBody.displayName = "CyberDialogBody";

// Footer variants
const footerVariants = cva(
  "flex justify-end gap-2 px-4 py-3 border-t relative",
  {
    variants: {
      variant: {
        default: "bg-muted border-border",
        cyber: "bg-muted/90 border-border/50 backdrop-blur-sm",
      },
      glow: {
        none: "",
        subtle: "before:absolute before:left-0 before:right-0 before:bottom-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-primary/30 before:to-transparent",
      }
    },
    defaultVariants: {
      variant: "default",
      glow: "none",
    },
  }
);

interface CyberDialogFooterProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof footerVariants> {}

const CyberDialogFooter = ({
  className,
  variant,
  glow,
  ...props
}: CyberDialogFooterProps) => (
  <div
    className={cn(footerVariants({ variant, glow }), className)}
    {...props}
  />
);
CyberDialogFooter.displayName = "CyberDialogFooter";

export {
  CyberDialog,
  CyberDialogTrigger,
  CyberDialogContent,
  CyberDialogHeader,
  CyberDialogTitle,
  CyberDialogClose,
  CyberDialogBody,
  CyberDialogFooter,
};