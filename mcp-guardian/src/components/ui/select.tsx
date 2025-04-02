import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../utils";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

// CSS for cyberpunk select styling
const cyberSelectStyles = `
.cyber-select-trigger {
  position: relative;
  background-color: rgba(var(--background), 0.7);
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.cyber-select-angular {
  border-radius: 0;
  position: relative;
}

.cyber-select-angular::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 6px;
  background-image: linear-gradient(135deg, transparent 50%, rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.5) 50%);
  opacity: 0.7;
  pointer-events: none;
}

.cyber-select-glow {
  box-shadow: 0 0 5px rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.3);
  border-color: rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.4);
}

.cyber-select-glow-focus:focus-within {
  box-shadow: 0 0 8px rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.4);
  border-color: rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.5);
}

.cyber-select-content {
  background-color: rgba(var(--card), 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.2);
}

/* Light mode adjustments */
:root:not(.dark) .cyber-select-trigger {
  background-color: rgba(255, 255, 255, 0.9);
}

:root:not(.dark) .cyber-select-glow, 
:root:not(.dark) .cyber-select-glow-focus:focus-within {
  box-shadow: 0 0 5px rgba(var(--primary-rgb, var(--neon-purple-rgb)), 0.2);
}

.cyber-select-icon {
  transition: transform 0.2s ease;
}

.cyber-select-trigger[data-state="open"] .cyber-select-icon {
  transform: rotate(180deg);
}
`;

// Initialize styles
React.useEffect(() => {
  const styleId = "cyber-select-styles";
  if (!document.getElementById(styleId) && typeof document !== 'undefined') {
    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = cyberSelectStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        document.head.removeChild(element);
      }
    };
  }
}, []);

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    error?: boolean;
    variant?: "default" | "cyber" | "angular";
    glow?: "none" | "focus" | "always";
  }
>(({ className, error, variant = "default", glow = "none", children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between border px-3 py-2 text-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
      variant === "default" && "rounded-sm bg-card text-foreground",
      variant === "cyber" && "cyber-select-trigger border-border focus:border-primary focus:ring-primary",
      variant === "angular" && "cyber-select-trigger cyber-select-angular border-border focus:border-primary focus:ring-primary",
      glow === "focus" && "cyber-select-glow-focus",
      glow === "always" && "cyber-select-glow",
      error
        ? "border-destructive focus:border-destructive focus:ring-destructive"
        : "border-border focus:border-primary focus:ring-primary",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50 cyber-select-icon" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    variant?: "default" | "cyber" | "angular";
  }
>(({ className, children, position = "popper", variant = "default", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden border shadow-md",
        variant === "default" && "rounded-md",
        variant === "cyber" && "cyber-select-content rounded-md",
        variant === "angular" && "cyber-select-content border-radius-0",
        "border-border bg-card text-foreground",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        variant !== "default" && "cyber-select-content backdrop-blur-md",
        className
      )}
      position={position}
      {...props}
    >
      <div className={cn(variant === "angular" && "relative overflow-hidden")}>
        {variant === "angular" && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-transparent to-primary/10"></div>
        )}
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </div>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 px-2 text-sm font-semibold text-colors-text-secondary", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    variant?: "default" | "cyber";
  }
>(({ className, children, variant = "default", ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors duration-150",
      variant === "default" && "focus:bg-muted hover:bg-muted",
      variant === "cyber" && "focus:bg-primary/10 hover:bg-primary/5 data-[highlighted]:bg-primary/10",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className={cn(
          "h-4 w-4", 
          variant === "default" ? "text-primary" : "text-primary text-glow"
        )} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText className="pl-6">{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-colors-border-subtle", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};