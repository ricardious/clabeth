import { Link } from 'react-router-dom';
import { Logo } from '../components/atoms/Logo';

export function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-background p-8 text-center">
      <span className="font-display text-7xl font-semibold text-primary">404</span>
      <p className="font-display text-2xl font-semibold text-foreground-strong">Esta hoja no existe</p>
      <p className="max-w-sm text-sm text-muted">
        La dirección no se encuentra en Clabeth. Quizá el documento fue movido o la ruta tiene una errata.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <Link
          to="/app"
          className="inline-flex h-[var(--control-h-md)] items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-[var(--dur-fast)] hover:bg-primary-strong"
        >
          Mis documentos
        </Link>
        <Link to="/" className="text-sm text-primary hover:underline">
          Volver a la portada
        </Link>
      </div>
      <Logo size="sm" className="mt-8 opacity-60" />
    </div>
  );
}
