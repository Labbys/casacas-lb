import { and, asc, desc, eq, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  categories,
  InsertProduct,
  InsertUser,
  products,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }

  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) {
    values.role = user.role ?? "admin";
    updateSet.role = values.role;
  }

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.sortOrder), asc(categories.name));
}

export async function listProducts(options?: { status?: "draft" | "published" | "archived"; search?: string }) {
  const db = await getDb();
  if (!db) return [];
  const filters = [];
  if (options?.status) filters.push(eq(products.publicationStatus, options.status));
  if (options?.search) filters.push(like(products.name, `%${options.search}%`));
  return db.select().from(products).where(filters.length ? and(...filters) : undefined).orderBy(desc(products.isFeatured), desc(products.updatedAt));
}

export async function getProductSummary() {
  const db = await getDb();
  if (!db) return { total: 0, published: 0, drafts: 0, archived: 0 };
  const rows = await db
    .select({ status: products.publicationStatus, count: sql<number>`count(*)` })
    .from(products)
    .groupBy(products.publicationStatus);
  const summary = { total: 0, published: 0, drafts: 0, archived: 0 };
  for (const row of rows) {
    const count = Number(row.count);
    summary.total += count;
    if (row.status === "published") summary.published = count;
    if (row.status === "draft") summary.drafts = count;
    if (row.status === "archived") summary.archived = count;
  }
  return summary;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(products).values(product);
  return Number(result[0].insertId);
}

export async function updateProduct(id: number, values: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(products).set(values).where(eq(products.id, id));
}

export async function archiveProduct(id: number) {
  return updateProduct(id, { publicationStatus: "archived" });
}
