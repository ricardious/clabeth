import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { resolveThemeMode, type ThemeMode } from '../types/theme';
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
      version: 2,
      // El modo «sistema» existió hasta la versión 1. Quien lo tuviera guardado
      // se queda con el tema que el sistema mostraba en ese momento, así que la
      // apariencia no cambia de golpe al actualizar.
      migrate: (persisted) => {
        const settings = persisted as SettingsState;
        return { ...settings, theme: resolveThemeMode(settings.theme) };
      },
    },
  ),
);
