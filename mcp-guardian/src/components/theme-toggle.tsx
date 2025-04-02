import { Moon, Sun, Computer } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Computer },
  ];

  // Get the current icon based on theme
  const currentIcon = themeOptions.find(option => option.value === theme)?.icon || Sun;
  const CurrentIcon = currentIcon;

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        title="Change theme"
        className="w-9 p-0"
      >
        <CurrentIcon size={18} />
      </Button>

      {open && (
        <div className="absolute right-0 mt-1 w-36 rounded-md border border-border bg-card shadow-md z-50">
          <div className="p-1">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                    theme === option.value 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => {
                    setTheme(option.value as any);
                    setOpen(false);
                  }}
                >
                  <Icon size={16} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}