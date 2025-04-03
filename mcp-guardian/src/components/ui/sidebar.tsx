import React, { useState } from 'react';
import { cn } from '../../utils';
import { Badge } from './badge';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';

interface SidebarProps {
  className?: string;
  children: React.ReactNode;
}

export function Sidebar({ className, children }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="h-full relative">
      {/* Main sidebar content */}
      <div 
        className={cn(
          'border-r border-border h-full bg-card flex flex-col transition-all duration-300 ease-in-out overflow-hidden absolute left-0 top-0', 
          collapsed ? 'w-12' : 'w-64',
          className
        )}
      >
        {collapsed ? (
          // Collapsed view - show only minimal interface
          <div className="flex flex-col h-full">
            <div className="p-2 border-b border-border flex justify-center">
              <Shield size={20} className="text-primary" />
            </div>
            <div className="flex-1"></div>
          </div>
        ) : (
          // Expanded view - show full content
          <>{children}</>
        )}
      </div>
      
      {/* Toggle button - positioned outside the sidebar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute top-2 h-10 w-6 z-20 bg-primary text-primary-foreground rounded-r-md flex items-center justify-center hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30",
          collapsed ? "left-12" : "left-64"
        )}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>
      
      {/* Spacer div to create room for content based on sidebar width */}
      <div className={cn(
        "transition-all duration-300 ease-in-out inline-block h-full",
        collapsed ? "w-12" : "w-64"
      )}></div>
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
