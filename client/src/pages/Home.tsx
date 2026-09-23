import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, Instagram, MessageCircle, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

type CatalogProduct = {
  id: number;
  name: string;
  priceBase: number;
  priceCustom: number | null;
  minQuantity: number;
  availability: "available" | "customizable" | "made_to_order" | "check_stock" | "sold_out" | "coming_soon";
  shortDescription: string | null;
  sku?: string | null;
  categoryId?: number | null;
};

const statusLabels = { available: "Disponible", customizable: "Personalizable", made_to_order: "Producción bajo pedido", check_stock: "Consultar stock", sold_out: "Agotado", coming_soon: "Próximamente" } as const;
const money = (value: number | null) => value == null || value === 0 ? "Consultar" : `$ ${new Intl.NumberFormat("es-AR").format(value)}`;
const galleryViews = ["Frente", "Detalle", "Espalda"];
const heroSlides = [
  { eyebrow: "INDUMENTARIA + IDENTIDAD", title: <>HACÉ QUE<br /><em>TE VEAN.</em></>, copy: "Prendas, accesorios y estampas para equipos que salen a jugar, marcas que quieren hacerse notar y personas que visten lo que creen." },
  { eyebrow: "EQUIPOS + MARCAS", title: <>VESTÍ<br /><em>TU CÓDIGO.</em></>, copy: "Diseñamos prendas y piezas que hacen visible lo que une a tu equipo, tu marca y tu forma de moverte." },
  { eyebrow: "HECHO EN LAS BREÑAS", title: <>MOVERTE<br /><em>CON IDENTIDAD.</em></>, copy: "Del diseño a la entrega: una experiencia cercana para convertir tus ideas en piezas que representan." },
];

function ProductGallery({ product, compact = false }: { product: CatalogProduct; compact?: boolean }) {
  const mark = product.sku || product.name.slice(0, 2).toUpperCase();
  return (
    <div className={`product-gallery ${compact ? "product-gallery-compact" : ""}`} aria-label={`Galería de ${product.name}`}>
      <div className="product-gallery-track">
        {galleryViews.map((view, index) => (
          <div key={view} className={`gallery-frame frame-${index}`}>
            <span className="gallery-mark">{mark}</span>
            <small>{view}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductPreview({ product, onClose }: { product: CatalogProduct; onClose: () => void }) {
  const [slide, setSlide] = useState(0);
  const mark = product.sku || product.name.slice(0, 2).toUpperCase();
  const next = () => setSlide(value => (value + 1) % galleryViews.length);
  const prev = () => setSlide(value => (value + galleryViews.length - 1) % galleryViews.length);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="product-modal" role="dialog" aria-modal="true" aria-label={`Vista previa de ${product.name}`} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="product-modal-card">
        <button className="modal-close-button" onClick={onClose} aria-label="Cerrar vista previa">
          <X className="h-5 w-5" />
        </button>
        <div className="modal-gallery">
          <div className="modal-gallery-track" style={{ transform: `translateX(-${slide * 33.3333}%)` }}>
            {galleryViews.map((view, index) => (
              <div key={view} className={`gallery-frame frame-${index}`}>
                <span className="gallery-mark">{mark}</span>
                <small>{view} · {product.name}</small>
              </div>
            ))}
          </div>
          <button className="modal-gallery-prev" onClick={prev} aria-label="Vista anterior"><ArrowLeft className="h-5 w-5" /></button>
          <button className="modal-gallery-next" onClick={next} aria-label="Vista siguiente"><ArrowRight className="h-5 w-5" /></button>
          <div className="modal-gallery-dots">
            {galleryViews.map((view, index) => (
              <button key={view} onClick={() => setSlide(index)} className={index === slide ? "active" : ""} aria-label={`Mostrar ${view}`} />
            ))}
          </div>
        </div>
        <div className="modal-product-info">
          <p className="casacas-kicker">{statusLabels[product.availability]}</p>
          <h2 className="font-display text-6xl leading-[.82]">{product.name}</h2>
          <p className="mt-5 text-sm leading-7 text-[#706a62]">
            {product.shortDescription || "Una pieza de CASACAS LB para hacer que tu identidad se vea."}
          </p>
          <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#d9d1c5] pt-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-[#81796e]">Precio base</p>
              <strong className="mt-1 block text-2xl">{money(product.priceBase)}</strong>
              {product.priceCustom && product.priceCustom !== product.priceBase && (
                <span className="text-xs text-[#81796e]">Personalizado: {money(product.priceCustom)}</span>
              )}
            </div>
            <span className="text-right text-[10px] font-black uppercase tracking-[.12em] text-[#81796e]">
              Mínimo<br />{product.minQuantity} {product.minQuantity === 1 ? "unidad" : "unidades"}
            </span>
          </div>
          <a
            className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#f33825] px-5 py-4 text-xs font-black uppercase tracking-[.14em] text-white transition hover:scale-[1.03] hover:rotate-[-1deg]"
            href={`https://wa.me/5493735549290?text=${encodeURIComponent(`Hola Leo, quiero consultar por ${product.name} de CASACAS LB. Precio base: ${money(product.priceBase)}.`)}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="h-4 w-4" /> Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onPreview }: { product: CatalogProduct; onPreview: (product: CatalogProduct) => void }) {
  return (
    <article
      className="product-card group"
      role="button"
      tabIndex={0}
      aria-label={`Ver vista previa de ${product.name}`}
      onClick={() => onPreview(product)}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onPreview(product);
        }
      }}
    >
      <div className="product-visual">
        <ProductGallery product={product} compact />
        <span className="product-tag">
          {product.availability === "customizable" || product.priceCustom ? "PERSONALIZABLE" : "LISTO PARA USAR"}
        </span>
        <span className="preview-hint">Ver producto ↗</span>
      </div>
      <div className="product-info">
        <div className="product-meta">
          <span>CASACAS LB</span>
          <span>mín. {product.minQuantity}</span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.shortDescription || "Una pieza lista para hacerla propia."}</p>
        <div className="product-price">
          {money(product.priceBase)}
          {product.priceCustom && product.priceCustom !== product.priceBase && (
            <span className="custom-price">/ {money(product.priceCustom)} personalizado</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const categories = trpc.catalog.categories.useQuery();
  const products = trpc.catalog.products.useQuery({
    search: search || undefined,
    categoryId: selectedCategory ?? undefined,
  });

  const [heroSlide, setHeroSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroStartX = useRef<number | null>(null);
  const heroTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentHero = heroSlides[heroSlide];

  const setSlide = (value: number) => setHeroSlide((value + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    heroTimer.current = setInterval(() => setHeroSlide(value => (value + 1) % heroSlides.length), 6500);
    return () => {
      if (heroTimer.current) clearInterval(heroTimer.current);
    };
  }, []);

  const pauseHero = () => { if (heroTimer.current) clearInterval(heroTimer.current); };
  const resumeHero = () => {
    if (heroTimer.current) clearInterval(heroTimer.current);
    heroTimer.current = setInterval(() => setHeroSlide(value => (value + 1) % heroSlides.length), 6500);
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#211f1c]">
      <div className="announcement-bar">
        <div className="announcement-track">
          <span>RETIRO EN LAS BREÑAS</span><i>•</i>
          <span>CONSULTAS POR WHATSAPP +54 9 3735 549290</span><i>•</i>
          <span>DISEÑO + IDENTIDAD</span><i>•</i>
          <span>RETIRO EN LAS BREÑAS</span><i>•</i>
          <span>CONSULTAS POR WHATSAPP +54 9 3735 549290</span>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-[#d9d1c5] bg-[#f4f0e8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="section-menu-trigger" aria-label="Abrir menú de secciones" aria-expanded={menuOpen}>
              <Menu className="h-4 w-4" />
            </button>
            <Link href="/" className="font-display text-3xl leading-none tracking-[-.05em]">
              CASACAS <span className="text-[#f33825]">LB</span>
            </Link>
          </div>
          <nav className="hidden items-center gap-7 text-[10px] font-black uppercase tracking-[.13em] md:flex">
            <a href="#catalogo" className="nav-tilt-link">Catálogo</a>
            <a href="#personaliza" className="nav-tilt-link">Personalizá</a>
            <a href="#contacto" className="nav-tilt-link">Local & contacto</a>
            <Link href="/admin" className="nav-tilt-link">Administración</Link>
          </nav>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/casacaslb/" target="_blank" rel="noreferrer" aria-label="Instagram CASACAS LB" className="icon-action">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://wa.me/5493735549290" target="_blank" rel="noreferrer" aria-label="WhatsApp CASACAS LB" className="icon-action whatsapp-action">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <div className="section-menu-backdrop open" onClick={() => setMenuOpen(false)} />
          <aside className="section-menu open" aria-label="Navegación principal">
            <div className="flex items-start justify-between border-b border-[#cfc7bb] pb-5">
              <div>
                <p className="casacas-kicker">CASACAS LB</p>
                <p className="mt-2 font-display text-5xl leading-[.8]">
                  IR<br /><span className="text-[#f33825]">A.</span>
                </p>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-3xl transition hover:rotate-6 hover:text-[#f33825]" aria-label="Cerrar menú">
                <X />
              </button>
            </div>
            <nav className="mt-10 flex flex-col">
              <a href="#catalogo" onClick={() => setMenuOpen(false)}>Catálogo <span>01</span></a>
              <a href="#personaliza" onClick={() => setMenuOpen(false)}>Personalizá <span>02</span></a>
              <a href="#contacto" onClick={() => setMenuOpen(false)}>Local & contacto <span>03</span></a>
              <Link href="/admin" onClick={() => setMenuOpen(false)}>Administración <span>04</span></Link>
            </nav>
            <a href="https://wa.me/5493735549290" target="_blank" rel="noreferrer" className="section-menu-contact">
              Hablar por WhatsApp
            </a>
          </aside>
        </>
      )}

      <main>
        <section
          id="heroCarousel"
          className="hero-carousel"
          data-slide={heroSlide}
          onPointerDown={event => {
            heroStartX.current = event.clientX;
            pauseHero();
            event.currentTarget.setPointerCapture?.(event.pointerId);
          }}
          onPointerUp={event => {
            if (heroStartX.current === null) return;
            const delta = event.clientX - heroStartX.current;
            if (Math.abs(delta) > 45) setSlide(heroSlide + (delta < 0 ? 1 : -1));
            heroStartX.current = null;
            resumeHero();
          }}
          onKeyDown={event => {
            if (event.key === "ArrowRight") setSlide(heroSlide + 1);
            if (event.key === "ArrowLeft") setSlide(heroSlide - 1);
          }}
          tabIndex={0}
        >
          <div className="hero-art" aria-hidden="true">
            <div className="art-block-one" />
            <div className="art-block-two" />
            <div className="hero-sticker">LB<br /><small>CREW</small></div>
            <p className="hero-art-copy">HECHO<br />PARA<br /><em>MOVERTE</em></p>
          </div>
          <div className="hero-content">
            <p className="casacas-kicker text-[#beb6aa] hero-eyebrow">{currentHero.eyebrow}</p>
            <h1 className="font-display hero-title">{currentHero.title}</h1>
            <p className="hero-copy">{currentHero.copy}</p>
            <a href="#catalogo" className="hero-cta">
              Explorar catálogo <ArrowRight className="h-4 w-4 text-[#f33825]" />
            </a>
          </div>
          <div className="hero-carousel-controls">
            <button onClick={() => setSlide(heroSlide - 1)} aria-label="Anterior"><ArrowLeft className="h-4 w-4" /></button>
            <div className="hero-dots">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.eyebrow}
                  className={`hero-dot ${index === heroSlide ? "active" : ""}`}
                  onClick={() => setSlide(index)}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
            <button onClick={() => setSlide(heroSlide + 1)} aria-label="Siguiente"><ArrowRight className="h-4 w-4" /></button>
            <span className="hero-slide-count">0{heroSlide + 1} — 03</span>
          </div>
        </section>

        <section id="catalogo" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10">
          <div className="flex flex-col justify-between gap-6 border-b border-[#cfc7bb] pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="casacas-kicker">CATÁLOGO / 2026</p>
              <h2 className="mt-3 font-display text-6xl leading-none">
                Elegí tu base.<br /><span className="text-[#f33825]">Hacela propia.</span>
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#81796e]" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar en el catálogo..."
                  className="rounded-full border border-[#cfc7bb] bg-[#eee9df] py-2 pl-9 pr-4 text-xs text-[#211f1c] outline-none transition focus:border-[#f33825]"
                />
              </div>
              <div className="text-xs font-bold text-[#81796e]">
                {products.data?.length ?? 0} producto(s)
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${selectedCategory === null ? "bg-[#f33825] text-white" : "border border-[#cfc7bb] bg-[#f8f5ef] text-[#211f1c] hover:border-[#f33825]"}`}
            >
              Todos
            </button>
            {categories.data?.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${selectedCategory === category.id ? "bg-[#f33825] text-white" : "border border-[#cfc7bb] bg-[#f8f5ef] text-[#211f1c] hover:border-[#f33825]"}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {products.isLoading ? (
            <p className="py-20 text-center text-sm text-[#81796e]">Cargando catálogo...</p>
          ) : products.error ? (
            <p className="py-20 text-center text-sm text-red-700">No se pudo cargar el catálogo.</p>
          ) : products.data?.length ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.data.map(product => (
                <ProductCard key={product.id} product={product as CatalogProduct} onPreview={setSelectedProduct} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[24px] border border-dashed border-[#c9c0b4] bg-[#eee9df] p-16 text-center">
              <h3 className="font-display text-5xl">No se encontraron productos.</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#81796e]">
                Probá con otra categoría o término de búsqueda.
              </p>
            </div>
          )}
        </section>

        <section id="personaliza" className="bg-[#f33825] px-5 py-20 text-white lg:px-10">
          <div className="mx-auto grid max-w-[1440px] gap-8 md:grid-cols-[.7fr_1.3fr] md:items-end">
            <p className="casacas-kicker text-white/70">PERSONALIZACIÓN SIN LÍMITES</p>
            <h2 className="font-display text-7xl leading-[.78] sm:text-9xl">
              DEL IDEA<br />AL EQUIPO.
            </h2>
          </div>
        </section>

        <section id="contacto" className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="casacas-kicker">ESTAMOS CERCA</p>
            <h2 className="mt-4 font-display text-7xl leading-[.78]">
              Local,<br /><span className="text-[#f33825]">horarios & contacto.</span>
            </h2>
          </div>
          <div className="space-y-6 text-sm leading-7 text-[#706a62]">
            <p>Coordiná tu pedido directo con Leo. El diseño final y la producción se confirman por WhatsApp.</p>
            <a href="https://wa.me/5493735549290" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-[#211f1c] px-5 py-3 text-xs font-black uppercase tracking-[.14em] text-white transition hover:scale-[1.03] hover:rotate-[-2deg]">
              <MessageCircle className="h-4 w-4 text-[#f33825]" /> Escribir por WhatsApp
            </a>
            <div className="grid gap-4 border-t border-[#cfc7bb] pt-6 sm:grid-cols-2">
              <div>
                <strong className="block text-xs uppercase tracking-[.12em] text-[#211f1c]">Retiro en el local</strong>
                <span>Av. General Jones<br />Las Breñas, Chaco</span>
              </div>
              <div>
                <strong className="block text-xs uppercase tracking-[.12em] text-[#211f1c]">Instagram</strong>
                <a href="https://www.instagram.com/casacaslb/" target="_blank" rel="noreferrer" className="text-[#f33825]">@casacaslb</a><br />
                <span>+54 9 3735 549290</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#211f1c] px-5 py-8 text-center text-[10px] font-black uppercase tracking-[.16em] text-[#81796e] lg:px-10">
        CASACAS LB · LAS BREÑAS · CHACO
      </footer>

      {selectedProduct && <ProductPreview product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}
