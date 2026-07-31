# Clabeth

Aplicación que convierte Markdown y fórmulas LaTeX en documentos con apariencia
de escritura manuscrita. React + TypeScript + Vite + Tailwind CSS v4.

## Comandos

```sh
npm install         # instalar dependencias
npm run dev         # servidor de desarrollo (http://localhost:5173)
npm run typecheck   # tsc --noEmit (TypeScript estricto)
npm run test        # Vitest + React Testing Library
npm run test:watch  # Vitest en modo watch
npm run build       # typecheck + build de producción (dist/)
npm run preview     # servir el build localmente
```

## Arquitectura

- `src/lib/` — lógica de dominio pura y testeable (markdown, latex, jitter,
  paginación, papel, exportación, storage, plantillas). Sin React.
- `src/store/` — estado global con Zustand (documentos, ajustes, UI).
- `src/components/` — Atomic Design: `atoms` → `molecules` → `organisms` →
  `templates`. Las páginas viven en `src/pages/`.
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
