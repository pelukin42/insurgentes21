import { asset } from "./asset";
import type { T } from "./i18n";
/**
 * Content for the site. Business facts come from the brand dossier
 * (Instagram @insurgentes_21 + OpenTable + insurgentes21.com, Nov 2026).
 * Text shown to visitors is a T: either a plain string or [español, English].
 */
const p = (s: string) => asset(`/img/${s}`);

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
  menuPdf: asset(["", "menu", "menu-insurgentes21.pdf"].join("/")),
  hours: [
    [["Lunes a jueves", "Monday – Thursday"], ["12:00 m.d. – 10:00 p.m.", "12 pm – 10 pm"]],
    [["Viernes y sábado", "Friday & Saturday"], ["12:00 m.d. – 11:00 p.m.", "12 pm – 11 pm"]],
    [["Domingo", "Sunday"], ["12:00 m.d. – 9:00 p.m.", "12 pm – 9 pm"]],
  ] as [T, T][],
};
export const IG = INFO.instagram;

const v = (n: string) => ({ video: asset(`/video/${n}.mp4`), poster: asset(`/video/${n}.jpg`) });
export const heroSlides = [
  v("insurgentes21_hero_01_final"),
  v("insurgentes21_hero_02_final"),
  v("insurgentes21_hero_04"),
  v("insurgentes21_hero_05"),
];

export const gallery = [
  { label: ["Para la mesa", "For the table"] as T, img: p("platos/platos-21_DdMhxG7Diek.jpg") },
  { label: ["Principales", "Mains"] as T, img: p("platos/platos-02_DbLx9NSiEYV.jpg") },
  { label: ["Mixología de autor", "Signature mixology"] as T, img: p("cocteles/cocteles-02_DbBiL7_ms6v.jpg") },
  { label: ["La cava", "The wine cellar"] as T, img: p("vinos/vinos-02_DeM9GTQDQ5g.jpg") },
  { label: ["Para compartir", "To share"] as T, img: p("platos/platos-18_DexAL0XAQoA.jpg") },
  { label: ["El salón", "The dining room"] as T, img: p("ambiente/ambiente-03_DX2Ak6RDHdp.jpg") },
  { label: ["Brasa viva al Josper", "Live fire, Josper grill"] as T, img: p("cocteles/cocteles-11_DfAc6LBifWi.jpg") },
];

type Link = { label: T; href: string };
export type NavItem = { label: T; href: string; items: Link[] };
export const menu: { left: NavItem[]; right: NavItem[] } = {
  left: [
    { label: ["Nosotros", "About"], href: "#nosotros", items: [
      { label: ["Nuestra cocina", "Our kitchen"], href: "#nosotros" },
      { label: ["La experiencia", "The experience"], href: "#experiencia" },
      { label: ["Salón VIP", "VIP room"], href: "#eventos" },
    ] },
    { label: ["Menú", "Menu"], href: "#carta", items: [
      { label: ["Carta completa", "Full menu"], href: "#carta-completa" },
      { label: ["Especiales del mediodía", "Weekday lunch specials"], href: "#carta-completa" },
      { label: ["Coctelería de autor", "Signature cocktails"], href: "#cocteleria" },
      { label: ["La cava", "Wine cellar"], href: "#vinos" },
      { label: ["Descargar menú (PDF)", "Download menu (PDF)"], href: INFO.menuPdf },
    ] },
  ],
  right: [
    { label: ["Eventos", "Events"], href: "#eventos", items: [
      { label: ["Próximos eventos", "Upcoming events"], href: "#eventos" },
      { label: ["Tardes en Insurgentes", "Afternoons at Insurgentes"], href: "#eventos" },
      { label: ["Eventos privados", "Private events"], href: "#privados" },
    ] },
    { label: ["Reservá", "Book"], href: "#visitanos", items: [
      { label: ["Reservar en OpenTable", "Book on OpenTable"], href: INFO.opentable },
      { label: "WhatsApp", href: INFO.whatsapp },
      { label: ["Cómo llegar", "Directions"], href: INFO.maps },
      { label: "Instagram", href: INFO.instagram },
    ] },
  ],
};

export const marqueeWords: T[] = [
  ["Brasa viva al Josper", "Josper live fire"], "USDA Prime", ["Mixología de autor", "Signature mixology"], ["+70 etiquetas", "70+ wine labels"], "Quesobirria",
  ["Mar y Tierra", "Surf & Turf"], ["Ostras", "Oysters"], "Tequila & Mezcal", ["Terraza", "Terrace"], ["Salón VIP", "VIP room"], "Chef's Table", "Escazú",
];

/** Signature dishes with their menu descriptions. */
export const carta: { name: string; note: T; desc: T; img: string }[] = [
  { name: "Aguachile de Camarón", note: ["Entradas", "Starters"], desc: ["Camarones nacionales en caldo cítrico de chiles, culantro, pepino baby y aguacate.", "Local shrimp in a citrus chile broth with cilantro, baby cucumber and avocado."], img: p("platos/platos-05_DXzbug9DXyM.jpg") },
  { name: "Pulpo Zarandeado", note: ["Brasa viva", "Live fire"], desc: ["Con vegetales a las brasas y romesco de ajonjolí.", "With fire-roasted vegetables and sesame romesco."], img: p("platos/platos-03_DZ79V3SCVWk.jpg") },
  { name: "Tacos Gobernador", note: ["Tacos de la casa", "House tacos"], desc: ["Queso, camarones ahumados, aguacate y mayonesa de chipotle.", "Cheese, smoked shrimp, avocado and chipotle mayo."], img: p("platos/platos-08_DXZsB-BDCsv.jpg") },
  { name: "Short Rib Wagyu", note: ["Principales", "Mains"], desc: ["Braseado por más de 4 horas y glaseado en su demi-glace.", "Braised for over 4 hours and glazed in its own demi-glace."], img: p("platos/platos-10_DXR9ifaDcTl.jpg") },
  { name: "Coliflor al Josper", note: ["Vegetariano", "Vegetarian"], desc: ["Rostizada en salsa macha sobre pipián verde.", "Roasted in salsa macha over green pipián."], img: p("platos/platos-15_DWUD1mUFU00.jpg") },
  { name: "Pollo al Mole Poblano", note: ["Especiales de la casa", "House specials"], desc: ["Al Josper, con vegetales de temporada.", "Josper-grilled, with seasonal vegetables."], img: p("platos/platos-17_De2Jtd7jvjU.jpg") },
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

/**
 * Events. `recurring` ones always show. Add dated events to `upcoming`
 * (they hide automatically the day after `date`), e.g.:
 *   { date: "2026-12-12", title: ["Noche de mezcal", "Mezcal night"], desc: ["Maridaje de 5 tiempos.", "5-course pairing."], img: p("cocteles/cocteles-02_DbBiL7_ms6v.jpg") },
 */
export type Evento = { date: string; title: T; desc: T; img: string; time?: T };
export const upcoming: Evento[] = [];

export const recurring: { when: T; title: T; desc: T; img: string; cta: T; href: string }[] = [
  {
    when: ["Todos los días · 3:00 – 7:00 p.m.", "Every day · 3 – 7 pm"],
    title: ["Tardes en Insurgentes", "Afternoons at Insurgentes"],
    desc: ["Margarita o copa de espumante, con una boca de cortesía a elegir: ostras, croquetas, atún o tacos.",
      "A margarita or a glass of sparkling wine, with a complimentary bite of your choice: oysters, croquettes, tuna or tacos."],
    img: p("cocteles/cocteles-02_DbBiL7_ms6v.jpg"),
    cta: ["Reservá tu tarde", "Book your afternoon"], href: INFO.whatsapp,
  },
  {
    when: ["Lunes a viernes · 12:00 – 4:00 p.m.", "Monday – Friday · 12 – 4 pm"],
    title: ["Especiales del mediodía", "Weekday lunch specials"],
    desc: ["Bebida natural, entrada, plato fuerte y postre. Ideal para almuerzos de trabajo.",
      "Fresh drink, starter, main course and dessert. Made for business lunches."],
    img: p("platos/platos-17_De2Jtd7jvjU.jpg"),
    cta: ["Ver especiales", "See the specials"], href: "#carta-completa",
  },
];
