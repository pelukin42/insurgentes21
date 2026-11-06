/**
 * Printable table card with a QR to the Google review form.
 * Usage: node scripts/qr-card.cjs  ->  public/resena/tarjeta-resena.pdf (10 × 15 cm, 2 páginas: ES y EN)
 */
const fs = require("fs"), path = require("path");
const QR = require("qrcode");
const { chromium } = require("playwright");
const ROOT = path.join(__dirname, "..");
const URL = "https://search.google.com/local/writereview?placeid=ChIJbTNk4M_9oI8RBYgHPz81aUM";
const logo = "data:image/svg+xml;base64," + fs.readFileSync(path.join(ROOT, "public/logo.svg")).toString("base64");

(async () => {
  const qr = await QR.toString(URL, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#111111", light: "#0000" } });
  const card = (kick, title, body, foot) => `
  <section>
    <img class="logo" src="${logo}">
    <p class="kick">${kick}</p>
    <h1>${title}</h1>
    <div class="qr">${qr}</div>
    <p class="body">${body}</p>
    <p class="foot">${foot}</p>
  </section>`;
  const html = `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    @page { size: 100mm 150mm; margin: 0 }
    body { margin: 0; font-family: "Open Sans", sans-serif; }
    section { width: 100mm; height: 150mm; box-sizing: border-box; padding: 10mm 10mm 8mm; background: #EDE5D6; color: #111;
      display: flex; flex-direction: column; align-items: center; text-align: center; page-break-after: always; border-top: 4mm solid #EF5C32; }
    .logo { width: 22mm; height: 22mm }
    .kick { margin: 5mm 0 0; font-size: 7pt; letter-spacing: .35em; text-transform: uppercase; color: #B08A5B }
    h1 { font-family: "Instrument Serif", serif; font-weight: 400; font-size: 24pt; line-height: 1; margin: 3mm 0 5mm }
    .qr { width: 42mm; height: 42mm; padding: 4mm; background: #fff } .qr svg { width: 100%; height: 100% }
    .body { font-size: 9pt; line-height: 1.5; margin: 6mm 0 0; color: #333 }
    .foot { margin-top: auto; font-size: 7pt; letter-spacing: .25em; text-transform: uppercase; color: #777 }
  </style></head><body>
  ${card("Gracias por visitarnos", "¿Cómo estuvo<br>tu experiencia?", "Escaneá el código y dejanos tu reseña en Google.<br>Nos ayuda muchísimo a crecer.", "Insurgentes 21 · Escazú")}
  ${card("Thank you for visiting", "How was<br>your experience?", "Scan the code and leave us a Google review.<br>It means the world to us.", "Insurgentes 21 · Escazú")}
  </body></html>`;
  const b = await chromium.launch(); const pg = await b.newPage();
  await pg.setContent(html, { waitUntil: "networkidle" });
  const out = path.join(ROOT, "public/resena/tarjeta-resena.pdf");
  await pg.pdf({ path: out, width: "100mm", height: "150mm", printBackground: true });
  await b.close(); console.log("→", out);
})();
