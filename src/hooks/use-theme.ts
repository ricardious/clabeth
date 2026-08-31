import { useEffect } from 'react';
import { useSettingsStore } from '../lib/store/settings';

/**
 * Aplica el tema al documento. La preferencia es siempre explícita
 * (claro u oscuro), así que `data-theme` está presente en todo momento y los
 * tokens no dependen de `prefers-color-scheme`.
 */
export function useTheme(): void {
  const theme = useSettingsStore((state) => state.theme);

  useEffect(() => {
    window.document.documentElement.dataset.theme = theme;
  }, [theme]);
}
