import React from 'react';
import { cn } from '../../utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Desktop-app style page container
 * No animations - instant switching for true native feel
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div
      className={cn(
        "w-full h-full",
        className
      )}
    >
      {children}
    </div>
  );
}