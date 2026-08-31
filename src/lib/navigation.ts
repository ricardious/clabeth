/** Navegación entre páginas Astro, sin incluir un router SPA en el bundle. */
export function navigateTo(path: string): void {
  window.location.assign(path);
}
