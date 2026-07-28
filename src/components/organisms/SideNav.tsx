import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpenText,
  Files,
  Home,
  LayoutTemplate,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sigma,
} from 'lucide-react';
import { useUiStore } from '../../store/ui';
import { useIsMobile } from '../../hooks/use-media-query';
import { Logo } from '../atoms/Logo';
import { IconButton } from '../atoms/IconButton';
import { Separator } from '../atoms/Separator';
import { ThemeToggle } from '../molecules/ThemeToggle';
import { cn } from '../../lib/utils/cn';

const NAV_ITEMS = [
  { to: '/app', label: 'Documentos', icon: Files, end: true },
  { to: '/app/plantillas', label: 'Plantillas', icon: LayoutTemplate, end: false },
  { to: '/app/guias/markdown', label: 'Guía Markdown', icon: BookOpenText, end: false },
  { to: '/app/guias/latex', label: 'Guía LaTeX', icon: Sigma, end: false },
  { to: '/app/ajustes', label: 'Ajustes', icon: Settings, end: false },
] as const;

export function SideNav() {
  const open = useUiStore((state) => state.sidebarOpen);
  const toggle = useUiStore((state) => state.toggleSidebar);
  const isMobile = useIsMobile();

  // En móvil la navegación es un cajón: arranca cerrado para no tapar el contenido.
  useEffect(() => {
    if (isMobile) useUiStore.setState({ sidebarOpen: false });
  }, [isMobile]);

  return (
    <>
      {isMobile && open && (
        <div
          aria-hidden
          className="fixed inset-0 z-30 bg-[color-mix(in_oklch,var(--foreground)_35%,transparent)]"
          onClick={toggle}
        />
      )}
      <nav
        aria-label="Navegación principal"
        className={cn(
          'z-40 flex h-full shrink-0 flex-col border-r border-outline bg-surface transition-[width] duration-[var(--dur-med)]',
          isMobile ? 'fixed left-0 top-0 shadow-pop' : 'relative',
          isMobile && !open && '-translate-x-full',
          open ? 'w-[var(--sidebar-w)]' : 'w-[var(--rail-w)]',
        )}
        style={isMobile ? { width: 'var(--sidebar-w)' } : undefined}
      >
        <div className={cn('flex h-[var(--topbar-h)] items-center border-b border-outline px-3', open ? 'justify-between' : 'justify-center')}>
          {open && (
            <NavLink to="/" aria-label="Ir a la portada de Clabeth">
              <Logo size="sm" />
            </NavLink>
          )}
          <IconButton label={open ? 'Contraer navegación' : 'Expandir navegación'} size="sm" onClick={toggle}>
            {open ? <PanelLeftClose size={16} aria-hidden /> : <PanelLeftOpen size={16} aria-hidden />}
          </IconButton>
        </div>

        <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={item.label}
              onClick={() => {
                if (isMobile) toggle();
              }}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-[var(--dur-fast)]',
                  !open && !isMobile && 'justify-center px-0',
                  isActive
                    ? 'bg-primary-soft font-medium text-primary'
                    : 'text-muted hover:bg-panel hover:text-foreground',
                )
              }
            >
              <item.icon size={17} aria-hidden className="shrink-0" />
              {(open || isMobile) && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        <Separator />
        <div className={cn('flex items-center gap-1 p-2', open ? 'justify-between' : 'flex-col')}>
          <NavLink
            to="/"
            title="Portada"
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted transition-colors hover:bg-panel hover:text-foreground"
          >
            <Home size={17} aria-hidden />
            {open && <span>Portada</span>}
          </NavLink>
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
}
