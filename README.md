# Clabeth

**Convierte Markdown y fórmulas LaTeX en documentos con apariencia de
escritura manuscrita.**

Editor de Markdown, cuaderno digital y editor de fórmulas en uno. Escribe en
texto plano, personaliza papel, letra y tinta, y exporta a PDF o PNG.

## Requisitos

- Node.js ≥ 22.12

## Puesta en marcha

```sh
pnpm install
pnpm dev
```

Abre <http://localhost:4321>. La portada incluye una demo funcional;
«Empezar a escribir» crea un documento de bienvenida.

## Comandos

| Comando             | Acción                                    |
| ------------------- | ----------------------------------------- |
| `pnpm dev`       | Servidor de desarrollo                    |
| `pnpm typecheck` | `astro check` (Astro + TypeScript)        |
| `pnpm test`      | Vitest + React Testing Library            |
| `pnpm build`     | typecheck + build de producción (`dist/`) |
| `pnpm preview`   | Sirve el build localmente                 |

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
├── pages/          rutas Astro estáticas y páginas de la aplicación
├── layouts/        documento base y shell Astro de la aplicación
├── lib/            dominio e infraestructura compartida
│   ├── types/      tipos de documentos, papel, escritura, tema y exportación
│   ├── store/      Zustand: documentos, ajustes y UI
│   └── …           markdown, latex, handwriting, pagination, export, storage
├── hooks/          autosave, historial, búsqueda, paginación, atajos, tema
├── components/
│   ├── atoms/      botones, inputs, sliders, diálogo, logo…
│   ├── molecules/  tarjetas, estados, navegación de páginas…
│   ├── organisms/  editor, preview paginada, paneles, exportación…
│   └── templates/  layouts internos de las islas interactivas
└── styles/         tokens OKLCH, papel, base, puente @theme de Tailwind v4
```

## Notas técnicas

- Astro genera el enrutado, la portada, demo, biblioteca, plantillas, ajustes,
  guías y layouts como HTML. React se hidrata solamente en el editor, donde
  existe estado interactivo continuo, refs DOM y paneles sincronizados.
- Solo la ruta del editor carga la isla React; las dependencias de exportación no
  forman parte del JavaScript inicial de la portada o las guías.
- Todo el sistema visual usa variables semánticas OKLCH (claro/oscuro/sistema)
  definidas en `src/styles/tokens.css` y expuestas por Tailwind v4.
- El paginador mide bloques reales en un contenedor oculto y reparte por
  altura; `\newpage` fuerza salto de página y los encabezados se mantienen con
  el bloque siguiente.
- La exportación captura los mismos nodos de página de la vista previa
  (fuentes y fondo incluidos) y arma PDF con jsPDF.
