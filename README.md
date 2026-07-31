# Clabeth

**Convierte Markdown y fórmulas LaTeX en documentos con apariencia de
escritura manuscrita.**

Editor de Markdown, cuaderno digital y editor de fórmulas en uno. Escribe en
texto plano, personaliza papel, letra y tinta, y exporta a PDF o PNG.

## Requisitos

- Node.js ≥ 22.12

## Puesta en marcha

```sh
npm install
npm run dev
```

Abre <http://localhost:5173>. La portada incluye una demo funcional; «Entrar
como invitado» crea un documento de bienvenida.

## Comandos

| Comando             | Acción                                    |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                    |
| `npm run typecheck` | `tsc --noEmit` (TypeScript estricto)      |
| `npm run test`      | Vitest + React Testing Library            |
| `npm run build`     | typecheck + build de producción (`dist/`) |
| `npm run preview`   | Sirve el build localmente                 |

## Funcionalidades

- **Editor Markdown** con barra de herramientas, atajos (Ctrl+B/I/K/S/E/F/Z/Y),
  deshacer/rehacer, búsqueda, importación `.md`/`.txt` y estadísticas en vivo.
- **LaTeX** en línea (`$…$`) y en bloque (`$$…$$`) con KaTeX; fórmulas
  inválidas se marcan como chips sin romper el documento; paleta de ~65
  snippets con vista previa.
- **Vista manuscrita paginada**: A4 y carta, papeles (blanca, rayada,
  cuadriculada, punteada, crema, libreta, académica), margen rojo, encabezado,
  pie, numeración, zoom, vista continua/una/dos páginas y pantalla completa.
- **Escritura** con presets (Clara, Escolar, Técnica, Cursiva, Apuntes,
  Elegante) y controles finos (fuente, tamaño, grosor, inclinación, tinta,
  intensidad, interlineado, espaciado, irregularidad). El jitter es
  determinista por documento: lo que ves es lo que exporta.
- **Documentos**: crear, abrir, guardar, duplicar, renombrar, eliminar,
  buscar, ordenar y filtrar; autoguardado con estados (guardando/guardado/
  error) y persistencia local.
- **Plantillas**: 10 plantillas iniciales con contenido realista en español.
- **Exportación real** a PDF y PNG (actual/todas/rango, tamaño, orientación,
  calidad, fondo, numeración, encabezado/pie).
- **Tema** claro, oscuro y según el sistema; la hoja permanece clara.
- **Responsive**: escritorio con paneles redimensionables; móvil con pestañas
  Escribir / Vista previa / Personalizar.

## Estructura

```
src/
├── lib/            lógica de dominio (markdown, latex, handwriting,
│                   pagination, paper, export, storage, templates)
├── store/          Zustand: documentos, ajustes, UI
├── hooks/          autosave, historial, búsqueda, paginación, atajos, tema
├── components/
│   ├── atoms/      botones, inputs, sliders, diálogo, logo…
│   ├── molecules/  tarjetas, estados, navegación de páginas…
│   ├── organisms/  editor, preview paginada, paneles, exportación…
│   └── templates/  AppShell y EditorShell (layout)
├── pages/          Landing, Documentos, Editor, Plantillas, Ajustes,
│                   Guías Markdown/LaTeX, 404
└── styles/         tokens OKLCH, papel, base, puente @theme de Tailwind v4
```

## Notas técnicas

- Todo el sistema visual usa variables semánticas OKLCH (claro/oscuro/sistema)
  definidas en `src/styles/tokens.css` y expuestas por Tailwind v4.
- El paginador mide bloques reales en un contenedor oculto y reparte por
  altura; `\newpage` fuerza salto de página y los encabezados se mantienen con
  el bloque siguiente.
- La exportación captura los mismos nodos de página de la vista previa
  (fuentes y fondo incluidos) y arma PDF con jsPDF.
