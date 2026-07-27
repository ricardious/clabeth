import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'h-[var(--control-h-md)] w-full rounded-md border border-outline bg-surface px-3 text-sm text-foreground',
          'placeholder:text-muted',
          'focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-1',
          className,
        )}
        {...props}
      />
    );
  },
);
