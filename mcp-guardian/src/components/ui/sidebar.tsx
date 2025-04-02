import React from 'react';
import { cn } from '../../utils';
import { Badge } from './badge';

interface SidebarProps {
  className?: string;
  children: React.ReactNode;
}

export function Sidebar({ className, children }: SidebarProps) {
  return (
    <div className={cn('w-64 border-r border-border h-full overflow-y-auto bg-card flex flex-col', className)}>
      {children}
    </div>
  );
}

interface SidebarSectionProps {
  title: string;
  count?: number;
  children: React.ReactNode;
}

export function SidebarSection({ title, count, children }: SidebarSectionProps) {
  return (
    <div className="py-2 px-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
        {count !== undefined && (
          <Badge variant="outline" className="text-xs">
            {count}
          </Badge>
        )}
      </div>
      {children}
    </div>
  );
}

interface SidebarItemProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export function SidebarItem({ active, children, onClick }: SidebarItemProps) {
  return (
    <div
      className={cn(
        'px-2 py-1.5 text-sm rounded-md cursor-pointer flex items-center',
        active
          ? 'bg-accent text-accent-foreground font-medium'
          : 'text-foreground hover:bg-accent/50 hover:text-accent-foreground'
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 border-b border-border">
      {children}
    </div>
  );
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto p-3 border-t border-border">
      {children}
    </div>
  );
}
