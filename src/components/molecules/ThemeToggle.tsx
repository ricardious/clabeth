import { Monitor, Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../../store/settings';
import { IconButton } from '../atoms/IconButton';
import type { ThemeMode } from '../../types/theme';

const NEXT: Record<ThemeMode, ThemeMode> = { light: 'dark', dark: 'system', system: 'light' };
const LABELS: Record<ThemeMode, string> = {
  light: 'Tema claro (cambiar a oscuro)',
  dark: 'Tema oscuro (cambiar a sistema)',
  system: 'Tema del sistema (cambiar a claro)',
};

export function ThemeToggle() {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  return (
    <IconButton label={LABELS[theme]} onClick={() => setTheme(NEXT[theme])}>
      {theme === 'light' && <Sun size={17} aria-hidden />}
      {theme === 'dark' && <Moon size={17} aria-hidden />}
      {theme === 'system' && <Monitor size={17} aria-hidden />}
    </IconButton>
  );
}
