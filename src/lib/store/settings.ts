import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '../types/theme';
import type { PageSizeId, PaperStyleId } from '../types/paper';

/** Preferencias reactivas compartidas por las islas React. */
interface SettingsState {
  theme: ThemeMode;
  defaultPresetId: string;
  defaultPaperStyle: PaperStyleId;
  defaultPageSize: PageSizeId;
  setTheme: (theme: ThemeMode) => void;
  setDefaultPresetId: (id: string) => void;
  setDefaultPaperStyle: (style: PaperStyleId) => void;
  setDefaultPageSize: (size: PageSizeId) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      defaultPresetId: 'clara',
      defaultPaperStyle: 'libreta',
      defaultPageSize: 'a4',
      setTheme: (theme) => set({ theme }),
      setDefaultPresetId: (defaultPresetId) => set({ defaultPresetId }),
      setDefaultPaperStyle: (defaultPaperStyle) => set({ defaultPaperStyle }),
      setDefaultPageSize: (defaultPageSize) => set({ defaultPageSize }),
    }),
    {
      name: 'clabeth.settings.v1',
      version: 1,
      migrate: (persisted, version) => {
        const settings = persisted as SettingsState;
        // `system` era el valor inicial de la versión 0 y hacía que el editor
        // apareciera negro en equipos oscuros. La elección sigue disponible.
        if (version === 0 && settings.theme === 'system') {
          return { ...settings, theme: 'light' };
        }
        return settings;
      },
    },
  ),
);
