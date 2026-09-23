import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  sku: varchar("sku", { length: 80 }),
  categoryId: int("categoryId").references(() => categories.id),
  shortDescription: varchar("shortDescription", { length: 255 }),
  description: text("description"),
  priceBase: int("priceBase").notNull(),
  priceCustom: int("priceCustom"),
  minQuantity: int("minQuantity").default(1).notNull(),
  publicationStatus: mysqlEnum("publicationStatus", ["draft", "published", "archived"])
    .default("draft")
    .notNull(),
  availability: mysqlEnum("availability", [
    "available",
    "customizable",
    "made_to_order",
    "check_stock",
    "sold_out",
    "coming_soon",
  ])
    .default("available")
    .notNull(),
  sizes: text("sizes"),
  colors: text("colors"),
  material: varchar("material", { length: 160 }),
  productionTime: varchar("productionTime", { length: 160 }),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export const productImages = mysqlTable("productImages", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId")
    .notNull()
    .references(() => products.id),
  url: text("url").notNull(),
  storageKey: text("storageKey").notNull(),
  altText: varchar("altText", { length: 255 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  isPrimary: boolean("isPrimary").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  quote: text("quote").notNull(),
  authorName: varchar("authorName", { length: 120 }).notNull(),
  authorType: varchar("authorType", { length: 120 }),
  rating: int("rating").default(5).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const businessSettings = mysqlTable("businessSettings", {
  id: int("id").primaryKey().default(1),
  businessName: varchar("businessName", { length: 160 }).notNull(),
  instagramHandle: varchar("instagramHandle", { length: 120 }).notNull(),
  whatsappNumber: varchar("whatsappNumber", { length: 40 }).notNull(),
  contactName: varchar("contactName", { length: 120 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  hours: text("hours").notNull(),
  mapsUrl: text("mapsUrl"),
  heroEyebrow: varchar("heroEyebrow", { length: 160 }).notNull(),
  heroTitle: varchar("heroTitle", { length: 200 }).notNull(),
  heroSubtitle: text("heroSubtitle").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;
export type BusinessSettings = typeof businessSettings.$inferSelect;
export type InsertBusinessSettings = typeof businessSettings.$inferInsert;
