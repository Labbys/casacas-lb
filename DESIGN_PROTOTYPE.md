# CASACAS LB — Sistema Visual y Prototipo V0

## Design Read
- **Artifact:** Prototipo visual interactivo de tienda / catálogo de indumentaria.
- **Audience:** Clientes, equipos, deportistas y personas que buscan indumentaria y personalización.
- **Visual Language:** Editorial deportiva, estética urbana, contraste hueso/carbón con acento rojo señal, tipografía condensada y rectángulos inclinados.
- **Mode:** Greenfield de diseño (las pantallas se construyen puramente en interfaz de cliente).

## Cinco Diales de Calibración
- **Visual-variance:** 6/10 (ritmo entre bloques grandes, tarjetas condensadas y diagonales).
- **Motion-intensity:** 6/10 (microinteracciones rápidas, hover con 3 vistas, drag suave, marquee continuo, sticky header translúcido).
- **Information-density:** 7/10 (catálogo con precios, personalizaciones y estados comerciales claros).
- **Asset-dependence:** 8/10 (logo oficial, marcos de prendas y gráficos editoriales).
- **Brand-fidelity:** 10/10 (estricto respeto a la identidad CASACAS LB).

## Paleta de Colores
- Fondo principal: `#F4F0E8` (hueso cálido)
- Fondo oscuro suave: `#252422` (carbón suavizado, no negro puro)
- Fondo secundario claro: `#EEE9DF`
- Acento / Llamado a la acción: `#FF2A1A` (rojo señal CASACAS)
- Texto principal: `#151515`
- Texto secundario / metadatos: `#77716A`
- Bordes / líneas de grilla: `#D9D1C5` / `#CFC7BB`

## Tipografía
- Titulares y números grandes: `Bebas Neue`
- Textos, precios, navegación y formularios: `Manrope` (pesos 400, 500, 600, 700, 800)

## Pantallas incluidas en el prototipo
1. **Inicio / Landing:** Marquesina de derecha a izquierda, hero con 3 diapositivas arrastrables, manifiesto de marca, llamadas a catálogo y contacto.
2. **Catálogo:** Filtros por categoría (con estilo activo ampliado, negrita e inclinación), tarjetas sin etiqueta redundante y con 3 imágenes intercaladas al pasar el cursor.
3. **Vista previa / Detalle de producto:** Modal interactivo con galería de 3 imágenes arrastrables con el mouse, selector de cantidad con `−` y `+`, precios y pedido por WhatsApp.
4. **Carrito:** Sustitución completa de "Bolsa" por "Carrito", listado de ítems, cantidades editables, total y confirmación de pedido por WhatsApp.
5. **Personalizá:** Sección de pasos para encargar prendas personalizadas para equipos y marcas.
6. **Opiniones:** Testimonios en tarjetas editoriales sin numeraciones `01, 02`.
7. **Local & Contacto:** Dirección, horarios, enlace a Google Maps y mapa ubicado inmediatamente debajo con tamaño proporcionado.

## Estados interactivos
- Sticky header translúcido al scrollear hacia abajo, con retorno a opacidad completa al pasar el mouse por encima.
- Menú lateral deslizante sin numeraciones.
- Buscador flotante.
- Galería de tarjetas que pasa por las 3 fotos al hover.
- Selector de cantidad dentro del detalle del producto.
- Sin códigos ni números `01, 02, 03, 04` o `02/03`.
