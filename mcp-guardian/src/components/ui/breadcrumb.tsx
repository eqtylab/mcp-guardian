import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../utils";

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, separator = <ChevronRight className="h-4 w-4" />, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("flex flex-wrap items-center", className)}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;

          return (
            <li className="flex items-center gap-1.5">
              {child}
              {index < React.Children.count(children) - 1 && <span className="text-colors-text-tertiary">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  )
);
Breadcrumb.displayName = "Breadcrumb";

interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  current?: boolean;
}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, current, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("flex items-center gap-1.5", className)}
      aria-current={current ? "page" : undefined}
      {...props}
    />
  )
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithRef<"a"> & { current?: boolean }
>(({ className, current, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "text-sm font-medium hover:underline",
      current
        ? "text-colors-text-primary cursor-default pointer-events-none"
        : "text-colors-text-secondary",
      className
    )}
    aria-current={current ? "page" : undefined}
    {...props}
  />
));
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbSeparator = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("text-colors-text-tertiary", className)}
    {...props}
  >
    {children || <ChevronRight className="h-4 w-4" />}
  </span>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
};