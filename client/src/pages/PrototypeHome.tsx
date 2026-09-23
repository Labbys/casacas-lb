import React, { useState, useEffect, useRef } from "react";
import { prototypeProducts, PrototypeProduct } from "../prototypeCatalog";
import "../prototype.css";

type CartItem = {
  product: PrototypeProduct;
  quantity: number;
};

const heroSlides = [
  {
    eyebrow: "INDUMENTARIA + IDENTIDAD",
    title: (
      <>
        HACÉ QUE<br /><em>TE VEAN.</em>
      </>
    ),
    copy: "Prendas, accesorios y estampas para equipos que salen a jugar, marcas que quieren hacerse notar y personas que visten lo que creen."
  },
  {
    eyebrow: "EQUIPOS + MARCAS",
    title: (
      <>
        VESTÍ<br /><em>TU CÓDIGO.</em>
      </>
    ),
    copy: "Diseñamos prendas y piezas que hacen visible lo que une a tu equipo, tu marca y tu forma de moverte."
  },
  {
    eyebrow: "HECHO EN LAS BREÑAS",
    title: (
      <>
        MOVERTE<br /><em>CON IDENTIDAD.</em>
      </>
    ),
    copy: "Del diseño a la entrega: una experiencia cercana para convertir tus ideas en piezas que representan."
  }
];

export default function PrototypeHome() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [search, setSearch] = useState("");
  const [heroSlide, setHeroSlide] = useState(0);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PrototypeProduct | null>(null);
  const [modalSlide, setModalSlide] = useState(0);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([
    { product: prototypeProducts[0], quantity: 2 },
    { product: prototypeProducts[4], quantity: 1 }
  ]);

  // Arrastre con mouse en hero
  const heroStartX = useRef<number | null>(null);
  const modalStartX = useRef<number | null>(null);

  // Escuchar scroll para cambiar transparencia del header
  useEffect(() => {
    const onScroll = () => {
      setHeaderScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Avance automático del hero
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(curr => (curr + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + item.product.priceBase * item.quantity, 0);

  const filteredProducts = prototypeProducts.filter(p => {
    const matchesCat = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openProductModal = (product: PrototypeProduct) => {
    setSelectedProduct(product);
    setModalSlide(0);
    setModalQuantity(product.minQuantity || 1);
  };

  const addToCartFromModal = () => {
    if (!selectedProduct) return;
    setCart(curr => {
      const existing = curr.find(i => i.product.id === selectedProduct.id);
      if (existing) {
        return curr.map(i => i.product.id === selectedProduct.id ? { ...i, quantity: i.quantity + modalQuantity } : i);
      }
      return [...curr, { product: selectedProduct, quantity: modalQuantity }];
    });
    setSelectedProduct(null);
    setCartOpen(true);
  };

  const updateCartQty = (id: number, delta: number) => {
    setCart(curr =>
      curr
        .map(item => {
          if (item.product.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (id: number) => {
    setCart(curr => curr.filter(item => item.product.id !== id));
  };

  const formatMoney = (val: number | null) => (val == null ? "—" : `$ ${new Intl.NumberFormat("es-AR").format(val)}`);

  return (
    <div className="prototype-root">
      {/* 1. MARQUESINA DE DERECHA A IZQUIERDA CONTINUA */}
      <div className="announcement-top" aria-label="Información de contacto">
        <div className="announcement-track-continuous">
          <div className="announcement-set">
            <span>RETIRO EN LAS BREÑAS</span>
            <i></i>
            <span>CONSULTAS POR WHATSAPP · +54 9 3735 549290</span>
            <a href="https://wa.me/5493735549290" target="_blank" rel="noopener">ABRIR CHAT ↗</a>
          </div>
          <div className="announcement-set">
            <span>RETIRO EN LAS BREÑAS</span>
            <i></i>
            <span>CONSULTAS POR WHATSAPP · +54 9 3735 549290</span>
            <a href="https://wa.me/5493735549290" target="_blank" rel="noopener">ABRIR CHAT ↗</a>
          </div>
          <div className="announcement-set">
            <span>RETIRO EN LAS BREÑAS</span>
            <i></i>
            <span>CONSULTAS POR WHATSAPP · +54 9 3735 549290</span>
            <a href="https://wa.me/5493735549290" target="_blank" rel="noopener">ABRIR CHAT ↗</a>
          </div>
        </div>
      </div>

      {/* 2. HEADER STICKY: Camuflado al bajar, opaco al hover */}
      <header className={`site-header-v0 ${headerScrolled ? "header-scrolled" : ""}`}>
        <div className="brand-group">
          <a href="#inicio" aria-label="CASACAS LB inicio">
            <img src="/media/logo-casacas-negro-rojo-real.png" alt="CASACAS LB" className="brand-logo-img" />
          </a>
          <button onClick={() => setMenuOpen(true)} className="section-menu-btn" aria-label="Abrir menú de navegación">
            ☰
          </button>
        </div>

        {/* BOTONES MÁS GRANDES */}
        <nav className="nav-links-v0">
          <a href="#catalogo" className="nav-item-btn">Catálogo</a>
          <a href="#personaliza" className="nav-item-btn">Personalizá</a>
          <a href="#local" className="nav-item-btn">Local & contacto</a>
          <a href="#opiniones" className="nav-item-btn">Opiniones</a>
          <a href="#manifiesto" className="nav-item-btn">Nosotros</a>
        </nav>

        <div className="nav-actions-v0">
          <button onClick={() => setSearchOpen(true)} className="search-trigger-btn" aria-label="Buscar producto">
            ⌕
          </button>
          {/* CAMBIADO A "CARRITO" */}
          <button onClick={() => setCartOpen(true)} className="cart-trigger-btn" aria-label="Abrir carrito">
            <span>Carrito</span>
            <span className="cart-badge">{totalCartCount}</span>
          </button>
        </div>
      </header>

      {/* MENÚ LATERAL SIN NUMERACIONES 01, 02 */}
      <div className={`side-menu-backdrop-v0 ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <aside className={`side-menu-v0 ${menuOpen ? "open" : ""}`}>
        <div className="side-menu-head">
          <span className="hero-eyebrow">NAVEGACIÓN</span>
          <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: 0, fontSize: "28px" }}>×</button>
        </div>
        <p className="side-menu-title">CASACAS<br /><em>LB</em></p>
        <nav className="side-nav-links">
          <a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
          <a href="#catalogo" onClick={() => setMenuOpen(false)}>Catálogo</a>
          <a href="#personaliza" onClick={() => setMenuOpen(false)}>Personalizá</a>
          <a href="#opiniones" onClick={() => setMenuOpen(false)}>Opiniones</a>
          <a href="#local" onClick={() => setMenuOpen(false)}>Local & contacto</a>
          <a href="#manifiesto" onClick={() => setMenuOpen(false)}>Nosotros</a>
        </nav>
        <a href="https://wa.me/5493735549290" target="_blank" rel="noopener" className="side-menu-wa">
          WhatsApp directo ↗
        </a>
      </aside>

      {/* OVERLAY DE BÚSQUEDA */}
      {searchOpen && (
        <div className="search-overlay-v0">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="hero-eyebrow" style={{ color: "#beb6aa" }}>BUSCAR EN EL CATÁLOGO</span>
            <button onClick={() => setSearchOpen(false)} style={{ background: "none", border: 0, color: "#fff", fontSize: "36px" }}>×</button>
          </div>
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Escribí lo que buscás (ej. Remera, Vaso, Sticker...)"
            onKeyDown={e => { if (e.key === "Enter") { setSearchOpen(false); window.location.hash = "catalogo"; } }}
          />
          <p style={{ marginTop: "18px", color: "#8d877f", fontSize: "12px" }}>Apretá Enter para ir directo a los resultados.</p>
        </div>
      )}

      {/* 3. HERO CON CARROUSEL ARRASTRABLE CON EL MOUSE */}
      <section
        id="inicio"
        className="hero-v0"
        onMouseDown={e => { heroStartX.current = e.clientX; }}
        onMouseUp={e => {
          if (heroStartX.current === null) return;
          const diff = e.clientX - heroStartX.current;
          if (diff > 50) setHeroSlide(c => (c - 1 + heroSlides.length) % heroSlides.length);
          if (diff < -50) setHeroSlide(c => (c + 1) % heroSlides.length);
          heroStartX.current = null;
        }}
        onTouchStart={e => { heroStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (heroStartX.current === null) return;
          const diff = e.changedTouches[0].clientX - heroStartX.current;
          if (diff > 50) setHeroSlide(c => (c - 1 + heroSlides.length) % heroSlides.length);
          if (diff < -50) setHeroSlide(c => (c + 1) % heroSlides.length);
          heroStartX.current = null;
        }}
      >
        <div className="hero-copy-v0">
          <p className="hero-eyebrow">{heroSlides[heroSlide].eyebrow}</p>
          <h1 className="hero-title-v0">{heroSlides[heroSlide].title}</h1>
          <p className="hero-text-v0">{heroSlides[heroSlide].copy}</p>
          <a href="#catalogo" className="hero-btn">
            Explorar catálogo <span>↗</span>
          </a>
        </div>

        <div className="hero-art-v0">
          <div className="hero-sticker-v0">LB<br /><small>CREW</small></div>
          <div className="hero-art-block1"></div>
          <div className="hero-art-block2"></div>
          <p className="hero-art-label">HECHO<br />PARA<br /><strong>MOVERTE</strong></p>
        </div>

        <div className="hero-controls-v0">
          <button onClick={() => setHeroSlide(c => (c - 1 + heroSlides.length) % heroSlides.length)} className="hero-nav-arrow" aria-label="Slide anterior">←</button>
          <div className="hero-dots-v0">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                className={`hero-dot-btn ${idx === heroSlide ? "active" : ""}`}
                onClick={() => setHeroSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <button onClick={() => setHeroSlide(c => (c + 1) % heroSlides.length)} className="hero-nav-arrow" aria-label="Slide siguiente">→</button>
        </div>
      </section>

      {/* TICKER */}
      <section className="ticker-banner">
        <span>INDUMENTARIA DEPORTIVA</span><i></i>
        <span>SUBLIMACIÓN UV</span><i></i>
        <span>PERSONALIZACIÓN TOTAL</span><i></i>
        <span>PARA EQUIPOS Y MARCAS</span><i></i>
        <span>CALIDAD CHAQUEÑA</span>
      </section>

      {/* 4. SECCIÓN CATÁLOGO: Categoría activa en negrita con zoom e inclinación, hover de 3 imágenes y sin etiqueta redundante */}
      <section id="catalogo" className="catalog-section-v0">
        <div className="section-head-v0">
          <div>
            <p className="hero-eyebrow">LO QUE HACEMOS</p>
            <h2>Catálogo <span>/ 2026</span></h2>
          </div>
          <p style={{ maxWidth: "340px", color: "#77716a", fontSize: "13px", lineHeight: "1.7" }}>
            Elegí la prenda o pieza base. Nosotros nos encargamos de que represente a tu equipo o proyecto.
          </p>
        </div>

        <div className="catalog-bar-v0">
          <div className="categories-filter-v0">
            {["Todos", "Indumentaria", "Accesorios", "UV & vinilo", "Banderas"].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-btn-v0 ${selectedCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="search-box-v0">
            <span>⌕</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto..."
            />
          </div>
        </div>

        <div className="product-grid-v0">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="product-card-v0"
              onClick={() => openProductModal(product)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") openProductModal(product); }}
            >
              <div className="product-thumb-v0">
                {/* 3 IMÁGENES QUE SE INTERCALAN AL HACER HOVER */}
                <div className="product-slides-track">
                  <div className="product-slide-frame">
                    <span className="product-sku-mark">{product.sku}</span>
                    <span className="product-slide-view-tag">Frente</span>
                  </div>
                  <div className="product-slide-frame" style={{ background: "#d8e0dd" }}>
                    <span className="product-sku-mark">{product.sku}</span>
                    <span className="product-slide-view-tag">Detalle</span>
                  </div>
                  <div className="product-slide-frame" style={{ background: "#d6d1c5" }}>
                    <span className="product-sku-mark">{product.sku}</span>
                    <span className="product-slide-view-tag">Espalda</span>
                  </div>
                </div>

                {product.customizable && (
                  <span className="product-badge-v0">PERSONALIZABLE</span>
                )}
              </div>

              <div className="product-info-v0">
                <div className="product-meta-v0">
                  <span>{product.category}</span>
                  <span>Mín. {product.minQuantity}</span>
                </div>
                <h3 className="product-title-v0">{product.name}</h3>
                <div className="product-price-v0">
                  {formatMoney(product.priceBase)}
                  {product.priceCustom && <small>/ {formatMoney(product.priceCustom)} personaliz.</small>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VISTA PREVIA / DETALLE DEL PRODUCTO MODAL: arrastre con mouse y selector de cantidad */}
      {selectedProduct && (
        <div className="modal-overlay-v0" onClick={() => setSelectedProduct(null)}>
          <div className="modal-dialog-v0" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="modal-close-btn" aria-label="Cerrar modal">×</button>

            {/* Galería arrastrable de 3 imágenes */}
            <div
              className="modal-visual-v0"
              onMouseDown={e => { modalStartX.current = e.clientX; }}
              onMouseUp={e => {
                if (modalStartX.current === null) return;
                const diff = e.clientX - modalStartX.current;
                if (diff > 40) setModalSlide(curr => (curr + 2) % 3);
                if (diff < -40) setModalSlide(curr => (curr + 1) % 3);
                modalStartX.current = null;
              }}
              onTouchStart={e => { modalStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                if (modalStartX.current === null) return;
                const diff = e.changedTouches[0].clientX - modalStartX.current;
                if (diff > 40) setModalSlide(curr => (curr + 2) % 3);
                if (diff < -40) setModalSlide(curr => (curr + 1) % 3);
                modalStartX.current = null;
              }}
            >
              <div className="modal-visual-track" style={{ transform: `translateX(-${modalSlide * 33.3333}%)` }}>
                <div className="modal-visual-slide">
                  <b>{selectedProduct.sku}</b>
                  <span style={{ position: "absolute", bottom: "20px", left: "20px", fontSize: "10px", fontWeight: "800", color: "#77716a" }}>VISTA 1: FRENTE</span>
                </div>
                <div className="modal-visual-slide" style={{ background: "#d8e0dd" }}>
                  <b>{selectedProduct.sku}</b>
                  <span style={{ position: "absolute", bottom: "20px", left: "20px", fontSize: "10px", fontWeight: "800", color: "#77716a" }}>VISTA 2: DETALLE Y TELA</span>
                </div>
                <div className="modal-visual-slide" style={{ background: "#d6d1c5" }}>
                  <b>{selectedProduct.sku}</b>
                  <span style={{ position: "absolute", bottom: "20px", left: "20px", fontSize: "10px", fontWeight: "800", color: "#77716a" }}>VISTA 3: ESPALDA</span>
                </div>
              </div>

              <div className="modal-gallery-arrows">
                <button onClick={() => setModalSlide(c => (c + 2) % 3)} className="modal-gallery-btn" aria-label="Foto anterior">←</button>
                <button onClick={() => setModalSlide(c => (c + 1) % 3)} className="modal-gallery-btn" aria-label="Foto siguiente">→</button>
              </div>

              <div className="modal-gallery-dots">
                {[0, 1, 2].map(idx => (
                  <button
                    key={idx}
                    className={`modal-gallery-dot ${modalSlide === idx ? "active" : ""}`}
                    onClick={() => setModalSlide(idx)}
                    aria-label={`Foto ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="modal-content-v0">
              <span className="modal-eyebrow">{selectedProduct.category}</span>
              <h2>{selectedProduct.name}</h2>
              <p className="modal-desc-v0">{selectedProduct.description}</p>

              <div className="modal-price-box">
                <div>
                  <span style={{ display: "block", marginBottom: "4px" }}>PRECIO UNITARIO</span>
                  <strong>{formatMoney(selectedProduct.priceBase)}</strong>
                </div>
                <span>Mínimo: {selectedProduct.minQuantity} unidad(es)</span>
              </div>

              {/* SELECTOR DE CANTIDAD CON BOTONES - Y + */}
              <div className="quantity-control-v0">
                <label>Cantidad de unidades</label>
                <div className="quantity-counter">
                  <button
                    onClick={() => setModalQuantity(q => Math.max(selectedProduct.minQuantity || 1, q - 1))}
                    className="qty-btn"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="qty-number">{modalQuantity}</span>
                  <button
                    onClick={() => setModalQuantity(q => q + 1)}
                    className="qty-btn"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="modal-actions-v0">
                <button onClick={addToCartFromModal} className="modal-add-btn">
                  <span>Agregar al carrito</span>
                  <span>{formatMoney(selectedProduct.priceBase * modalQuantity)} +</span>
                </button>
                <a
                  href={`https://wa.me/5493735549290?text=${encodeURIComponent(`Hola Leo, quiero consultar por ${modalQuantity} unidad(es) de ${selectedProduct.name}.`)}`}
                  target="_blank"
                  rel="noopener"
                  className="modal-whatsapp-link"
                >
                  <span style={{ color: "#25d366", fontSize: "16px" }}>☎</span> Consultar por WhatsApp ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. CARRITO DRAWER (SUSTITUYE A BOLSA) */}
      <div className={`cart-backdrop-v0 ${cartOpen ? "open" : ""}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer-v0 ${cartOpen ? "open" : ""}`}>
        <div className="cart-drawer-head">
          <h3>Carrito <span>({totalCartCount})</span></h3>
          <button onClick={() => setCartOpen(false)} style={{ background: "none", border: 0, fontSize: "28px" }}>×</button>
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              Tu carrito está vacío.<br />
              <span style={{ fontSize: "12px", color: "#aaa59d" }}>Elegí una prenda o producto para comenzar.</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="cart-item-row">
                <div className="cart-item-thumb">{item.product.sku}</div>
                <div>
                  <h4 className="cart-item-name">{item.product.name}</h4>
                  <div className="cart-item-meta">
                    <span>{formatMoney(item.product.priceBase)}</span>
                    <div className="cart-qty-mini">
                      <button onClick={() => updateCartQty(item.product.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.product.id, 1)}>+</button>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeCartItem(item.product.id)} className="cart-item-remove" aria-label="Eliminar producto">
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-total-line">
            <span>Total estimado</span>
            <strong>{formatMoney(totalCartPrice)}</strong>
          </div>
          <a
            href={`https://wa.me/5493735549290?text=${encodeURIComponent(
              `Hola Leo! Quiero hacer un pedido con mi carrito de CASACAS LB:\n` +
              cart.map(i => `- ${i.quantity}x ${i.product.name} (${formatMoney(i.product.priceBase * i.quantity)})`).join("\n") +
              `\nTotal estimado: ${formatMoney(totalCartPrice)}`
            )}`}
            target="_blank"
            rel="noopener"
            className="cart-checkout-btn"
          >
            Preparar pedido por WhatsApp ↗
          </a>
          <span className="cart-footer-note">Los precios y diseños personalizados se confirman directo con Leo.</span>
        </div>
      </aside>

      {/* 7. SECCIÓN PERSONALIZÁ (SIN NUMERACIONES) */}
      <section id="personaliza" className="custom-section-v0">
        <div className="custom-art-v0">
          <div className="custom-circle-v0">
            TU<br /><small>MARCA</small>
          </div>
        </div>

        <div>
          <p className="hero-eyebrow">PERSONALIZACIÓN SIN LÍMITES</p>
          <h2 style={{ font: "400 clamp(54px, 6vw, 92px)/0.82 'Bebas Neue'", margin: "0 0 20px" }}>
            Del idea<br /><span style={{ color: "#ff2a1a" }}>al equipo.</span>
          </h2>
          <p style={{ color: "#77716a", fontSize: "14px", lineHeight: "1.8", maxWidth: "440px" }}>
            No importa si es una remera para salir, el juego completo para tu club o indumentaria corporativa: te asesoramos en cortes, estampas y durabilidad.
          </p>

          <div className="custom-steps-v0">
            <div className="custom-step-row">
              <span className="custom-step-mark">Paso</span>
              <span>Elegís la prenda o artículo del catálogo</span>
            </div>
            <div className="custom-step-row">
              <span className="custom-step-mark">Paso</span>
              <span>Nos pasás tu diseño, colores y talles</span>
            </div>
            <div className="custom-step-row">
              <span className="custom-step-mark">Paso</span>
              <span>Lo producimos y retirás en Las Breñas</span>
            </div>
          </div>

          <a href="#catalogo" className="hero-btn" style={{ background: "#252422", color: "#f4f0e8" }}>
            Ver opciones de catálogo <span>↗</span>
          </a>
        </div>
      </section>

      {/* 8. SECCIÓN OPINIONES (SIN 01, 02) */}
      <section id="opiniones" className="opinions-section-v0">
        <div className="section-head-v0">
          <div>
            <p className="hero-eyebrow">LO QUE DICEN DE CASACAS</p>
            <h2>Opiniones <span>reales.</span></h2>
          </div>
          <p style={{ maxWidth: "340px", color: "#77716a", fontSize: "13px", lineHeight: "1.7" }}>
            Experiencias de clientes, clubes y emprendimientos que eligieron CASACAS LB.
          </p>
        </div>

        <div className="opinions-grid-v0">
          <article className="opinion-card-v0 featured">
            <span className="opinion-quote">“</span>
            <p className="opinion-text">
              La atención, el diseño y el resultado final fueron excelentes. Nos ayudaron a convertir una idea en una identidad para todo el equipo.
            </p>
            <div className="opinion-author">
              <strong>Equipo deportivo</strong>
              <small>Torneo Regional</small>
            </div>
          </article>

          <article className="opinion-card-v0">
            <div className="opinion-stars">★★★★★</div>
            <p className="opinion-text">
              Nos acompañaron en cada detalle de la estampa UV y los parches. Entrega impecable y a tiempo.
            </p>
            <div className="opinion-author">
              <strong>Emprendimiento local</strong>
              <small>Las Breñas</small>
            </div>
          </article>

          <article className="opinion-card-v0">
            <div className="opinion-stars">★★★★★</div>
            <p className="opinion-text">
              Una experiencia simple, cercana y con una prenda que realmente sentimos propia para el grupo.
            </p>
            <div className="opinion-author">
              <strong>Promoción egresados</strong>
              <small>Chaco</small>
            </div>
          </article>
        </div>
      </section>

      {/* 9. MANIFIESTO DE MARCA, composición de una sola columna */}
      <section id="manifiesto" style={{ background: "#252422", color: "#f4f0e8", padding: "100px 8vw", display: "grid", gridTemplateColumns: "1fr", gap: "50px", alignItems: "center" }}>
        <div>
          <p className="hero-eyebrow" style={{ color: "#aaa59d" }}>NO HACEMOS ROPA. HACEMOS SEÑALES.</p>
          <h2 style={{ font: "400 clamp(50px, 6vw, 84px)/0.85 'Bebas Neue'", margin: "0 0 20px" }}>
            Tu equipo.<br /><span style={{ color: "#ff2a1a" }}>Tu código.</span>
          </h2>
          <p style={{ color: "#beb6aa", fontSize: "14px", lineHeight: "1.8", maxWidth: "540px" }}>
            Creemos en las prendas que tienen historia, que aguantan el uso y que representan el lugar de donde venís. Cada producto está pensado para durar y hablar por vos.
          </p>
        </div>
      </section>

      {/* 10. LOCAL & CONTACTO: MAPA INMEDIATAMENTE DEBAJO DEL ENLACE DE GOOGLE MAPS */}
      <section id="local" className="local-section-v0">
        <div className="local-grid-v0">
          <div className="local-heading-v0">
            <p className="hero-eyebrow" style={{ color: "#aaa59d" }}>ESTAMOS CERCA</p>
            <h2>Local, horarios<br /><em>& contacto.</em></h2>
            <p className="local-desc-v0">
              Coordiná tu pedido directo con Leo. El diseño final, las muestras y la producción se confirman por WhatsApp.
            </p>
            <a href="https://wa.me/5493735549290?text=Hola%20Leo%2C%20quiero%20hacer%20una%20consulta%20por%20CASACAS%20LB." target="_blank" rel="noopener" className="local-wa-btn">
              <span>☎</span> Escribir por WhatsApp ↗
            </a>
          </div>

          <div className="local-info-cols">
            <div className="info-box-v0">
              <b>⌖ RETIRO EN EL LOCAL</b>
              <strong>Av. General Jones</strong>
              <p>Entre Mercante y Gral. Vedia<br />Las Breñas, Chaco</p>
              {/* ENLACE Y MAPA INMEDIATAMENTE DEBAJO */}
              <a href="https://maps.app.goo.gl/gJxqQM6dDFkQV5b37" target="_blank" rel="noopener" className="maps-link-v0">
                Abrir ruta en Google Maps ↗
              </a>
              <div className="map-embed-wrapper">
                <iframe
                  title="Ubicación oficial de CASACAS LB"
                  src="https://www.google.com/maps?q=-27.0852594,-61.0864307&z=18&output=embed"
                  loading="lazy"
                />
                <span className="map-location-tag">LAS BREÑAS · CHACO</span>
              </div>
            </div>

            <div className="info-box-v0">
              <b>◷ HORARIOS DE ATENCIÓN</b>
              <strong>Lunes a viernes</strong>
              <p>09:00 a 12:00 hs<br />15:00 a 21:00 hs</p>

              <div style={{ marginTop: "24px" }}>
                <b>↗ CANALES OFICIALES</b>
                <strong style={{ marginTop: "8px" }}>+54 9 3735 549290</strong>
                <p>Instagram: <a href="https://www.instagram.com/casacaslb/" target="_blank" rel="noopener" style={{ color: "#ff2a1a", textDecoration: "underline" }}>@casacaslb</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer-v0">
        <div className="footer-values-row">
          <div><b>CATÁLOGO REAL</b>Precios oficiales de Las Breñas.</div>
          <div><b>PERSONALIZACIÓN</b>Indumentaria, parches y UV.</div>
          <div><b>RETIRO LOCAL</b>Av. General Jones, Las Breñas.</div>
          <div><b>WHATSAPP DIRECTO</b>Atención personalizada con Leo.</div>
        </div>

        <div className="footer-main-v0">
          <img src="/media/logo-casacas-original-blanco-rojo.png" alt="CASACAS LB" />
          <p>Indumentaria para los que<br /><em>hacen que pase.</em></p>
          <div className="footer-links-v0">
            <a href="#catalogo">Catálogo</a>
            <a href="#personaliza">Personalización</a>
            <a href="#opiniones">Opiniones</a>
            <a href="#local">Local & contacto</a>
          </div>
        </div>

        <div className="footer-bottom-v0">
          <span>© 2026 CASACAS LB</span>
          <span>Av. General Jones · Las Breñas, Chaco</span>
          <a href="https://wa.me/5493735549290" target="_blank" rel="noopener">WhatsApp +54 9 3735 549290 ↗</a>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE WHATSAPP */}
      <a href="https://wa.me/5493735549290?text=Hola%20CASACAS%20LB%2C%20quiero%20hacer%20una%20consulta." target="_blank" rel="noopener" className="floating-whatsapp-btn">
        <span style={{ fontSize: "16px" }}>☎</span>
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
