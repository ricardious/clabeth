import { Link, useNavigate } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { ArrowRight, BookOpenText, FileDown, Layers, NotebookPen, Sigma } from 'lucide-react';
import { useDocumentsStore } from '../store/documents';
import { WELCOME_CONTENT } from '../lib/welcome';
import { HANDWRITING_PRESETS } from '../lib/handwriting/presets';
import { getHandwritingFont } from '../lib/handwriting/fonts';
import { getInk } from '../lib/handwriting/inks';
import { PAPER_STYLES } from '../lib/paper/styles';
import { Button } from '../components/atoms/Button';
import { Logo } from '../components/atoms/Logo';
import { ThemeToggle } from '../components/molecules/ThemeToggle';
import { PaperStyleCard } from '../components/molecules/PaperStyleCard';
import { LandingDemo } from '../components/organisms/LandingDemo';

const STEPS = [
  {
    icon: NotebookPen,
    title: 'Escribe Markdown y LaTeX',
    description: 'Texto plano, estructuras y fórmulas: $E = mc^2$ o una integral completa.',
  },
  {
    icon: Layers,
    title: 'La hoja se dibuja sola',
    description: 'El paginador reparte el contenido en A4 o carta, con tu estilo de letra.',
  },
  {
    icon: FileDown,
    title: 'Exporta a PDF o PNG',
    description: 'Página actual, rango o todas, conservando el papel y la paginación.',
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const documents = useDocumentsStore((state) => state.documents);
  const createAndAdd = useDocumentsStore((state) => state.createAndAdd);

  const enterAsGuest = (): void => {
    if (documents.length === 0) {
      createAndAdd({ title: 'Bienvenido a Clabeth', content: WELCOME_CONTENT });
    }
    navigate('/app');
  };

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-10 border-b border-outline bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-[var(--topbar-h)] max-w-6xl items-center justify-between px-4">
          <Logo size="sm" />
          <nav aria-label="Principal" className="hidden items-center gap-5 text-sm text-muted sm:flex">
            <Link to="/app" className="hover:text-foreground">
              Documentos
            </Link>
            <Link to="/app/plantillas" className="hover:text-foreground">
              Plantillas
            </Link>
            <Link to="/app/guias/markdown" className="hover:text-foreground">
              Guías
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={enterAsGuest} className="hidden sm:inline-flex">
              Entrar como invitado
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-10 text-center sm:pt-24">
          <p className="anim-fade-up mx-auto inline-flex items-center gap-1.5 rounded-full border border-outline bg-surface px-3 py-1 text-xs text-muted">
            <Sigma size={13} aria-hidden /> Markdown · LaTeX · papel manuscrito
          </p>
          <h1 className="anim-fade-up mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight text-foreground-strong sm:text-5xl">
            Convierte Markdown y fórmulas LaTeX en{' '}
            <span className="text-primary">documentos con apariencia de escritura manuscrita</span>.
          </h1>
          <p className="anim-fade-up mx-auto mt-5 max-w-xl text-[15px] text-muted">
            Clabeth es un editor de Markdown, un cuaderno digital y un editor de fórmulas en uno.
            Escribe con tus manos, con tu letra, sin renunciar al texto plano.
          </p>
          <div className="anim-fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={enterAsGuest}>
              Entrar como invitado <ArrowRight size={17} aria-hidden />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/app/plantillas')}>
              Explorar plantillas
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted">Sin registro. Tus documentos se guardan en este navegador.</p>
        </section>

        {/* Demo funcional */}
        <section aria-label="Demostración" className="mx-auto max-w-6xl px-4 pb-16">
          <LandingDemo />
        </section>

        {/* Cómo funciona */}
        <section aria-label="Cómo funciona" className="border-y border-outline bg-surface/60">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-14 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="flex flex-col gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <step.icon size={19} aria-hidden />
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground-strong">{step.title}</h3>
                <p className="text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Estilos de papel */}
        <section aria-label="Tipos de papel" className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground-strong">Papeles reales</h2>
              <p className="mt-1 text-sm text-muted">Renglones que siguen tu interlineado, retícula, cuaderno con margen rojo.</p>
            </div>
            <Link to="/app/guias/markdown" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <BookOpenText size={15} aria-hidden /> Guías
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {PAPER_STYLES.map((style) => (
              <PaperStyleCard key={style.id} style={style} selected={false} onSelect={() => undefined} />
            ))}
          </div>
        </section>

        {/* Estilos de escritura */}
        <section aria-label="Estilos de escritura" className="border-t border-outline bg-surface/60">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="font-display text-2xl font-semibold text-foreground-strong">Tu letra, tus tintas</h2>
            <p className="mt-1 max-w-xl text-sm text-muted">
              Presets listos —Clara, Escolar, Técnica, Cursiva, Apuntes, Elegante— y controles finos:
              inclinación, grosor, irregularidad y color de tinta.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {HANDWRITING_PRESETS.map((preset) => (
                <div key={preset.id} className="rounded-lg border border-outline bg-surface p-3 shadow-panel">
                  <span
                    aria-hidden
                    className="block text-xl leading-snug"
                    style={
                      {
                        fontFamily: getHandwritingFont(preset.config.fontId).family,
                        color: `var(${getInk(preset.config.inkId).token})`,
                        fontWeight: preset.config.weight,
                      } as CSSProperties
                    }
                  >
                    {preset.name}
                  </span>
                  <span className="mt-1 block text-xs text-muted">{preset.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold text-foreground-strong">
            ¿Listo para escribir a mano, sin escribir a mano?
          </h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={enterAsGuest}>
              Abrir Clabeth <ArrowRight size={17} aria-hidden />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted sm:flex-row">
          <Logo size="sm" className="opacity-70" />
          <p>Clabeth — escritura manuscrita desde Markdown y LaTeX.</p>
        </div>
      </footer>
    </div>
  );
}
