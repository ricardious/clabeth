import { useEffect } from 'react';
import { useSettingsStore } from '../store/settings';

/**
 * Aplica el tema al documento:
 * - light/dark → data-theme explícito
 * - system → sin atributo, manda prefers-color-scheme
 */
export function useTheme(): void {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);
}
