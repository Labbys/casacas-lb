export type PrototypeProduct = {
  id: number;
  name: string;
  category: "Indumentaria" | "Accesorios" | "UV & vinilo" | "Banderas";
  priceBase: number;
  priceCustom: number | null;
  minQuantity: number;
  sku: string;
  customizable: boolean;
  shortDescription: string;
  description: string;
};

export const prototypeProducts: PrototypeProduct[] = [
  {
    id: 1,
    name: "Vaso Chopp Polímero",
    category: "Accesorios",
    priceBase: 7500,
    priceCustom: 11500,
    minQuantity: 1,
    sku: "VC",
    customizable: true,
    shortDescription: "Base resistente y liviana para eventos, promociones y regalos.",
    description: "Vaso chopp de polímero de alta resistencia, preparado para estampado full color con terminación brillante y durabilidad garantizada."
  },
  {
    id: 2,
    name: "Vaso Aluminio",
    category: "Accesorios",
    priceBase: 7500,
    priceCustom: null,
    minQuantity: 1,
    sku: "VA",
    customizable: false,
    shortDescription: "Aluminio anodizado térmico y liviano, ideal para uso diario.",
    description: "Vaso de aluminio con borde reforzado y excelente conservación de temperatura para bebidas frías."
  },
  {
    id: 3,
    name: "Termo Hoppy Polímero",
    category: "Accesorios",
    priceBase: 12000,
    priceCustom: 15000,
    minQuantity: 1,
    sku: "TH",
    customizable: true,
    shortDescription: "Botella deportiva con pico vertedor y agarre ergonómico.",
    description: "Termo hoppy para entrenamiento, viajes o el colegio, personalizable con escudos, nombres o logos de marcas."
  },
  {
    id: 4,
    name: "Gorra Trucker",
    category: "Accesorios",
    priceBase: 5500,
    priceCustom: 7000,
    minQuantity: 6,
    sku: "GT",
    customizable: true,
    shortDescription: "Frente acolchado y malla respirable para equipos y empresas.",
    description: "Gorra clásica trucker con broche regulable, lista para bordado o estampa frontal de alta definición."
  },
  {
    id: 5,
    name: "Remera SPUM",
    category: "Indumentaria",
    priceBase: 10000,
    priceCustom: 15000,
    minQuantity: 1,
    sku: "RS",
    customizable: true,
    shortDescription: "Tela suave con caída deportiva, apta para sublimación nítida.",
    description: "Remera clásica SPUM de tacto algodón, no encoge, no pierde color con los lavados y es perfecta para promociones y eventos."
  },
  {
    id: 6,
    name: "Remera Algodón",
    category: "Indumentaria",
    priceBase: 16000,
    priceCustom: 28000,
    minQuantity: 1,
    sku: "RA",
    customizable: true,
    shortDescription: "100% algodón peinado de textura pesada y cuello reforzado.",
    description: "Remera urbana de corte estándar, pensada para estampa DTF, vinilo textil o serigrafía de calidad premium."
  },
  {
    id: 7,
    name: "Remera Deportiva",
    category: "Indumentaria",
    priceBase: 15000,
    priceCustom: 22000,
    minQuantity: 7,
    sku: "RD",
    customizable: true,
    shortDescription: "Microfibra con respiración rápida para clubes y torneos.",
    description: "Indumentaria deportiva técnica con costuras reforzadas, secado express y ajuste cómodo para alta competencia."
  },
  {
    id: 8,
    name: "Chomba Deportiva",
    category: "Indumentaria",
    priceBase: 19000,
    priceCustom: 27750,
    minQuantity: 10,
    sku: "CD",
    customizable: true,
    shortDescription: "Elegancia y rendimiento en una sola prenda para equipos.",
    description: "Chomba deportiva sublimada con cuello tejido, cartera con botones y telas transpirables que soportan el uso intenso."
  },
  {
    id: 9,
    name: "Stickers UV Individual",
    category: "UV & vinilo",
    priceBase: 1500,
    priceCustom: null,
    minQuantity: 1,
    sku: "SU",
    customizable: false,
    shortDescription: "Adhesión extrema sobre plástico, metal, vidrio y superficies duras.",
    description: "Calco con relieve UV DTF de alta durabilidad, resistente al agua, rayos solares y raspaduras."
  },
  {
    id: 10,
    name: "Plancha UV Chica",
    category: "UV & vinilo",
    priceBase: 5000,
    priceCustom: null,
    minQuantity: 1,
    sku: "PU",
    customizable: false,
    shortDescription: "Surtido variado en formato compacto para personalización múltiple.",
    description: "Plancha de stickers UV con varios diseños listos para transferir con presión directa."
  },
  {
    id: 11,
    name: "Plancha UV Grande",
    category: "UV & vinilo",
    priceBase: 9000,
    priceCustom: null,
    minQuantity: 1,
    sku: "PG",
    customizable: false,
    shortDescription: "Formato extendido para kits completos de marcas y clubes.",
    description: "Plancha completa de transferencias UV con alta densidad de adhesivo e impresión nítida."
  },
  {
    id: 12,
    name: "UV Personalizado 30 cm",
    category: "UV & vinilo",
    priceBase: 20000,
    priceCustom: 20000,
    minQuantity: 1,
    sku: "30",
    customizable: true,
    shortDescription: "Tira personalizada de 30 cm de ancho con tus propios logos.",
    description: "Producción por metro lineal reducido para pruebas o producciones chicas con fondo transparente."
  },
  {
    id: 13,
    name: "UV Personalizado 50 cm",
    category: "UV & vinilo",
    priceBase: 30000,
    priceCustom: 30000,
    minQuantity: 1,
    sku: "50",
    customizable: true,
    shortDescription: "Tira personalizada de 50 cm lista para recortar y aplicar.",
    description: "Impresión UV DTF con barniz protector para personalizar termos, cascos, termos y artículos comerciales."
  },
  {
    id: 14,
    name: "UV Metro x 1",
    category: "UV & vinilo",
    priceBase: 45000,
    priceCustom: 45000,
    minQuantity: 1,
    sku: "M1",
    customizable: true,
    shortDescription: "Metro lineal completo para productores y revendedores.",
    description: "Un metro lineal de impresión UV continua con tintas elásticas y terminación con relieve táctil."
  },
  {
    id: 15,
    name: "UV Metro x 3",
    category: "UV & vinilo",
    priceBase: 40000,
    priceCustom: 40000,
    minQuantity: 3,
    sku: "M3",
    customizable: true,
    shortDescription: "Paquete por 3 metros con tarifa preferencial para marcas.",
    description: "Producción por volumen para packaging, merchandising y rotulación con entrega en bobina."
  },
  {
    id: 16,
    name: "UV Metro x 5",
    category: "UV & vinilo",
    priceBase: 35000,
    priceCustom: 35000,
    minQuantity: 5,
    sku: "M5",
    customizable: true,
    shortDescription: "Escala mayor para talleres, tiendas y clubes regionales.",
    description: "Impresión por volumen con control de color estricto y barniz brillante."
  },
  {
    id: 17,
    name: "UV Metro x 10",
    category: "UV & vinilo",
    priceBase: 30000,
    priceCustom: 30000,
    minQuantity: 10,
    sku: "M10",
    customizable: true,
    shortDescription: "La mejor relación costo/beneficio en transferencias UV.",
    description: "10 metros continuos con archivo armado por el cliente o asistido por CASACAS LB."
  },
  {
    id: 18,
    name: "Vinilo Sublimado sin corte",
    category: "UV & vinilo",
    priceBase: 6000,
    priceCustom: 6000,
    minQuantity: 1,
    sku: "VS",
    customizable: true,
    shortDescription: "Lámina sublimable corrida para aplicaciones continuas.",
    description: "Material para planchado o montaje directo sobre paneles y textiles."
  },
  {
    id: 19,
    name: "Vinilo Sublimado con corte",
    category: "UV & vinilo",
    priceBase: 9000,
    priceCustom: 9000,
    minQuantity: 1,
    sku: "VC2",
    customizable: true,
    shortDescription: "Corte perimetral exacto para números, siluetas y logos.",
    description: "Vinilo troquelado por plotter de precisión listo para transferir en prenda o accesorio."
  },
  {
    id: 20,
    name: "Chomba de Algodón",
    category: "Indumentaria",
    priceBase: 25000,
    priceCustom: 35000,
    minQuantity: 10,
    sku: "CA",
    customizable: true,
    shortDescription: "Corte clásico urbano con cuello camisa y tejido suave.",
    description: "Ideal para uniformes corporativos, staff de eventos y marcas que buscan una presencia formal."
  },
  {
    id: 21,
    name: "Chomba de Piqué",
    category: "Indumentaria",
    priceBase: 25000,
    priceCustom: 35000,
    minQuantity: 10,
    sku: "CP",
    customizable: true,
    shortDescription: "Tejido de piqué tradicional, fresco y de alta prestancia.",
    description: "Chomba institucional con puños reforzados y soporte para bordado directo o parche termosellado."
  },
  {
    id: 22,
    name: "Bandera 1.40 x 0.90",
    category: "Banderas",
    priceBase: 29500,
    priceCustom: 29500,
    minQuantity: 1,
    sku: "B1",
    customizable: true,
    shortDescription: "Tamaño tribuna o cancha con cinta de refuerzo y ojales.",
    description: "Tela náutica o tafeta pesada sublimada con colores intensos que resisten la intemperie."
  },
  {
    id: 23,
    name: "Bandera con soporte",
    category: "Banderas",
    priceBase: 5500,
    priceCustom: 55000,
    minQuantity: 1,
    sku: "BS",
    customizable: true,
    shortDescription: "Estructura portátil desmontable para eventos y exposiciones.",
    description: "Bandera tipo drop o vela con mástil flexible y base pesada para exterior o interior."
  },
  {
    id: 24,
    name: "Bombacha de campo",
    category: "Indumentaria",
    priceBase: 19500,
    priceCustom: null,
    minQuantity: 1,
    sku: "BC",
    customizable: true,
    shortDescription: "Confección tradicional chaqueña, resistente y cómoda para trabajo.",
    description: "Prenda de sarga reforzada con doble costura, botón metálico y tiro amplio para movilidad."
  },
  {
    id: 25,
    name: "Parche bordado",
    category: "Accesorios",
    priceBase: 7500,
    priceCustom: 7500,
    minQuantity: 7,
    sku: "PB",
    customizable: true,
    shortDescription: "Bordado con relieve y borde reforzado con termoadhesivo.",
    description: "Escudos, marcas o insignias listas para pegar con calor o coser en camperas, gorras y mochilas."
  },
  {
    id: 26,
    name: "Remera SPUM Sub completo",
    category: "Indumentaria",
    priceBase: 22000,
    priceCustom: null,
    minQuantity: 7,
    sku: "SC",
    customizable: true,
    shortDescription: "Sublimación frente, espalda y mangas con diseño 100% integral.",
    description: "Confección desde cero con corte y confección posterior al estampado para que no queden pliegues blancos."
  },
  {
    id: 27,
    name: "Remera SPUM Promos",
    category: "Indumentaria",
    priceBase: 22000,
    priceCustom: null,
    minQuantity: 7,
    sku: "PR",
    customizable: true,
    shortDescription: "Pensada para egresados, promociones escolares y peñas.",
    description: "Paquete especial para grupos con personalización de apodos, números y diseño grupal."
  }
];
