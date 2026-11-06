/** Full menu, transcribed from insurgentes21.com/menu (Nov 2026). Prices in colones, tax and service included. */
export type MenuItem = { h?: string; n?: string; p?: string; d?: string; x?: string; sub?: boolean };
export const fullMenu: { id: string; title: [string, string]; notes: string[]; items: MenuItem[] }[] = [
 {
  "id": "ENTRADAS",
  "title": [
   "Entradas",
   "Starters"
  ],
  "notes": [],
  "items": [
   {
    "n": "Costra de queso con chicharrón",
    "p": "₡10 900",
    "d": "Crocante de queso relleno de guacamole y chicharrón de ribeye. Se sirve con salsa de chile pasilla."
   },
   {
    "n": "Cazuela de queso",
    "p": "₡8 900",
    "d": "Cazuela de queso fundido con relish de jalapeños y tomatillos por aparte. Servida con tortilla fresca."
   },
   {
    "h": "Adicionales"
   },
   {
    "n": "Hongos ostra",
    "p": "₡2 900",
    "sub": true
   },
   {
    "n": "Camarones",
    "p": "₡3 900",
    "sub": true
   },
   {
    "n": "Entraña",
    "p": "₡5 900",
    "sub": true
   },
   {
    "n": "Chorizo mexicano",
    "p": "₡3 900",
    "sub": true
   },
   {
    "n": "Carpaccio de salmón",
    "p": "₡9 900",
    "d": "Salmón noruego, cebolla morada, alcaparras, crutones, Grana Padano y arúgula, con vinagreta de limón y mostaza."
   },
   {
    "n": "Tiradito de pulpo",
    "p": "₡12 900",
    "d": "Pulpo al Josper, crema de jalapeño, aguacate, cebollas marinadas y polvo de aceitunas."
   },
   {
    "n": "Tostada de atún",
    "p": "₡8 900",
    "d": "Tartar de atún fresco con aderezo de miso sobre tortilla, guacamole y alcaparras fritas."
   },
   {
    "n": "Vuelve a la vida",
    "p": "₡13 900",
    "d": "Camarón, pulpo, scallops y mejillones en salsa de tomate especiada con cebollitas marinadas y aguacate."
   },
   {
    "n": "Aguachile de camarón",
    "p": "₡9 900",
    "d": "Camarones nacionales en caldo cítrico de chiles con culantro, pepino baby y aguacate."
   }
  ]
 },
 {
  "id": "MOLCAJETE",
  "title": [
   "Molcajete",
   "Molcajete"
  ],
  "notes": [],
  "items": [
   {
    "n": "Guacamole individual",
    "p": "₡4 900",
    "d": "Molcajete de piedra con aguacate, tomate fresco, cebolla, chiles y limón. Con totopos."
   },
   {
    "h": "Adicionales"
   },
   {
    "n": "Chicharrón de ribeye",
    "p": "₡7 500",
    "sub": true
   },
   {
    "n": "Chicharrón de costra",
    "p": "₡2 900",
    "sub": true
   },
   {
    "n": "Chistorra",
    "p": "₡3 500",
    "sub": true
   },
   {
    "n": "Pulpo",
    "p": "₡7 500",
    "sub": true
   },
   {
    "n": "Camarones",
    "p": "₡5 900",
    "sub": true
   },
   {
    "n": "Guacamole para compartir",
    "p": "₡8 900",
    "d": "Servido en mesa, con la misma preparación. Con totopos."
   },
   {
    "h": "Adicionales"
   },
   {
    "n": "Chicharrón de ribeye",
    "p": "₡7 500",
    "sub": true
   },
   {
    "n": "Chicharrón de costra",
    "p": "₡2 900",
    "sub": true
   },
   {
    "n": "Chistorra",
    "p": "₡3 500",
    "sub": true
   },
   {
    "n": "Pulpo",
    "p": "₡7 500",
    "sub": true
   },
   {
    "n": "Camarones",
    "p": "₡5 900",
    "sub": true
   }
  ]
 },
 {
  "id": "ENSALADAS",
  "title": [
   "Ensaladas",
   "Salads"
  ],
  "notes": [],
  "items": [
   {
    "n": "Ensalada Wedge",
    "p": "₡6 900",
    "d": "Lechuga iceberg con cremosa salsa de queso azul, nueces, tocineta crujiente y tomates cherry."
   },
   {
    "n": "Ensalada de burrata",
    "p": "₡10 900",
    "d": "Melocotón al Josper, arúgula, marañón, Grana Padano y vinagreta balsámica."
   },
   {
    "h": "Adicionales"
   },
   {
    "n": "Salmón ahumado",
    "p": "₡3 900",
    "sub": true
   },
   {
    "n": "Jamón serrano",
    "p": "₡3 900",
    "sub": true
   },
   {
    "n": "Ensalada César",
    "d": "Lechuga romana con aderezo césar, crutones y Grana Padano, con la proteína a elección."
   },
   {
    "h": "Proteína a elección"
   },
   {
    "n": "Aguacate",
    "p": "₡7 500",
    "sub": true
   },
   {
    "n": "Pollo",
    "p": "₡7 900",
    "sub": true
   },
   {
    "n": "Camarones",
    "p": "₡10 900",
    "sub": true
   },
   {
    "n": "Pulpo",
    "p": "₡12 900",
    "sub": true
   }
  ]
 },
 {
  "id": "SOPAS",
  "title": [
   "Sopas",
   "Soups"
  ],
  "notes": [],
  "items": [
   {
    "n": "Sopa de tortilla",
    "p": "₡7 500",
    "d": "Tomates rostizados al Josper, pollo, aguacate, natilla, queso y tortilla crocante."
   },
   {
    "n": "Caldo de piedra",
    "p": "₡10 900",
    "d": "Sopa ancestral de mariscos con camarón, pulpo, mejillones y corvina. Con chileros de la casa y pico de gallo."
   },
   {
    "n": "Caldo de birria",
    "p": "₡8 200",
    "d": "Birria asada por más de 4 horas, jugo de cocción y chiles asados al Josper. Salsa picante por aparte."
   }
  ]
 },
 {
  "id": "PRINCIPALES",
  "title": [
   "Principales",
   "Mains"
  ],
  "notes": [],
  "items": [
   {
    "n": "Coliflor al Josper",
    "p": "₡8 900",
    "d": "Coliflor a las brasas en salsa macha sobre una cama de pipián verde."
   },
   {
    "n": "Fettuccine achipotlado",
    "p": "₡11 900",
    "d": "Pasta larga de sémola de trigo en cremosa salsa de chipotle, picante medio, con hongos ostra de cultivo nacional."
   },
   {
    "n": "Corvina a la plancha",
    "p": "₡16 900",
    "x": "200 g",
    "d": "Corvina reina en salsa de chiles de temporada tatemados y salteado de hongos en salsa macha."
   },
   {
    "n": "Camarones jumbo a la diabla",
    "p": "₡18 900",
    "d": "En molcajete, con salsa de chile ancho y guajillo. Con cabello de ángel, aguacate y pico de gallo."
   },
   {
    "n": "Pollo al mole",
    "p": "₡11 900",
    "d": "Contramuslo de pollo en mole poblano, con vegetales a las brasas y romesco de ajonjolí y chile ancho."
   },
   {
    "n": "Enmoladas de res",
    "p": "₡16 900",
    "d": "Costilla de res Angus, mole de pipián, ajonjolí tostado, queso fresco y natilla."
   },
   {
    "n": "Short rib Wagyu",
    "p": "₡22 900",
    "d": "Braseado lentamente por más de 4 horas y glaseado en su propia demi-glace."
   },
   {
    "n": "Mar y tierra",
    "p": "₡24 900",
    "d": "Lomito al Josper y camarones jumbo a la plancha, glaseados con mantequilla de especias de la casa y jugo de res casero."
   },
   {
    "n": "Cheeseburger Wagyu",
    "p": "₡11 900",
    "d": "Torta Wagyu al Josper, provolone, cebolla caramelizada con tocineta y salsa de la casa. Con papas a la francesa."
   },
   {
    "n": "Hamburguesa mexicana",
    "p": "₡9 900",
    "d": "Pan de masa madre, torta Angus USDA al Josper, guacamole, Pepper Jack fundido y salsa chipotle. Con papas a la francesa."
   }
  ]
 },
 {
  "id": "BRASA VIVA AL JOSPER",
  "title": [
   "Brasa viva al josper",
   "Josper live fire"
  ],
  "notes": [
   "Todos los cortes son seleccionados y certificados USDA."
  ],
  "items": [
   {
    "n": "Hanger steak Prime",
    "p": "₡18 900",
    "x": "300 g"
   },
   {
    "n": "RibEye steak Choice",
    "p": "₡34 900",
    "x": "450 g"
   },
   {
    "n": "Lomito Choice",
    "p": "₡18 900",
    "x": "300 g"
   },
   {
    "n": "Lomito «Toreado»",
    "p": "₡19 900",
    "x": "300 g"
   },
   {
    "n": "Lomito de la casa",
    "p": "₡23 900",
    "x": "300 g",
    "d": "Salsa de pimienta verde, tuétano y tortillas de maíz."
   },
   {
    "n": "Entraña Choice",
    "p": "₡23 900",
    "x": "300 g"
   },
   {
    "n": "Porterhouse Choice",
    "p": "₡63 900",
    "x": "1000 g"
   },
   {
    "n": "Picaña Prime",
    "p": "₡18 900",
    "x": "300 g"
   },
   {
    "n": "Pargo zarandeado",
    "p": "₡25 900",
    "x": "700 g",
    "d": "Corte mariposa marinado con salsa macha y hierbas aromáticas. Con ensalada cítrica de alcaparras y aguacate y orden de tortillas."
   },
   {
    "n": "Pulpo zarandeado",
    "p": "₡19 900",
    "d": "Marinado con salsa macha y hierbas aromáticas. Con vegetales a las brasas y romesco de ajonjolí y chile ancho."
   },
   {
    "n": "Parrillada Insurgentes 21",
    "p": "₡69 000",
    "x": "2 a 3 personas",
    "d": "Entraña, picaña, pulpo al Josper, camarones jumbo y vegetales a las brasas. Con tabla de picaduras."
   },
   {
    "n": "Parrillada Gran Selección",
    "p": "₡89 000",
    "x": "4 a 5 personas",
    "d": "Hanger, entraña y picaña, selección de salchichas y camarones jumbo. Con papa asada, cazuela de queso y tabla de picaduras con tortillas de maíz."
   }
  ]
 },
 {
  "id": "SALSAS",
  "title": [
   "Salsas",
   "Sauces"
  ],
  "notes": [
   "Por unidad, ₡1 900."
  ],
  "items": [
   {
    "n": "Mantequilla con trufa",
    "p": "₡1 900"
   },
   {
    "n": "Gorgonzola",
    "p": "₡1 900"
   },
   {
    "n": "Café París",
    "p": "₡1 900"
   },
   {
    "n": "Pimienta verde",
    "p": "₡1 900"
   },
   {
    "n": "Hongos",
    "p": "₡1 900"
   },
   {
    "n": "Chimichurri",
    "p": "₡1 900"
   }
  ]
 },
 {
  "id": "GUARNICIONES",
  "title": [
   "Guarniciones",
   "Sides"
  ],
  "notes": [],
  "items": [
   {
    "n": "Chile relleno de birria gratinado al Josper",
    "p": "₡8 900"
   },
   {
    "n": "Esquites de la casa",
    "p": "₡3 900"
   },
   {
    "n": "Ribs de elote con guajillo, cajún y Grana Padano",
    "p": "₡5 900"
   },
   {
    "n": "Risotto de hongo portobello con trufa",
    "p": "₡8 900"
   },
   {
    "n": "Risotto de aguacate",
    "p": "₡6 900"
   },
   {
    "n": "Risotto de chile guajillo",
    "p": "₡7 900"
   },
   {
    "n": "Papas a la francesa",
    "p": "₡2 900"
   },
   {
    "n": "Papas trufadas con Grana Padano",
    "p": "₡3 900"
   },
   {
    "n": "Espárragos al grill",
    "p": "₡5 500"
   },
   {
    "n": "Vegetales al balsámico",
    "p": "₡4 900"
   },
   {
    "n": "Vegetales a las brasas con romesco de ajonjolí y chile ancho",
    "p": "₡5 900"
   },
   {
    "n": "Tuétano al Josper",
    "p": "₡4 900"
   },
   {
    "n": "Cazuela de chorizo argentino",
    "p": "₡3 900"
   },
   {
    "n": "Cazuela de chorizo criollo",
    "p": "₡3 900"
   },
   {
    "n": "Cazuela de chistorra",
    "p": "₡3 900"
   },
   {
    "n": "Cazuela de morcilla de Burgos",
    "p": "₡3 900"
   },
   {
    "n": "Puré de papa gratinado",
    "p": "₡3 900"
   },
   {
    "n": "Mac & cheese gratinado con tocineta crujiente",
    "p": "₡4 900"
   },
   {
    "n": "Papa asada al Josper con salsa de queso y tocineta crujiente",
    "p": "₡5 900"
   },
   {
    "n": "Camote asado al Josper con salsa de queso y tocineta crujiente",
    "p": "₡5 900"
   }
  ]
 },
 {
  "id": "TACOS DE LA CASA",
  "title": [
   "Tacos de la casa",
   "House tacos"
  ],
  "notes": [
   "Órdenes de 3 unidades."
  ],
  "items": [
   {
    "n": "Tacos gobernador",
    "p": "₡10 900",
    "d": "Tortilla de la casa rellena de queso con camarones ahumados, aguacate y mayonesa de chipotle."
   },
   {
    "n": "Tacos de lomo de entraña",
    "p": "₡10 900",
    "d": "Tortilla casera, frijoles molidos de la casa, cebolla morada y mayonesa de chimichurri. Con chicharrones de concha."
   },
   {
    "n": "Tacos de asado de tira",
    "p": "₡10 900",
    "d": "Asado de tira braseado por 4 horas en demi-glace, con cebollas encurtidas y pico de gallo."
   },
   {
    "n": "Tacos quesobirria",
    "p": "₡9 900",
    "d": "Tacos crocantes de maíz, carne de birria, queso fundido y aguacate. Con su propio jugo."
   },
   {
    "n": "Tacos de corvina",
    "p": "₡9 900",
    "d": "Corvina reina con guacamole, pico de gallo de piña y cebollitas marinadas."
   },
   {
    "n": "Tacos de pulpo ahumado",
    "p": "₡10 900",
    "d": "Tortilla de maíz con queso, aguacate fresco, pulpo asado y salsa macha."
   },
   {
    "n": "Tacos de lengua",
    "p": "₡10 900",
    "d": "Lengua de res a la plancha, cebolla morada, culantro y salsa verde de la casa."
   },
   {
    "n": "Tacos de lomito suizo",
    "p": "₡9 900",
    "d": "Lomito USDA, mozzarella fundida y crujiente de papa. Jalapeños y tomatillos tatemados por aparte."
   }
  ]
 },
 {
  "id": "MENÚ DE NIÑOS",
  "title": [
   "Menú de niños",
   "Kids' menu"
  ],
  "notes": [],
  "items": [
   {
    "n": "Pechuga de pollo",
    "p": "₡5 900",
    "d": "A la plancha con aceite de oliva. Con papas a la francesa."
   },
   {
    "n": "Spaguetti de queso y pollo",
    "p": "₡7 500",
    "d": "Pasta en salsa de queso de la casa con pollo a la plancha."
   },
   {
    "n": "Hamburguesa con queso y papas fritas",
    "p": "₡7 900",
    "d": "Torta Angus con lechuga, tomate y queso fundido. Con papas a la francesa."
   },
   {
    "n": "Dedos de pollo",
    "p": "₡5 900",
    "d": "Pollo empanizado y frito con papas a la francesa."
   }
  ]
 },
 {
  "id": "ESPECIALES DE LA CASA",
  "title": [
   "Especiales de la casa",
   "House specials"
  ],
  "notes": [
   "Lunes a viernes, de 12:00 md a 4:00 p. m. Incluye bebida natural, entrada, plato fuerte y postre.",
   "Entrada: sopa o ensalada del día. Postre a escoger: cheesecake, mousse de chocolate o arroz al tequila.",
   "Gaseosa +₡1 000 · cerveza nacional +₡1 900 · vino de la casa +₡3 900."
  ],
  "items": [
   {
    "n": "Tacos de corvina con guacamole",
    "p": "₡10 900"
   },
   {
    "n": "Tacos de cochinita pibil",
    "p": "₡8 900"
   },
   {
    "n": "Tacos de lomito suizo (almuerzo)",
    "p": "₡11 900"
   },
   {
    "n": "Estación de pasta de la casa",
    "d": "Pasta bucatini, cabello de ángel o fettuccine; salsa pomodoro chipotle, pesto de culantro, salsa de queso o especial de jalapeño. Con la proteína a elección."
   },
   {
    "h": "Proteína a elección"
   },
   {
    "n": "Filet de pollo a la plancha",
    "p": "₡8 900",
    "sub": true
   },
   {
    "n": "Hongos zarandeados",
    "p": "₡10 900",
    "sub": true
   },
   {
    "n": "Corvina zarandeada",
    "p": "₡11 900",
    "sub": true
   },
   {
    "n": "Lomo de entraña al Josper",
    "p": "₡9 900",
    "sub": true
   },
   {
    "n": "Hamburguesa mexicana (almuerzo)",
    "p": "₡10 900",
    "d": "Pan pretzel, torta Angus USDA, guacamole, queso fundido y salsa chipotle. Con papas a la francesa."
   },
   {
    "n": "Molcajete de birria gratinada",
    "p": "₡9 900",
    "d": "Birria gratinada, arroz mexicano, frijoles, tortilla fresca y pico de gallo."
   }
  ]
 }
];
