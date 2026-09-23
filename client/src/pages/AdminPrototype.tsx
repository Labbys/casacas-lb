import { useMemo, useState } from "react";
import {
  Archive,
  ArrowLeft,
  BarChart3,
  Check,
  ChevronDown,
  ChevronLeft,
  Edit3,
  FolderOpen,
  GripVertical,
  ImagePlus,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Save,
  Search,
  Settings2,
  ShoppingBag,
  Tag,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { prototypeProducts, PrototypeProduct } from "../prototypeCatalog";
import "../prototype.css";
import "../adminPrototype.css";

type AdminScreen = "overview" | "products" | "editor" | "categories";
type PublicationStatus = "Publicado" | "Borrador" | "Archivado";

type AdminProduct = PrototypeProduct & {
  status: PublicationStatus;
  updated: string;
  featured: boolean;
};

const adminProducts: AdminProduct[] = prototypeProducts.map((product, index) => ({
  ...product,
  status: index === 8 || index === 21 ? "Borrador" : "Publicado",
  updated: index % 3 === 0 ? "Hoy, 11:42" : index % 3 === 1 ? "Ayer, 16:20" : "18 sep. 2026",
  featured: [1, 5, 8, 22].includes(product.id),
}));

const categories = [
  { name: "Indumentaria", slug: "indumentaria", products: 10, status: "Activa", note: "Prendas deportivas, remeras y chombas." },
  { name: "Accesorios", slug: "accesorios", products: 6, status: "Activa", note: "Vasos, gorras, parches y artículos." },
  { name: "UV & vinilo", slug: "uv-vinilo", products: 9, status: "Activa", note: "Stickers, planchas, metros y vinilo." },
  { name: "Banderas", slug: "banderas", products: 2, status: "Activa", note: "Banderas para tribuna, local y eventos." },
];

const statusClass = (status: PublicationStatus) => status === "Publicado" ? "published" : status === "Borrador" ? "draft" : "archived";
const money = (value: number) => `$ ${new Intl.NumberFormat("es-AR").format(value)}`;

function Sidebar({ screen, setScreen, open, onClose }: { screen: AdminScreen; setScreen: (screen: AdminScreen) => void; open: boolean; onClose: () => void }) {
  const items: Array<{ id: AdminScreen; label: string; icon: typeof LayoutDashboard }> = [
    { id: "overview", label: "Resumen", icon: LayoutDashboard },
    { id: "products", label: "Productos", icon: Package },
    { id: "categories", label: "Categorías", icon: Tag },
  ];
  return (
    <aside className={`admin-sidebar ${open ? "open" : ""}`}>
      <div className="admin-brand">
        <img src="/media/logo-casacas-original-blanco-rojo.png" alt="CASACAS LB" />
        <div><small>Admin</small></div>
      </div>
      <nav className="admin-nav" aria-label="Navegación del panel">
        <span className="admin-nav-label">Gestión</span>
        {items.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={screen === item.id ? "active" : ""} onClick={() => { setScreen(item.id); onClose(); }}>
              <Icon /> {item.label}
            </button>
          );
        })}
        <span className="admin-nav-label">Configuración</span>
        <button onClick={() => { setScreen("editor"); onClose(); }} className={screen === "editor" ? "active" : ""}><Settings2 /> Información del negocio</button>
        <button onClick={() => { setScreen("products"); onClose(); }}><BarChart3 /> Reportes</button>
      </nav>
      <div className="admin-sidebar-footer">
        <span className="admin-kicker">Sesión activa</span>
        <p>Diseño de panel listo para conectar con base de datos, autenticación y almacenamiento.</p>
      </div>
    </aside>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button className="admin-mobile-menu" onClick={onMenu} aria-label="Abrir navegación del panel"><Menu size={17} /></button>
        <span className="admin-topbar-title">CASACAS LB <span>/ PANEL DE ADMINISTRACIÓN</span></span>
      </div>
      <div className="admin-topbar-actions">
        <a href="/" className="admin-preview-link"><ArrowLeft size={13} /> Ver tienda</a>
        <div className="admin-user-pill">
          <div className="admin-avatar">RL</div>
          <div><strong>Randi Viros</strong><small>Administrador</small></div>
        </div>
      </div>
    </header>
  );
}

function PageHead({ eyebrow, title, copy, action }: { eyebrow: string; title: React.ReactNode; copy?: string; action?: React.ReactNode }) {
  return (
    <div className="admin-page-head">
      <div><p className="admin-kicker">{eyebrow}</p><h1>{title}</h1></div>
      <div>{copy && <p>{copy}</p>}{action}</div>
    </div>
  );
}

function Overview({ goTo }: { goTo: (screen: AdminScreen) => void }) {
  return (
    <>
      <PageHead
        eyebrow="CASACAS LB / RESUMEN"
        title={<>Tu tienda.<br /><em>Bajo control.</em></>}
        copy="Una vista rápida del catálogo, los estados de publicación y las tareas que requieren atención."
        action={<button className="admin-primary-btn" onClick={() => goTo("editor")}><Plus size={15} /> Nuevo producto</button>}
      />
      <div className="admin-metric-grid">
        <div className="admin-metric-card"><span className="admin-metric-label">Productos totales</span><strong className="admin-metric-value">27</strong><span className="admin-metric-note">+3 este mes</span></div>
        <div className="admin-metric-card"><span className="admin-metric-label">Publicados</span><strong className="admin-metric-value">25</strong><span className="admin-metric-note">Visibles en la tienda</span></div>
        <div className="admin-metric-card"><span className="admin-metric-label">Borradores</span><strong className="admin-metric-value">02</strong><span className="admin-metric-note">Esperan revisión</span></div>
        <div className="admin-metric-card"><span className="admin-metric-label">Categorías</span><strong className="admin-metric-value">04</strong><span className="admin-metric-note">Todas activas</span></div>
      </div>
      <div className="admin-kpi-layout">
        <section className="admin-panel-card">
          <div className="admin-panel-head"><div><span className="admin-kicker">ACTIVIDAD RECIENTE</span><h2>Últimos cambios</h2></div><button className="admin-outline-btn" onClick={() => goTo("products")}>Ver todos <ChevronDown size={13} /></button></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Producto</th><th>Estado</th><th>Actualizado</th><th></th></tr></thead><tbody>{adminProducts.slice(0, 5).map(product => <tr key={product.id}><td><div className="admin-product-cell"><span className="admin-product-thumb">{product.sku}</span><div><strong>{product.name}</strong><small>{product.category}</small></div></div></td><td><span className={`admin-status-badge ${statusClass(product.status)}`}><span className="admin-status-dot"></span>{product.status}</span></td><td>{product.updated}</td><td><button className="admin-icon-button" onClick={() => goTo("editor")} aria-label={`Editar ${product.name}`}><Edit3 size={14} /></button></td></tr>)}</tbody></table></div>
        </section>
        <section className="admin-panel-card">
          <div className="admin-panel-head"><div><span className="admin-kicker">CENTRO DE ATENCIÓN</span><h2>Estado del catálogo</h2></div></div>
          <div className="admin-quick-list">
            <div className="admin-quick-row"><span><i className="admin-status-dot"></i> Productos publicados</span><strong>25 / 27</strong></div>
            <div className="admin-quick-row"><span><i className="admin-status-dot warning"></i> Sin imagen de portada</span><strong>8</strong></div>
            <div className="admin-quick-row"><span><i className="admin-status-dot danger"></i> Revisión pendiente</span><strong>2</strong></div>
            <div className="admin-quick-row"><span><i className="admin-status-dot"></i> Categorías activas</span><strong>4 / 4</strong></div>
          </div>
          <button className="admin-secondary-btn" style={{ marginTop: 20 }} onClick={() => goTo("products")}><ShoppingBag size={14} /> Revisar catálogo</button>
        </section>
      </div>
      <section className="admin-panel-card" style={{ marginTop: 16 }}>
        <div className="admin-panel-head"><div><span className="admin-kicker">ACCESOS RÁPIDOS</span><h2>Lo que podés hacer ahora</h2></div></div>
        <div className="admin-quick-list" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <button className="admin-outline-btn" style={{ justifyContent: "space-between" }} onClick={() => goTo("editor")}>Cargar producto <Plus size={14} /></button>
          <button className="admin-outline-btn" style={{ justifyContent: "space-between" }} onClick={() => goTo("categories")}>Ordenar categorías <GripVertical size={14} /></button>
          <button className="admin-outline-btn" style={{ justifyContent: "space-between" }} onClick={() => goTo("products")}>Ver borradores <Archive size={14} /></button>
        </div>
      </section>
    </>
  );
}

function ProductsScreen({ goToEditor }: { goToEditor: (product?: AdminProduct) => void }) {
  const [filter, setFilter] = useState<"Todos" | "Publicado" | "Borrador">("Todos");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => adminProducts.filter(product => {
    const matchStatus = filter === "Todos" || product.status === filter;
    const matchSearch = product.name.toLowerCase().includes(query.toLowerCase()) || product.sku.toLowerCase().includes(query.toLowerCase());
    return matchStatus && matchSearch;
  }), [filter, query]);
  return (
    <>
      <PageHead eyebrow="CATÁLOGO / PRODUCTOS" title={<>Tus<br /><em>productos.</em></>} copy="Gestioná nombres, precios, medios, categorías y estados de publicación desde una sola vista." action={<button className="admin-primary-btn" onClick={() => goToEditor()}><Plus size={15} /> Nuevo producto</button>} />
      <div className="admin-toolbar">
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}><Search size={15} style={{ position: "absolute", left: 12, top: 11, color: "#81796e" }} /><input className="admin-search-input" style={{ paddingLeft: 34, width: "100%" }} value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nombre o SKU..." /></div>
        <div className="admin-filter-group">{["Todos", "Publicado", "Borrador"].map(value => <button key={value} className={`admin-filter-btn ${filter === value ? "active" : ""}`} onClick={() => setFilter(value as typeof filter)}>{value}</button>)}</div>
        <button className="admin-outline-btn"><MoreHorizontal size={14} /> Más filtros</button>
      </div>
      <div className="admin-panel-card" style={{ padding: 16 }}>
        <div className="admin-panel-head"><div><span className="admin-kicker">RESULTADOS</span><h2>{visible.length} productos visibles</h2></div><span className="admin-kicker">Última sincronización: hace 4 min</span></div>
        <div className="admin-products-list" style={{ marginTop: 16 }}>
          {visible.map(product => <div className="admin-product-row-card" key={product.id}>
            <div className="admin-product-cell"><span className="admin-product-thumb">{product.sku}</span><div><strong>{product.name}</strong><small>{product.category} · SKU {product.sku}</small></div></div>
            <div><span className="admin-row-label">Precio base</span><span className="admin-row-value">{money(product.priceBase)}</span></div>
            <div><span className="admin-row-label">Mínimo</span><span className="admin-row-value">{product.minQuantity} unid.</span></div>
            <div><span className="admin-row-label">Estado</span><span className={`admin-status-badge ${statusClass(product.status)}`}>{product.status}</span></div>
            <div className="admin-row-actions"><button className="admin-icon-button" onClick={() => goToEditor(product)} aria-label={`Editar ${product.name}`}><Edit3 size={14} /></button><button className="admin-icon-button" aria-label={`Más acciones de ${product.name}`}><MoreHorizontal size={14} /></button></div>
          </div>)}
        </div>
      </div>
    </>
  );
}

function EditorScreen({ product, goToProducts }: { product?: AdminProduct; goToProducts: () => void }) {
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [status, setStatus] = useState(product?.status ?? "Borrador");
  const [saved, setSaved] = useState(false);
  const current = product ?? adminProducts[4];
  return (
    <>
      <PageHead eyebrow={product ? "PRODUCTOS / EDITAR" : "PRODUCTOS / NUEVO"} title={product ? <>Editar<br /><em>producto.</em></> : <>Cargar<br /><em>producto.</em></>} copy="La ficha organiza toda la información que el cliente verá en el catálogo." action={<button className="admin-outline-btn" onClick={goToProducts}><ArrowLeft size={14} /> Volver a productos</button>} />
      {saved && <div className="admin-toast"><Check size={15} /> Diseño de guardado exitoso · La ficha quedaría lista para publicar.</div>}
      <div className="admin-editor-grid">
        <section className="admin-editor-card">
          <div className="admin-panel-head"><div><span className="admin-kicker">FICHA DEL PRODUCTO</span><h2>Información principal</h2></div><button className="admin-icon-button"><MoreHorizontal size={16} /></button></div>
          <div className="admin-field-grid" style={{ marginTop: 22 }}>
            <div className="admin-field full"><label>Nombre del producto</label><input defaultValue={current.name} /></div>
            <div className="admin-field"><label>SKU / Código</label><input defaultValue={current.sku} /></div>
            <div className="admin-field"><label>Categoría</label><select defaultValue={current.category}><option>Indumentaria</option><option>Accesorios</option><option>UV & vinilo</option><option>Banderas</option></select></div>
            <div className="admin-field"><label>Precio base</label><input defaultValue={current.priceBase} type="number" /></div>
            <div className="admin-field"><label>Precio personalizado</label><input defaultValue={current.priceCustom ?? ""} type="number" placeholder="Opcional" /></div>
            <div className="admin-field"><label>Cantidad mínima</label><input defaultValue={current.minQuantity} type="number" min={1} /></div>
            <div className="admin-field"><label>Estado comercial</label><select defaultValue={current.customizable ? "Personalizable" : "Disponible"}><option>Disponible</option><option>Personalizable</option><option>Producción bajo pedido</option><option>Consultar stock</option><option>Agotado</option></select></div>
            <div className="admin-field full"><label>Descripción corta</label><input defaultValue={current.shortDescription} /></div>
            <div className="admin-field full"><label>Descripción completa</label><textarea defaultValue={current.description} /></div>
            <div className="admin-field"><label>Talles</label><input defaultValue={current.category === "Indumentaria" ? "S, M, L, XL, XXL" : "No aplica"} /></div>
            <div className="admin-field"><label>Colores</label><input defaultValue="Negro, blanco, rojo" /></div>
          </div>
          <div className="admin-toggle-line"><div><strong>Producto destacado</strong><small>Mostrarlo primero en el catálogo.</small></div><button className={`admin-switch ${featured ? "active" : ""}`} onClick={() => setFeatured(!featured)} aria-label="Alternar producto destacado"></button></div>
          <div className="admin-toggle-line"><div><strong>Publicación</strong><small>Definí si la ficha es visible para los clientes.</small></div><select value={status} onChange={e => setStatus(e.target.value as typeof status)} style={{ border: "1px solid #cfc7bb", background: "#f4f0e8", padding: "8px", fontSize: "11px", fontWeight: 800 }}><option>Publicado</option><option>Borrador</option><option>Archivado</option></select></div>
        </section>
        <section className="admin-media-card">
          <span className="admin-kicker">MEDIA / PRODUCTO</span>
          <h2>Fotos y video</h2>
          <div className="admin-dropzone"><div><UploadCloud size={25} color="#ff2a1a" /><strong>Arrastrá archivos acá</strong><p>Portada, frente, detalle, espalda<br />JPG, PNG, WEBP o MP4 · máximo 20 MB</p><button className="admin-primary-btn"><ImagePlus size={14} /> Elegir archivos</button></div></div>
          <div className="admin-media-grid"><div className="admin-media-thumb">{current.sku}<span>Portada</span></div><div className="admin-media-thumb">{current.sku}<span>Frente</span></div><div className="admin-media-thumb">{current.sku}<span>Detalle</span></div><div className="admin-media-thumb">{current.sku}<span>Espalda</span></div></div>
          <p className="admin-media-note">La galería del catálogo usa estas vistas en orden. En la versión real, desde acá podrías reemplazar, reordenar o eliminar cada archivo.</p>
        </section>
      </div>
      <div className="admin-save-bar"><span>{product ? "Editando ficha existente" : "Borrador nuevo"} · Los cambios todavía no se guardaron.</span><div style={{ display: "flex", gap: 9 }}><button className="admin-outline-btn" onClick={goToProducts}>Cancelar</button><button className="admin-primary-btn" onClick={() => setSaved(true)}><Save size={14} /> Guardar diseño</button></div></div>
    </>
  );
}

function CategoriesScreen() {
  const [selected, setSelected] = useState(0);
  const category = categories[selected];
  return (
    <>
      <PageHead eyebrow="CATÁLOGO / ESTRUCTURA" title={<>Ordená tus<br /><em>categorías.</em></>} copy="Las categorías organizan los filtros del catálogo y ayudan a que el cliente encuentre rápido lo que busca." action={<button className="admin-primary-btn"><Plus size={15} /> Nueva categoría</button>} />
      <div className="admin-category-layout">
        <section className="admin-panel-card"><div className="admin-panel-head"><div><span className="admin-kicker">CATEGORÍAS ACTIVAS</span><h2>Tu estructura</h2></div><button className="admin-outline-btn"><GripVertical size={14} /> Ordenar</button></div><div className="admin-category-list" style={{ marginTop: 16 }}>{categories.map((item, index) => <button key={item.slug} className={`admin-category-item ${selected === index ? "active" : ""}`} onClick={() => setSelected(index)}><span className="admin-category-name"><i className="admin-category-color"></i><span><strong>{item.name}</strong><small>/{item.slug}</small></span></span><span className="admin-category-count">{item.products} productos</span></button>)}</div></section>
        <section className="admin-category-detail"><span className="admin-kicker">DETALLE DE CATEGORÍA</span><h2>{category.name}</h2><p>{category.note}</p><div className="admin-category-stats"><div><span>Productos</span><strong>{category.products}</strong></div><div><span>Orden</span><strong>{selected + 1}</strong></div><div><span>Estado</span><strong style={{ fontSize: 18, color: "#78c384", paddingTop: 9 }}>{category.status}</strong></div></div><div style={{ display: "flex", gap: 8 }}><button className="admin-primary-btn"><Edit3 size={14} /> Editar nombre</button><button className="admin-outline-btn" style={{ background: "#353331", borderColor: "#81796e", color: "#f4f0e8" }}><MoreHorizontal size={14} /></button></div></section>
      </div>
      <section className="admin-panel-card" style={{ marginTop: 16 }}><div className="admin-panel-head"><div><span className="admin-kicker">PREVIEW DE FILTROS</span><h2>Así lo verá tu cliente</h2></div></div><div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>{["Todo", ...categories.map(c => c.name)].map((label, index) => <button key={label} className={`admin-filter-btn ${index === selected + 1 ? "active" : ""}`}>{label}</button>)}</div></section>
    </>
  );
}

export default function AdminPrototype() {
  const [screen, setScreen] = useState<AdminScreen>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | undefined>();
  const goToEditor = (product?: AdminProduct) => { setEditingProduct(product); setScreen("editor"); };
  const goToProducts = () => { setEditingProduct(undefined); setScreen("products"); };

  return (
    <div className="admin-shell">
      <Sidebar screen={screen} setScreen={setScreen} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <button className="side-menu-backdrop-v0 open" style={{ border: 0, padding: 0, zIndex: 15 }} onClick={() => setSidebarOpen(false)} aria-label="Cerrar navegación" />}
      <div className="admin-workspace">
        <Topbar onMenu={() => setSidebarOpen(true)} />
        <main className="admin-main">
          {screen === "overview" && <Overview goTo={setScreen} />}
          {screen === "products" && <ProductsScreen goToEditor={goToEditor} />}
          {screen === "editor" && <EditorScreen product={editingProduct} goToProducts={goToProducts} />}
          {screen === "categories" && <CategoriesScreen />}
        </main>
      </div>
    </div>
  );
}
