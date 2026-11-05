/**
 * Resolves a public asset path. Normally returns the path unchanged; the
 * single-file preview build (scripts/preview.py) injects window.__ASSETS with
 * inlined data URIs so the page works offline as one HTML file.
 */
export const asset = (path: string): string =>
  (window as unknown as { __ASSETS?: Record<string, string> }).__ASSETS?.[path] ?? path;
