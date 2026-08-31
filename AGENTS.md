# Clabeth

Aplicación que convierte Markdown y fórmulas LaTeX en documentos con apariencia
de escritura manuscrita. Astro + React islands + TypeScript + Tailwind CSS v4.

## Comandos

```sh
pnpm install        # instalar dependencias
pnpm dev            # servidor de desarrollo (http://localhost:4321)
pnpm typecheck      # astro check (Astro + TypeScript estricto)
pnpm test           # Vitest + React Testing Library
pnpm test:watch     # Vitest en modo watch
pnpm build          # typecheck + build de producción (dist/)
pnpm preview        # servir el build localmente
```

## Arquitectura

- `src/lib/` — dominio e infraestructura compartida: lógica pura y testeable
  (markdown, latex, jitter, paginación, papel, exportación, storage,
  plantillas), tipos en `lib/types/` y estado Zustand en `lib/store/`.
- `src/pages/` y `src/layouts/` — rutas y estructura HTML de Astro. Deben ser
  estáticas por defecto; hidratar únicamente la interacción necesaria.
- `src/components/` — Atomic Design: `atoms` → `molecules` → `organisms` →
  `templates`. Dentro de cada nivel, `.astro` es el formato predeterminado;
  `.tsx` se usa únicamente cuando el componente necesita estado React.
- `src/styles/` — sistema de tokens: `tokens.css` (variables semánticas
  OKLCH, claro/oscuro/sistema), `paper.css` (fondos de hoja y escritura),
  `base.css`. Tailwind v4 los expone como utilidades vía `@theme inline`.

## Convenciones importantes

- NUNCA usar colores literales en los componentes: usar tokens semánticos
  (`bg-primary`, `text-muted`, `border-outline`, `ring-focus-ring`, …).
- Los únicos estilos inline permitidos son variables CSS dinámicas de
  escritura/papel (fuente manuscrita, tinta, jitter, dimensiones de hoja).
- El jitter manuscrito es determinista por semilla (id del documento): la
  exportación coincide con la vista previa.
- El prop `document` de los componentes eclipsa al `document` global: para el
  DOM del navegador usar siempre `window.document`.
- Las opciones de KaTeX (`throwOnError: false`) convierten fórmulas inválidas
  en chips editables sin romper el documento (`rehype-katex-errors`).
- Las fórmulas tienen apariencia manuscrita controlada (`formulas.css`): letras
  y dígitos toman la fuente a mano (`--formula-font`) con fallback por glifo a
  KaTeX (los símbolos ∑ ∫ √ … siguen siendo precisos), tinta e inclinación
  heredadas (`--formula-slant`, limitada a ±3°) y modos
  manuscrita / sutil / tipográfica (`HandwritingConfig.formulaStyle`).
  Documentos antiguos sin el campo caen a `manuscrita` (`?? 'manuscrita'`).
- No convertir una página completa en SPA: Astro controla el enrutado y React
  se reserva para el espacio de trabajo del editor (`client:only="react"`),
  que necesita estado sincronizado, refs DOM y renderizado interactivo continuo.
