# Cómo aportar a Clabeth

Gracias por ayudar a mejorar Clabeth. Se aceptan correcciones, nuevas
funcionalidades, documentación, pruebas y propuestas de diseño.

## Antes de empezar

1. Revisa los issues existentes para evitar trabajo duplicado.
2. Si el cambio es grande o modifica la experiencia principal, abre primero un
   issue explicando el problema y la solución propuesta.
3. Parte de la rama `develop` y crea una rama con un nombre descriptivo, por
   ejemplo `feat/nuevos-papeles` o `fix/exportacion-png`.

## Preparar el proyecto

Necesitas Node.js 22.12 o posterior y pnpm.

```sh
pnpm install
pnpm dev
```

La aplicación estará disponible en <http://localhost:4321>.

## Convenciones de código

- Mantén TypeScript estricto y evita `any` salvo que exista una razón
  documentada.
- Astro es el formato predeterminado para páginas y componentes estáticos.
  Usa React únicamente cuando el componente necesite estado o interacción
  continua en el navegador.
- Respeta Atomic Design dentro de `src/components/`: `atoms`, `molecules`,
  `organisms` y `templates`.
- No uses colores literales en componentes. Utiliza los tokens semánticos de
  `src/styles/tokens.css`.
- Limita los estilos inline a variables CSS dinámicas relacionadas con papel,
  tinta, dimensiones o escritura.
- Conserva el jitter manuscrito determinista para que la vista previa coincida
  con la exportación.
- Toda fuente manuscrita nueva debe incluir correctamente los caracteres del
  español: `á é í ó ú ü ñ ¿ ¡` y sus mayúsculas.
- Añade o actualiza pruebas cuando cambies comportamiento observable.

## Comprobar los cambios

Antes de abrir un pull request, ejecuta:

```sh
pnpm typecheck
pnpm test
pnpm build
```

Para cambios visuales, revisa al menos escritorio y móvil. Comprueba también la
exportación si modificaste papel, tipografía, fórmulas, paginación o estilos de
escritura.

## Commits

Haz commits pequeños y funcionales. Cada commit debe representar una sola
decisión y mantener el historial fácil de revisar.

Usa Conventional Commits:

```text
feat(editor): add Markdown shortcut
fix(export): preserve paper background
docs(readme): clarify local setup
test(pagination): cover forced page breaks
```

Evita mezclar refactorizaciones, cambios visuales y correcciones no relacionadas
en el mismo commit.

## Pull requests

Incluye en la descripción:

- El problema que resuelve el cambio.
- Qué modificaste y por qué.
- Cómo verificaste el resultado.
- Capturas o video si hay cambios visuales.
- Riesgos, limitaciones o trabajo pendiente.

Antes de solicitar revisión, confirma que:

- [ ] El cambio parte de `develop` y está actualizado con esa rama.
- [ ] Typecheck, pruebas y build terminan correctamente.
- [ ] No se incluyeron secretos, archivos generados ni cambios ajenos.
- [ ] La interfaz funciona con teclado y conserva etiquetas accesibles.
- [ ] El contenido y las fuentes funcionan correctamente en español.
- [ ] Los commits son granulares y tienen mensajes descriptivos.

Los cambios se revisan por claridad, alcance, accesibilidad, compatibilidad con
español y coherencia entre la vista previa y la exportación.
