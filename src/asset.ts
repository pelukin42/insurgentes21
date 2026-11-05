/**
 * Resolves a public asset path against the deploy base (e.g. /insurgentes21/
 * on GitHub Pages). The single-file preview build (scripts/preview.py) injects
 * window.__ASSETS with inlined data URIs, which take precedence.
 */
export const asset = (path: string): string =>
  (window as unknown as { __ASSETS?: Record<string, string> }).__ASSETS?.[path] ??
  (path.startsWith("/") ? import.meta.env.BASE_URL + path.slice(1) : path);
