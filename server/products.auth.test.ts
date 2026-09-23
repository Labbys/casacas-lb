import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(role: "user" | "admin"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 9,
    openId: `test-${role}`,
    email: `${role}@example.com`,
    name: role === "admin" ? "Admin" : "Visitor",
    loginMethod: "test",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as TrpcContext["res"],
  };
}

describe("admin product authorization", () => {
  it("rejects product listing for a regular user", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.admin.products()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("rejects product creation for a regular user", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.admin.createProduct({
      name: "Producto de prueba",
      slug: "producto-de-prueba",
      priceBase: 1000,
      minQuantity: 1,
      publicationStatus: "draft",
      availability: "available",
      isFeatured: false,
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
