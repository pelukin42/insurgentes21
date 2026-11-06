# Insurgentes 21 — sitio web

**Ver el sitio rápido:** descargá [`vista-previa.html`](vista-previa.html) (botón *Download raw file*)
y abrilo con doble clic en Chrome o Safari. Incluye videos y fotos; se ve completo sin instalar nada.

Landing page de Insurgentes 21 (Avenida Escazú, Plaza 300, Costa Rica).
React 18 + Vite + TypeScript + Tailwind + GSAP (ScrollTrigger, SplitText).

```bash
npm install
npm run dev      # desarrollo
npm run build    # producción en dist/
```

- Contenido y datos del negocio: `src/data.ts` (textos en `["español", "English"]`)
- Próximos eventos: agregalos en `upcoming` dentro de `src/data.ts` (se ocultan solos al pasar la fecha)
- Carta completa (precios): `src/menuData.ts` · PDF descargable: `public/menu/menu-insurgentes21.pdf`
- Idioma: botón ES/EN en la barra; se recuerda por visitante y también acepta `?lang=en`
- Fotos: `public/img/` · Videos del inicio: `public/video/` · Logo: `public/logo.svg`, `public/logo-mark.svg`

Pendiente de confirmar con el restaurante: logo vectorial original, fuentes oficiales,
carta de coctelería y vinos, y fechas de próximos eventos. La carta y el PDF se tomaron de
insurgentes21.com (nov. 2026).

## Publicación (GitHub Pages)

Cada push a `main` publica el sitio con `.github/workflows/pages.yml` en
https://pelukin42.github.io/insurgentes21/ — requiere *Settings → Pages → Source: GitHub Actions*.

## Reseñas y Google

- Sección *Reseñas* (`src/components/Resenas.tsx`): pegá reseñas reales en `reviews` (`src/data.ts`) y se muestran en carrusel; nunca inventarlas.
- Enlace corto para pedir reseñas: `/resena/` (abre el formulario de Google). Ideal para WhatsApp y correos post-visita.
- Tarjeta de mesa con QR (ES/EN, 10 × 15 cm): `public/resena/tarjeta-resena.pdf` — se regenera con `node scripts/qr-card.cjs`.
- `index.html` lleva datos estructurados `Restaurant` (schema.org) para Google; actualizar `url` y `menu` al pasar a dominio propio.
