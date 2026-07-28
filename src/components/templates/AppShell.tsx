import { Outlet, useLocation } from 'react-router-dom';
import { SideNav } from '../organisms/SideNav';
import { TopBar } from '../organisms/TopBar';

const TITLES: Record<string, string> = {
  '/app': 'Mis documentos',
  '/app/plantillas': 'Plantillas',
  '/app/ajustes': 'Ajustes',
  '/app/guias/markdown': 'Guía de Markdown',
  '/app/guias/latex': 'Guía de LaTeX',
};

/** Layout de la aplicación: navegación lateral + barra superior + contenido. */
export function AppShell() {
  const location = useLocation();
  const title = TITLES[location.pathname] ?? 'Clabeth';

  return (
    <div className="flex h-full">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
