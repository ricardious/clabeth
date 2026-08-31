import { resolveThemeMode, type ThemeMode } from './types/theme';

/**
 * Acceso al tema guardado desde las páginas Astro, que no cargan el store de
 * Zustand. Escribe con el mismo formato que `persist`, de modo que las islas
 * React y las páginas estáticas comparten una única preferencia.
 */
export const SETTINGS_KEY = 'clabeth.settings.v1';
export const SETTINGS_VERSION = 2;

interface PersistedSettings {
  state?: Record<string, unknown>;
  version?: number;
}

function readPersisted(): PersistedSettings {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as PersistedSettings;
  } catch {
    return {};
  }
}

export function readStoredTheme(): ThemeMode {
  return resolveThemeMode(readPersisted().state?.theme);
}

export function writeStoredTheme(theme: ThemeMode): void {
  const stored = readPersisted();
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify({
      ...stored,
      state: { ...stored.state, theme },
      version: SETTINGS_VERSION,
    }),
  );
}
