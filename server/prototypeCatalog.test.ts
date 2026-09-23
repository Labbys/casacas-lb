import { describe, expect, it } from "vitest";
import { prototypeProducts } from "../client/src/prototypeCatalog";

describe("CASACAS LB design prototype catalog", () => {
  it("keeps the stable sample catalog complete and categorized", () => {
    expect(prototypeProducts).toHaveLength(27);
    expect(new Set(prototypeProducts.map(product => product.category))).toEqual(
      new Set(["Indumentaria", "Accesorios", "UV & vinilo", "Banderas"]),
    );
  });

  it("has valid product management fields for the admin templates", () => {
    const ids = prototypeProducts.map(product => product.id);
    const skus = prototypeProducts.map(product => product.sku);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(skus).size).toBe(skus.length);
    expect(prototypeProducts.every(product => product.name.length > 0)).toBe(true);
    expect(prototypeProducts.every(product => product.priceBase > 0)).toBe(true);
    expect(prototypeProducts.every(product => product.minQuantity >= 1)).toBe(true);
    expect(prototypeProducts.every(product => product.shortDescription.length > 0)).toBe(true);
  });
});
