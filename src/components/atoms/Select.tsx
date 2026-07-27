import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils/cn';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          'h-[var(--control-h-md)] w-full rounded-md border border-outline bg-surface px-2.5 text-sm text-foreground',
          'focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-1',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
