import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between px-4 py-2 font-medium",
      "bg-colors-bg-elevated text-colors-text-primary",
      "border-b border-colors-border-subtle",
      "transition-all hover:bg-colors-bg-interactive",
      "focus:outline-none focus:ring-2 focus:ring-colors-accent-primary focus:ring-inset",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown
      className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180"
    />
  </CollapsiblePrimitive.Trigger>
));
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
      "overflow-hidden bg-colors-bg-surface p-4 text-colors-text-primary",
      className
    )}
    {...props}
  >
    <div className="p-1">{children}</div>
  </CollapsiblePrimitive.Content>
));
CollapsibleContent.displayName = CollapsiblePrimitive.Content.displayName;

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
};