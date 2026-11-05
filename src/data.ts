/**
 * Content for the site. Business facts come from the brand dossier
 * (Instagram @insurgentes_21 + OpenTable, Nov 2026). Prices are intentionally
 * not published until the restaurant confirms the current menu.
 */
const p = (s: string) => `/img/${s}`;

export const BRAND = {
  orange: "#EF5C32",
  olive: "#454F36",
  sand: "#EDE5D6",
  gold: "#B08A5B",
};

export const INFO = {
  address: "Avenida Escazú, Plaza 300",
  city: "San Rafael de Escazú, San José, Costa Rica",
  phone: "+506 8455-1228",
  whatsapp: "https://wa.me/50684551228",
  instagram: "https://www.instagram.com/insurgentes_21/",
  maps: "https://maps.app.goo.gl/eSsCXKzh5Vwb2xMC8",
  waze: "https://waze.com/ul?ll=9.93646,-84.14368&navigate=yes",
  opentable: "https://www.opentable.com.au/r/insurgentes-21-san-rafael-de-escazu",
  hours: [
    ["Lunes a jueves", "12:00 m.d. – 10:00 p.m."],
    ["Viernes y sábado", "12:00 m.d. – 11:00 p.m."],
    ["Domingo", "12:00 m.d. – 9:00 p.m."],
  ] as [string, string][],
};
export const IG = INFO.instagram;

const v = (n: string) => ({ video: `/video/${n}.mp4`, poster: `/video/${n}.jpg` });
export const heroSlides = [
  v("insurgentes21_hero_01_final"),
  v("insurgentes21_hero_02_final"),
  v("insurgentes21_hero_04"),
  v("insurgentes21_hero_05"),
];

export const gallery = [
  { label: "Para la mesa", img: p("platos/platos-21_DdMhxG7Diek.jpg") },
  { label: "Principales", img: p("platos/platos-02_DbLx9NSiEYV.jpg") },
  { label: "Mixología de autor", img: p("cocteles/cocteles-02_DbBiL7_ms6v.jpg") },
  { label: "La cava", img: p("vinos/vinos-02_DeM9GTQDQ5g.jpg") },
  { label: "Para compartir", img: p("platos/platos-18_DexAL0XAQoA.jpg") },
  { label: "El salón", img: p("ambiente/ambiente-03_DX2Ak6RDHdp.jpg") },
  { label: "Brasa viva al Josper", img: p("cocteles/cocteles-11_DfAc6LBifWi.jpg") },
];

type Link = { label: string; href: string };
export type NavItem = { label: string; href: string; items: Link[] };
export const menu: { left: NavItem[]; right: NavItem[] } = {
  left: [
    { label: "Nosotros", href: "#nosotros", items: [
      { label: "Nuestra cocina", href: "#nosotros" },
      { label: "La experiencia", href: "#experiencia" },
      { label: "Salón VIP", href: "#experiencia" },
    ] },
    { label: "Menú", href: "#carta", items: [
      { label: "La carta", href: "#carta" },
      { label: "Brasa viva al Josper", href: "#carta" },
      { label: "Coctelería de autor", href: "#cocteleria" },
      { label: "La cava", href: "#vinos" },
    ] },
  ],
  right: [
    { label: "Tardes", href: "#cocteleria", items: [
      { label: "Tardes en Insurgentes", href: "#cocteleria" },
      { label: "Especiales de la casa", href: "#visitanos" },
    ] },
    { label: "Reservá", href: "#visitanos", items: [
      { label: "Reservar en OpenTable", href: INFO.opentable },
      { label: "WhatsApp", href: INFO.whatsapp },
      { label: "Cómo llegar", href: INFO.maps },
      { label: "Instagram", href: INFO.instagram },
    ] },
  ],
};

export const marqueeWords = [
  "Brasa viva al Josper", "USDA Prime", "Mixología de autor", "+70 etiquetas", "Quesobirria",
  "Mar y Tierra", "Ostras", "Tequila & Mezcal", "Terraza", "Salón VIP", "Chef's Table", "Escazú",
];

/** Signature dishes with their menu descriptions. */
export const carta = [
  { name: "Aguachile de Camarón", note: "Entradas", desc: "Camarones nacionales en caldo cítrico de chiles, culantro, pepino baby y aguacate.", img: p("platos/platos-05_DXzbug9DXyM.jpg") },
  { name: "Pulpo Zarandeado", note: "Brasa viva", desc: "Con vegetales a las brasas y romesco de ajonjolí.", img: p("platos/platos-03_DZ79V3SCVWk.jpg") },
  { name: "Tacos Gobernador", note: "Tacos de la casa", desc: "Queso, camarones ahumados, aguacate y mayonesa de chipotle.", img: p("platos/platos-08_DXZsB-BDCsv.jpg") },
  { name: "Short Rib Wagyu", note: "Principales", desc: "Braseado por más de 4 horas y glaseado en su demi-glace.", img: p("platos/platos-10_DXR9ifaDcTl.jpg") },
  { name: "Coliflor al Josper", note: "Vegetariano", desc: "Rostizada en salsa macha sobre pipián verde.", img: p("platos/platos-15_DWUD1mUFU00.jpg") },
  { name: "Pollo al Mole Poblano", note: "Especiales de la casa", desc: "Al Josper, con vegetales de temporada.", img: p("platos/platos-17_De2Jtd7jvjU.jpg") },
];

/** Cocktail columns; `name` only where the post names the drink. */
export const cocteles: { img: string; name?: string }[][] = [
  [
    { img: p("cocteles/cocteles-01_DbHDhFpiaKt.jpg") },
    { img: p("cocteles/cocteles-08_DWXRc-GDPmL.jpg"), name: "Negroni" },
    { img: p("cocteles/cocteles-13_Dd7dxA7DYFm.jpg") },
  ],
  [
    { img: p("cocteles/cocteles-05_DXm_R_1DY9h.jpg"), name: "Ik Kil" },
    { img: p("cocteles/cocteles-10_DfGB7NujwUh.jpg") },
    { img: p("cocteles/cocteles-04_DXrtvTtja46.jpg"), name: "Old Fashioned" },
  ],
  [
    { img: p("cocteles/cocteles-03_Da3jG1SneQo.jpg") },
    { img: p("cocteles/cocteles-09_DV6oIsOiCwa.jpg"), name: "Arroz con Leche" },
    { img: p("cocteles/cocteles-12_Der2k5vCKsj.jpg") },
  ],
];
