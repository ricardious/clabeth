import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../atoms/Button';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Clabeth: error no capturado', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center" role="alert">
          <h1 className="font-display text-2xl font-semibold text-foreground-strong">Algo salió mal</h1>
          <p className="max-w-md text-sm text-muted">{this.state.error.message}</p>
          <Button onClick={() => window.location.reload()}>Recargar la aplicación</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
