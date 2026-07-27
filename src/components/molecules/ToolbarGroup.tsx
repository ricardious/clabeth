import type { ReactNode } from 'react';

export function ToolbarGroup({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-0.5">
      {children}
    </div>
  );
}
