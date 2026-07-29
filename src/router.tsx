import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './components/templates/AppShell';
import { DocumentsPage } from './pages/DocumentsPage';
import { EditorPage } from './pages/EditorPage';
import { LandingPage } from './pages/LandingPage';
import { LatexGuidePage } from './pages/LatexGuidePage';
import { MarkdownGuidePage } from './pages/MarkdownGuidePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingsPage } from './pages/SettingsPage';
import { TemplatesPage } from './pages/TemplatesPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  {
    element: <AppShell />,
    children: [
      { path: '/app', element: <DocumentsPage /> },
      { path: '/app/plantillas', element: <TemplatesPage /> },
      { path: '/app/guias/markdown', element: <MarkdownGuidePage /> },
      { path: '/app/guias/latex', element: <LatexGuidePage /> },
      { path: '/app/ajustes', element: <SettingsPage /> },
    ],
  },
  { path: '/app/editor/:id', element: <EditorPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
