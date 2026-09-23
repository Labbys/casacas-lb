import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  archiveProduct,
  createProduct,
  getProductSummary,
  listCategories,
  listProducts,
  updateProduct,
} from "./db";

const productInput = z.object({
  name: z.string().min(2).max(180),
  slug: z.string().min(2).max(200),
  sku: z.string().max(80).optional().nullable(),
  categoryId: z.number().int().positive().optional().nullable(),
  shortDescription: z.string().max(255).optional().nullable(),
  description: z.string().optional().nullable(),
  priceBase: z.number().int().nonnegative(),
  priceCustom: z.number().int().nonnegative().optional().nullable(),
  minQuantity: z.number().int().positive().default(1),
  publicationStatus: z.enum(["draft", "published", "archived"]).default("draft"),
  availability: z.enum(["available", "customizable", "made_to_order", "check_stock", "sold_out", "coming_soon"]).default("available"),
  sizes: z.string().optional().nullable(),
  colors: z.string().optional().nullable(),
  material: z.string().max(160).optional().nullable(),
  productionTime: z.string().max(160).optional().nullable(),
  isFeatured: z.boolean().default(false),
});

const productUpdate = productInput.partial().extend({ id: z.number().int().positive() });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    categories: publicProcedure.query(() => listCategories()),
    products: publicProcedure
      .input(z.object({ search: z.string().optional() }).optional())
      .query(({ input }) => listProducts({ status: "published", search: input?.search })),
  }),
  admin: router({
    dashboard: adminProcedure.query(async () => ({
      products: await getProductSummary(),
      categories: (await listCategories()).length,
    })),
    categories: adminProcedure.query(() => listCategories()),
    products: adminProcedure
      .input(z.object({ status: z.enum(["draft", "published", "archived"]).optional(), search: z.string().optional() }).optional())
      .query(({ input }) => listProducts(input)),
    createProduct: adminProcedure.input(productInput).mutation(({ input }) => createProduct(input)),
    updateProduct: adminProcedure.input(productUpdate).mutation(({ input }) => {
      const { id, ...values } = input;
      return updateProduct(id, values);
    }),
    archiveProduct: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => archiveProduct(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
