import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Archive, ArrowLeft, Check, Package, Pencil, Plus, Search, ShieldAlert, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const availabilityLabels = { available: "Disponible", customizable: "Personalizable", made_to_order: "Producción bajo pedido", check_stock: "Consultar stock", sold_out: "Agotado", coming_soon: "Próximamente" } as const;
const publicationLabels = { draft: "Borrador", published: "Publicado", archived: "Archivado" } as const;
type FormState = { name: string; slug: string; sku: string; categoryId: string; shortDescription: string; description: string; priceBase: string; priceCustom: string; minQuantity: string; publicationStatus: "draft" | "published" | "archived"; availability: keyof typeof availabilityLabels; sizes: string; colors: string; material: string; productionTime: string; isFeatured: boolean };
const emptyForm: FormState = { name: "", slug: "", sku: "", categoryId: "none", shortDescription: "", description: "", priceBase: "", priceCustom: "", minQuantity: "1", publicationStatus: "published", availability: "available", sizes: "", colors: "", material: "", productionTime: "", isFeatured: false };

function slugify(value: string) { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
function money(value: number | null) { return value == null ? "—" : `$ ${new Intl.NumberFormat("es-AR").format(value)}`; }

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published" | "archived">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const utils = trpc.useUtils();
  const authUser = trpc.auth.me.useQuery();
  const claimAdmin = trpc.auth.claimAdmin.useMutation({
    onSuccess: () => {
      toast.success("Rol administrador asignado correctamente");
      void utils.auth.me.invalidate();
      void utils.admin.products.invalidate();
      void utils.admin.categories.invalidate();
      void utils.admin.dashboard.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "No se pudo actualizar el rol");
    }
  });

  const products = trpc.admin.products.useQuery(
    {
      search: search || undefined,
      status: status === "all" ? undefined : status,
      categoryId: categoryFilter === "all" ? undefined : Number(categoryFilter),
    },
    { retry: 1 }
  );
  const categories = trpc.admin.categories.useQuery(undefined, { retry: 1 });

  const createProduct = trpc.admin.createProduct.useMutation({
    onSuccess: () => {
      toast.success("Producto creado con éxito");
      void utils.admin.products.invalidate();
      void utils.admin.dashboard.invalidate();
      void utils.catalog.products.invalidate();
      resetForm();
    },
    onError: (err) => {
      toast.error(err.message || "Error al crear el producto");
    }
  });

  const updateProduct = trpc.admin.updateProduct.useMutation({
    onSuccess: () => {
      toast.success("Producto actualizado con éxito");
      void utils.admin.products.invalidate();
      void utils.admin.dashboard.invalidate();
      void utils.catalog.products.invalidate();
      resetForm();
    },
    onError: (err) => {
      toast.error(err.message || "Error al actualizar el producto");
    }
  });

  const archiveProduct = trpc.admin.archiveProduct.useMutation({
    onSuccess: () => {
      toast.success("Producto archivado");
      void utils.admin.products.invalidate();
      void utils.admin.dashboard.invalidate();
      void utils.catalog.products.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Error al archivar el producto");
    }
  });

  const selectedProduct = useMemo(() => products.data?.find(product => product.id === editingId), [products.data, editingId]);
  useEffect(() => {
    if (!selectedProduct) return;
    setForm({
      name: selectedProduct.name,
      slug: selectedProduct.slug,
      sku: selectedProduct.sku ?? "",
      categoryId: selectedProduct.categoryId ? String(selectedProduct.categoryId) : "none",
      shortDescription: selectedProduct.shortDescription ?? "",
      description: selectedProduct.description ?? "",
      priceBase: String(selectedProduct.priceBase),
      priceCustom: selectedProduct.priceCustom == null ? "" : String(selectedProduct.priceCustom),
      minQuantity: String(selectedProduct.minQuantity),
      publicationStatus: selectedProduct.publicationStatus,
      availability: selectedProduct.availability,
      sizes: selectedProduct.sizes ?? "",
      colors: selectedProduct.colors ?? "",
      material: selectedProduct.material ?? "",
      productionTime: selectedProduct.productionTime ?? "",
      isFeatured: selectedProduct.isFeatured,
    });
  }, [selectedProduct]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(current => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const priceBaseNum = Number(form.priceBase);
    if (!form.name.trim()) {
      toast.error("El nombre del producto es obligatorio");
      return;
    }
    if (isNaN(priceBaseNum) || priceBaseNum < 0 || form.priceBase.trim() === "") {
      toast.error("Ingresá un precio base válido (número mayor o igual a 0)");
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      sku: form.sku.trim() || null,
      categoryId: form.categoryId === "none" ? null : Number(form.categoryId),
      shortDescription: form.shortDescription.trim() || null,
      description: form.description.trim() || null,
      priceBase: priceBaseNum,
      priceCustom: form.priceCustom.trim() ? Number(form.priceCustom) : null,
      minQuantity: Math.max(1, Number(form.minQuantity) || 1),
      publicationStatus: form.publicationStatus,
      availability: form.availability,
      sizes: form.sizes.trim() || null,
      colors: form.colors.trim() || null,
      material: form.material.trim() || null,
      productionTime: form.productionTime.trim() || null,
      isFeatured: form.isFeatured,
    };

    if (editingId) {
      updateProduct.mutate({ id: editingId, ...payload });
    } else {
      createProduct.mutate(payload);
    }
  }

  const isForbidden = products.error?.data?.code === "FORBIDDEN" || categories.error?.data?.code === "FORBIDDEN";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/admin" className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#81796e] transition hover:text-[#f33825]">
              <ArrowLeft className="h-4 w-4" /> Resumen
            </Link>
            <p className="casacas-kicker">CASACAS LB / CATÁLOGO</p>
            <h1 className="mt-3 font-display text-6xl leading-[.82] text-[#211f1c]">
              Tus<br /><span className="text-[#f33825]">productos.</span>
            </h1>
          </div>
          <Button onClick={() => { resetForm(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="gap-2 bg-[#f33825] text-white hover:bg-[#d92c1c]">
            <Plus className="h-4 w-4" /> Nuevo producto
          </Button>
        </header>

        {isForbidden && (
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-900 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 shrink-0 text-amber-700" />
              <div>
                <p className="font-bold">Permiso de administrador requerido</p>
                <p className="text-xs text-amber-800">Tu usuario actual ({authUser.data?.email || authUser.data?.name || "activo"}) figura con rol visitante. Hacé clic para activarle rol de administrador a tu cuenta.</p>
              </div>
            </div>
            <Button onClick={() => claimAdmin.mutate()} disabled={claimAdmin.isPending} className="bg-amber-800 text-white hover:bg-amber-900">
              {claimAdmin.isPending ? "Activando..." : "Asignar rol de admin a mi usuario"}
            </Button>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
          <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-[#d9d1c5] bg-[#f8f5ef] p-4 shadow-[0_12px_40px_rgba(40,34,27,.04)] sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e887f]" />
                <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar producto por nombre..." className="border-[#d9d1c5] bg-[#eee9df] pl-9" />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full border-[#d9d1c5] bg-[#eee9df] sm:w-44">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.data?.map(category => (
                    <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={value => setStatus(value as typeof status)}>
                <SelectTrigger className="w-full border-[#d9d1c5] bg-[#eee9df] sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="draft">Borradores</SelectItem>
                  <SelectItem value="published">Publicados</SelectItem>
                  <SelectItem value="archived">Archivados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {products.isLoading ? (
              <div className="rounded-2xl border border-[#d9d1c5] bg-[#f8f5ef] p-10 text-center text-sm text-[#81796e]">Cargando catálogo...</div>
            ) : products.error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                Error al cargar productos: {products.error.message}
              </div>
            ) : products.data?.length ? (
              <div className="grid gap-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#81796e]">Mostrando {products.data.length} producto(s)</div>
                {products.data.map(product => (
                  <Card key={product.id} className="rounded-2xl border-[#d9d1c5] bg-[#f8f5ef] p-4 shadow-none transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(40,34,27,.07)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[#d9d1c5] font-display text-3xl text-[#211f1c]">
                        {product.sku || product.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate font-semibold text-[#211f1c]">{product.name}</h2>
                          <Badge className={product.publicationStatus === "published" ? "bg-[#dff0df] text-[#286238]" : product.publicationStatus === "archived" ? "bg-[#e1ddd6] text-[#81796e]" : "bg-[#f6e7c4] text-[#765313]"}>
                            {publicationLabels[product.publicationStatus]}
                          </Badge>
                          {product.isFeatured && (
                            <Badge className="bg-[#f33825] text-white">Destacado</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-[#81796e]">{product.shortDescription || "Sin descripción corta"}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#211f1c]">
                          <span className="font-bold">{money(product.priceBase)}</span>
                          {product.priceCustom != null && <span>Personalizado: {money(product.priceCustom)}</span>}
                          <span className="text-[#81796e]">Mín. {product.minQuantity}</span>
                          <span className="text-[#81796e]">{availabilityLabels[product.availability]}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button variant="outline" size="icon" onClick={() => { setEditingId(product.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label={`Editar ${product.name}`} className="border-[#d9d1c5] hover:border-[#f33825] hover:text-[#f33825]">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {product.publicationStatus !== "archived" && (
                          <Button variant="outline" size="icon" onClick={() => archiveProduct.mutate({ id: product.id })} aria-label={`Archivar ${product.name}`} className="border-[#d9d1c5] hover:border-[#f33825] hover:text-[#f33825]">
                            <Archive className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-[#c9c0b4] bg-[#f8f5ef] p-12 text-center">
                <PackageIcon />
                <h2 className="mt-4 font-display text-4xl text-[#211f1c]">No se encontraron productos.</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#81796e]">Cambiá los filtros de búsqueda o creá uno nuevo desde el formulario.</p>
              </div>
            )}
          </section>

          <Card className="rounded-[24px] border-[#d9d1c5] bg-[#f8f5ef] p-5 shadow-[0_12px_40px_rgba(40,34,27,.05)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="casacas-kicker">{editingId ? "EDITAR" : "NUEVO"} / PRODUCTO</p>
                <h2 className="mt-2 font-display text-4xl leading-none text-[#211f1c]">
                  {editingId ? "Actualizar ficha" : "Cargar producto"}
                </h2>
              </div>
              {editingId && (
                <Button variant="ghost" size="icon" onClick={resetForm} aria-label="Cancelar edición">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="name">Nombre del producto *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={event => {
                    updateField("name", event.target.value);
                    if (!editingId && !form.slug) updateField("slug", slugify(event.target.value));
                  }}
                  placeholder="Ej. Remera SPUM"
                  className="mt-1.5 border-[#d9d1c5] bg-[#eee9df]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="priceBase">Precio base ($) *</Label>
                  <Input
                    id="priceBase"
                    type="number"
                    min="0"
                    step="100"
                    value={form.priceBase}
                    onChange={event => updateField("priceBase", event.target.value)}
                    placeholder="10000"
                    className="mt-1.5 border-[#d9d1c5] bg-[#eee9df]"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="priceCustom">Precio personalizado ($)</Label>
                  <Input
                    id="priceCustom"
                    type="number"
                    min="0"
                    step="100"
                    value={form.priceCustom}
                    onChange={event => updateField("priceCustom", event.target.value)}
                    placeholder="15000"
                    className="mt-1.5 border-[#d9d1c5] bg-[#eee9df]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Categoría</Label>
                  <Select value={form.categoryId} onValueChange={value => updateField("categoryId", value)}>
                    <SelectTrigger className="mt-1.5 border-[#d9d1c5] bg-[#eee9df]">
                      <SelectValue placeholder="Elegir categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin categoría</SelectItem>
                      {categories.data && categories.data.length > 0 ? (
                        categories.data.map(category => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="loading" disabled>Cargando categorías...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="minQuantity">Cantidad mínima</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    min="1"
                    value={form.minQuantity}
                    onChange={event => updateField("minQuantity", event.target.value)}
                    className="mt-1.5 border-[#d9d1c5] bg-[#eee9df]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Publicación</Label>
                  <Select value={form.publicationStatus} onValueChange={value => updateField("publicationStatus", value as FormState["publicationStatus"])}>
                    <SelectTrigger className="mt-1.5 border-[#d9d1c5] bg-[#eee9df]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="archived">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estado comercial</Label>
                  <Select value={form.availability} onValueChange={value => updateField("availability", value as FormState["availability"])}>
                    <SelectTrigger className="mt-1.5 border-[#d9d1c5] bg-[#eee9df]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(availabilityLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="sku">Código / Sigla (opcional)</Label>
                <Input
                  id="sku"
                  value={form.sku}
                  onChange={event => updateField("sku", event.target.value)}
                  placeholder="Ej. RS, VC, M1"
                  className="mt-1.5 border-[#d9d1c5] bg-[#eee9df]"
                />
              </div>

              <div>
                <Label htmlFor="shortDescription">Descripción corta</Label>
                <Input
                  id="shortDescription"
                  value={form.shortDescription}
                  onChange={event => updateField("shortDescription", event.target.value)}
                  placeholder="Texto que se muestra en la tarjeta del catálogo"
                  className="mt-1.5 border-[#d9d1c5] bg-[#eee9df]"
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción completa</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={event => updateField("description", event.target.value)}
                  placeholder="Detalles sobre materiales, personalización, estampas, demoras de entrega..."
                  className="mt-1.5 min-h-24 border-[#d9d1c5] bg-[#eee9df]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="sizes">Talles</Label>
                  <Input
                    id="sizes"
                    value={form.sizes}
                    onChange={event => updateField("sizes", event.target.value)}
                    placeholder="S, M, L, XL, XXL"
                    className="mt-1.5 border-[#d9d1c5] bg-[#eee9df]"
                  />
                </div>
                <div>
                  <Label htmlFor="colors">Colores</Label>
                  <Input
                    id="colors"
                    value={form.colors}
                    onChange={event => updateField("colors", event.target.value)}
                    placeholder="Negro, blanco, rojo"
                    className="mt-1.5 border-[#d9d1c5] bg-[#eee9df]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[#d9d1c5] bg-[#eee9df] p-3">
                <input
                  id="featured"
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={event => updateField("isFeatured", event.target.checked)}
                  className="h-4 w-4 accent-[#f33825]"
                />
                <Label htmlFor="featured" className="cursor-pointer text-xs">
                  Mostrar como producto destacado en la tienda
                </Label>
              </div>

              <Button
                type="submit"
                disabled={createProduct.isPending || updateProduct.isPending}
                className="w-full gap-2 bg-[#211f1c] text-white hover:bg-[#3a3732]"
              >
                <Check className="h-4 w-4" />
                {createProduct.isPending || updateProduct.isPending
                  ? "Guardando..."
                  : editingId
                  ? "Guardar cambios"
                  : "Crear producto"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function PackageIcon() {
  return (
    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eee9df] text-[#f33825]">
      <Package className="h-6 w-6" />
    </div>
  );
}
