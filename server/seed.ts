import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { categories, products } from "../drizzle/schema";

const seedCategories = [
  { name: "Indumentaria", slug: "indumentaria", sortOrder: 1 },
  { name: "Accesorios", slug: "accesorios", sortOrder: 2 },
  { name: "UV & vinilo", slug: "uv-vinilo", sortOrder: 3 },
  { name: "Banderas", slug: "banderas", sortOrder: 4 },
];

const seedProducts = [
  ['Vaso Chopp Polímero',7500,'Accesorios','SI',11500,1,'VC'],
  ['Vaso Aluminio',7500,'Accesorios','NO',0,1,'VA'],
  ['Termo Hoppy Polímero',12000,'Accesorios','SI',15000,1,'TH'],
  ['Gorra Trucker',5500,'Accesorios','SI',7000,6,'GT'],
  ['Remera SPUM',10000,'Indumentaria','SI',15000,1,'RS'],
  ['Remera Algodón',16000,'Indumentaria','SI',28000,1,'RA'],
  ['Remera Deportiva',15000,'Indumentaria','SI',22000,7,'RD'],
  ['Chomba Deportiva',19000,'Indumentaria','SI',27750,10,'CD'],
  ['Stickers UV Individual',1500,'UV & vinilo','NO',0,1,'SU'],
  ['Plancha UV Chica',5000,'UV & vinilo','NO',0,1,'PU'],
  ['Plancha UV Grande',9000,'UV & vinilo','NO',0,1,'PG'],
  ['UV Personalizado 30 cm',20000,'UV & vinilo','SI',20000,1,'30'],
  ['UV Personalizado 50 cm',30000,'UV & vinilo','SI',30000,1,'50'],
  ['UV Metro x 1',45000,'UV & vinilo','SI',45000,1,'M1'],
  ['UV Metro x 3',40000,'UV & vinilo','SI',40000,3,'M3'],
  ['UV Metro x 5',35000,'UV & vinilo','SI',35000,5,'M5'],
  ['UV Metro x 10',30000,'UV & vinilo','SI',30000,10,'M10'],
  ['Vinilo Sublimado sin corte',6000,'UV & vinilo','SI',6000,1,'VS'],
  ['Vinilo Sublimado con corte',9000,'UV & vinilo','SI',9000,1,'VC'],
  ['Chomba de Algodón',25000,'Indumentaria','SI',35000,10,'CA'],
  ['Chomba de Piqué',25000,'Indumentaria','SI',35000,10,'CP'],
  ['Bandera 1.40 x 0.90',29500,'Banderas','SI',29500,1,'B1'],
  ['Bandera con soporte',55000,'Banderas','SI',55000,1,'BS'],
  ['Bombacha de campo',19500,'Indumentaria','SI',0,1,'BC'],
  ['Parche bordado',7500,'Accesorios','SI',7500,7,'PB'],
  ['Remera SPUM Sub completo',22000,'Indumentaria','SI',0,7,'SC'],
  ['Remera SPUM Promos',22000,'Indumentaria','SI',0,7,'PR']
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }
  const db = drizzle(process.env.DATABASE_URL);

  for (const cat of seedCategories) {
    const existing = await db.select().from(categories).where(eq(categories.slug, cat.slug)).limit(1);
    if (!existing.length) {
      await db.insert(categories).values(cat);
    }
  }

  const categoryRows = await db.select().from(categories);
  const categoryMap = new Map(categoryRows.map(c => [c.name, c.id]));

  for (const item of seedProducts) {
    const [name, priceBase, categoryName, customAllowed, priceCustom, minQuantity, sku] = item;
    const slug = slugify(name);
    const existing = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    const categoryId = categoryMap.get(categoryName) ?? null;
    const values = {
      name,
      slug,
      sku,
      categoryId,
      shortDescription: `Producto ${categoryName} de CASACAS LB.`,
      description: `Ficha oficial para ${name}. Mínimo sugerido: ${minQuantity} unidad(es).`,
      priceBase,
      priceCustom: priceCustom && priceCustom > 0 ? priceCustom : null,
      minQuantity,
      publicationStatus: "published" as const,
      availability: customAllowed === "SI" ? ("customizable" as const) : ("available" as const),
      sizes: categoryName === "Indumentaria" ? "S, M, L, XL, XXL" : null,
      isFeatured: ["Remera SPUM", "Chomba Deportiva", "Vaso Chopp Polímero", "Bandera 1.40 x 0.90"].includes(name),
      publishedAt: new Date(),
    };

    if (!existing.length) {
      await db.insert(products).values(values);
    } else {
      await db.update(products).set(values).where(eq(products.id, existing[0].id));
    }
  }

  console.log("SEED_COMPLETED");
}

run().catch(err => {
  console.error("SEED_FAILED", err);
  process.exit(1);
});
