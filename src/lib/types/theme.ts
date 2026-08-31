/**
 * Preferencia visual persistida en el navegador.
 *
 * La elección es siempre explícita: no hay modo «sistema». Al no depender de
 * `prefers-color-scheme`, el tema no cambia solo a mitad de una sesión de
 * escritura y los tokens viven en un único bloque `[data-theme='dark']`.
 */
export type ThemeMode = 'light' | 'dark';

export const THEME_MODES: readonly ThemeMode[] = ['light', 'dark'];

export const isThemeMode = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark';

/**
 * Normaliza cualquier valor guardado a un tema válido. Los documentos que
 * quedaron en «sistema» adoptan lo que el sistema mostraba en ese momento, de
 * modo que la apariencia no cambia de golpe al actualizar.
 */
export function resolveThemeMode(value: unknown): ThemeMode {
  if (isThemeMode(value)) return value;
  if (value === 'system' && typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}
