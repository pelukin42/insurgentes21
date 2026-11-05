export const ACCENT = "#F0603A";
export const IG = "https://www.instagram.com/insurgentes_21/";
const p = (s: string) => `/img/${s}`;

export const heroSlides = [
  p("fachada/fachada-01_DZLCR0Mlf6c.jpg"),
  p("ambiente/ambiente-01_DaWDQapEcmY.jpg"),
  p("platos/platos-03_DZ79V3SCVWk.jpg"),
];

export const gallery = [
  { label: "Entradas", img: p("platos/platos-05_DXzbug9DXyM.jpg") },
  { label: "Platos fuertes", img: p("platos/platos-09_DXXHRLniE8Q.jpg") },
  { label: "Coctelería", img: p("cocteles/cocteles-02_DbBiL7_ms6v.jpg") },
  { label: "Vinos", img: p("vinos/vinos-02_DeM9GTQDQ5g.jpg") },
  { label: "Para compartir", img: p("platos/platos-18_DexAL0XAQoA.jpg") },
  { label: "Ambiente", img: p("ambiente/ambiente-03_DX2Ak6RDHdp.jpg") },
  { label: "Al fuego", img: p("cocteles/cocteles-11_DfAc6LBifWi.jpg") },
];

export const menu = {
  left: [
    { label: "Nosotros", href: "#nosotros", items: ["Nuestra historia", "La cocina", "El ambiente"] },
    { label: "Experiencia", href: "#experiencia", items: ["Cocina de temporada", "Coctelería de autor", "Eventos privados"] },
  ],
  right: [
    { label: "Menú", href: "#menu", items: ["Entradas", "Platos fuertes", "Coctelería", "Vinos", "Postres"] },
    { label: "Contacto", href: "#contacto", items: ["Reservaciones", "Instagram", "WhatsApp", "Eventos"] },
  ],
};

export const marqueeWords = [
  "Cocina de autor", "Coctelería", "Mezcal", "Vinos", "Tequila", "Maíz", "Temporada",
  "Brasas", "Sobremesa", "Mixología", "Insurgentes 21", "Hecho en casa",
];
