import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useTheme } from './hooks/use-theme';
import { useDocumentsStore } from './store/documents';
import { ErrorBoundary } from './components/organisms/ErrorBoundary';

export function App() {
  useTheme();
  const init = useDocumentsStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
