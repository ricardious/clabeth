import type { ReactNode } from 'react';
import { cn } from '../../lib/utils/cn';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

export interface TabsProps<T extends string> {
  items: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  className?: string;
}

export function Tabs<T extends string>({ items, active, onChange, ariaLabel, className }: TabsProps<T>) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={cn('flex gap-1', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={active === item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium',
            'transition-colors duration-[var(--dur-fast)]',
            active === item.id
              ? 'bg-primary-soft text-primary'
              : 'text-muted hover:bg-panel hover:text-foreground',
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
