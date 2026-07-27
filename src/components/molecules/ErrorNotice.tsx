import { CloudAlert } from 'lucide-react';
import type { ReactNode } from 'react';

export function ErrorNotice({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklch,var(--error)_35%,transparent)] bg-[color-mix(in_oklch,var(--error)_8%,transparent)] px-3 py-2 text-sm text-error"
    >
      <CloudAlert size={16} aria-hidden className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
