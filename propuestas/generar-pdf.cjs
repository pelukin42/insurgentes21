/**
 * Genera los PDF de las propuestas a partir de los HTML de esta carpeta.
 * Uso: node propuestas/generar-pdf.cjs [archivo.html ...]
 * Esta carpeta no se publica en el sitio (Netlify publica solo dist/).
 */
const path = require("path");
const { chromium } = require("playwright");
const DIR = __dirname;
const DOCS = {
  "ct01-sitio-web.html": "Cotizacion-CT01-Insurgentes21-SitioWeb.pdf",
  "ct02-crm-omnicanal.html": "Cotizacion-CT02-Insurgentes21-CRM-Omnicanal.pdf",
  "preguntas-diagnostico.html": "Preguntas-de-diagnostico-Insurgentes21.pdf",
};
(async () => {
  const only = process.argv.slice(2);
  const b = await chromium.launch();
  const pg = await b.newPage();
  for (const [src, out] of Object.entries(DOCS)) {
    if (only.length && !only.includes(src)) continue;
    await pg.goto("file://" + path.join(DIR, src), { waitUntil: "networkidle" });
    await pg.evaluate(() => document.fonts.ready);
    await pg.pdf({ path: path.join(DIR, out), format: "A4", printBackground: true, preferCSSPageSize: true });
    console.log("→", out);
  }
  await b.close();
})();
