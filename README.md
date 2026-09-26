# 🍍 FruitsIsland — Tienda online de fruta tropical

Tienda virtual completa hecha con **Next.js 16 + Tailwind CSS**. Los productos, precios, zonas de envío y planes del Club están en archivos **JSON fáciles de editar** (carpeta `data/`). No necesitas base de datos.

---

## 1. Resumen del diseño

| Elemento | Decisión |
|---|---|
| Paleta | Verde hoja `#2F8F4E`, amarillo mango `#FFC23D`, coral papaya `#FF7A59`, blanco arena `#FFF8EC` |
| Tipografía | **Fredoka** (títulos, redondeada) + **Nunito** (textos) |
| Estilo | Fotos grandes, esquinas muy redondeadas, mucho espacio en blanco, botones tipo "píldora" |
| Idiomas | Español por defecto, botón **ES / EN** en el menú (se recuerda la elección) |
| Móvil primero | Menú lateral, carrito lateral a pantalla completa, botones de al menos 44 px |

**Páginas (URLs limpias):**

| URL | Página |
|---|---|
| `/` | Inicio: banner, beneficios, categorías, más vendidos, Club, cajas de regalo, testimonios (marcados como ejemplo), newsletter |
| `/tienda` | Catálogo con filtros (categoría, precio, temporada) y orden (popularidad, precio) |
| `/producto/mango-ataulfo` | Producto: galería, descripción, origen, peso/cantidad, selector de tamaño, agregar al carrito, relacionados |
| `/cajas-regalo` | Cajas armadas + **Arma tu propia caja** |
| `/club` | Suscripción semanal o mensual con 3 planes |
| `/checkout` | Pago en 3 pasos: datos y entrega → regalo → pago |
| `/cuenta` | Pedidos, direcciones y suscripción |
| `/nosotros`, `/preguntas-frecuentes`, `/contacto`, `/envios`, `/devoluciones` | Páginas informativas |

**Funciones:** carrito lateral que se guarda aunque se cierre la página · Stripe y PayPal · cupones · calculadora de envío por zona o código postal · mensaje de regalo y fecha de entrega · botón flotante de WhatsApp · SEO (títulos, descripciones, `sitemap.xml`, `robots.txt`, datos estructurados de producto y FAQ, imagen para compartir) · accesibilidad (navegación con teclado, textos alternativos, contraste, "saltar al contenido", respeta "reducir movimiento").

**Seguridad de precios:** el navegador solo muestra los totales; al pagar, el servidor **recalcula todo** con los JSON (precios, cupones y envío), así nadie puede cambiar precios. La lista de cupones nunca se envía al navegador.

## 2. Estructura de carpetas

```
├── app/                         ← Páginas (cada carpeta = una URL)
│   ├── page.tsx                 ← Inicio
│   ├── tienda/                  ← /tienda
│   ├── producto/[slug]/         ← /producto/nombre-del-producto
│   ├── cajas-regalo/  club/  checkout/  checkout/exito/  cuenta/
│   ├── nosotros/  preguntas-frecuentes/  contacto/  envios/  devoluciones/
│   ├── api/                     ← Servidor: cupones, Stripe y PayPal
│   ├── layout.tsx               ← Estructura común, fuentes y SEO general
│   ├── globals.css              ← Estilos de botones, campos, etc.
│   ├── sitemap.ts  robots.ts  opengraph-image.tsx  icon.svg
├── components/                  ← Piezas reutilizables (menú, carrito, tarjetas…)
├── data/                        ← ✏️ LO QUE TÚ EDITAS
│   ├── products.json            ← Productos, precios, tamaños y fotos
│   ├── settings.json            ← Datos de la tienda, WhatsApp, envíos, Club, categorías
│   └── coupons.json             ← Cupones de descuento
├── lib/                         ← Lógica: carrito, precios, idiomas, cuenta, pagos
├── public/images/               ← ✏️ Tus fotos
├── scripts/generate-images.mjs  ← Genera las ilustraciones de ejemplo
├── tailwind.config.ts           ← ✏️ Colores de la marca
└── .env.example                 ← Claves de Stripe y PayPal (plantilla)
```

---

## 3. Guía para personas sin experiencia en programación

> Puedes editar todo **directamente en GitHub desde el navegador**: abre el archivo, pulsa el lápiz ✏️ (*Edit this file*), haz el cambio y pulsa **Commit changes**. Si la tienda está conectada a Vercel, se actualiza sola en 1–2 minutos.

### ✏️ Cambiar un precio
1. Abre `data/products.json`.
2. Busca el producto (usa Ctrl+F / Cmd+F, por ejemplo "Mango").
3. Dentro de `"sizes"` cambia el número después de `"price"`:
   ```json
   { "id": "chica", "label": "Caja chica", "detail": "6 piezas · aprox. 1.5 kg", "price": 16 }
   ```
   Escribe solo números, con punto para decimales: `16`, `16.5`. Sin el signo `$`.
4. Para mostrar un precio "antes" tachado (oferta), pon un número en `"compareAtPrice"`. Si no quieres oferta, deja `null`.

### ➕ Agregar un producto nuevo
1. En `data/products.json`, copia un producto completo (desde `{` hasta `},`) y pégalo debajo.
2. Cambia:
   - `"slug"`: el nombre en la URL, **sin espacios, acentos ni mayúsculas** (ej. `"guayaba-rosa"`). Debe ser único.
   - `"name"`, `"description"`, `"origin"` (y sus versiones `_en` en inglés, opcionales).
   - `"category"`: una de `tropicales`, `exoticas`, `cajas-regalo`, `deshidratadas`, `jugos`, `combos`.
   - `"season"`: lista de `primavera`, `verano`, `otono`, `invierno` o `todo-el-ano`.
   - `"sizes"`: los tamaños con su precio (mínimo uno).
   - `"popularity"`: número del 1 al 100 (ordena "Más populares").
   - `"bestseller": true` para que salga en "Los más vendidos" del inicio.
   - `"boxPrice"`: precio por porción en "Arma tu caja" (pon `null` si no quieres que aparezca ahí).
3. **Ojo con las comas:** cada producto va separado por una coma, pero el último de la lista no lleva coma después de `}`. Si algo falla, pega el archivo en <https://jsonlint.com> para encontrar el error.

### 🙈 Ocultar un producto (sin borrarlo)
Cambia `"available": true` por `"available": false`.

### 📷 Cambiar las fotos
Las imágenes incluidas son ilustraciones originales de ejemplo. Para usar fotos reales:
1. Prepara fotos **cuadradas** (ideal 1200×1200 px, formato `.jpg` o `.webp`, menos de 500 KB).
2. En GitHub entra a `public/images/products/` → **Add file → Upload files** y sube tus fotos (nombres sin espacios, ej. `mango-real-1.jpg`).
3. En `data/products.json` cambia la ruta en `"images"`:
   ```json
   "images": ["/images/products/mango-real-1.jpg", "/images/products/mango-real-2.jpg"]
   ```
   La primera foto es la principal; las demás salen en la galería.
4. La imagen del banner principal es `public/images/hero.svg` (puedes subir `hero.jpg` y cambiar la ruta en `app/page.tsx`).

Next.js optimiza tus fotos automáticamente para que carguen rápido.

### 🎟️ Cupones de descuento
Edita `data/coupons.json`. Tipos:
- `"percent"`: porcentaje (`"value": 10` = 10 %).
- `"fixed"`: monto fijo (`"value": 5` = $5).
- `"free_shipping"`: envío gratis.

`"minSubtotal"` es la compra mínima, `"active": false` desactiva el cupón y puedes añadir `"expires": "2026-12-31"` para que caduque.

### 🚚 Envíos, WhatsApp y datos de la tienda
Todo está en `data/settings.json`:
- `"whatsapp" → "number"`: tu número con código de país, **solo dígitos** (México: `52155…`, Colombia: `57…`, España: `34…`).
- `"email"`, `"phone"`, `"address"`, `"hours"`, redes sociales y el texto de la barra superior (`"announcement"`).
- `"shippingZones"`: cada zona con `"price"` (costo), `"freeFrom"` (envío gratis desde ese monto; `0` = nunca), `"eta"` (tiempo de entrega) y `"postalPrefixes"` (códigos postales que empiezan así pertenecen a esa zona).
- `"club" → "plans"`: nombre, descripción y precios semanal/mensual de cada plan.
- `"boxBuilder"`: tamaños de "Arma tu caja" y su precio base.
- `"currency"`: moneda (`USD`, `MXN`, `COP`, `EUR`…). `"priceLocale"`: formato del precio (`es-MX`, `es-CO`, `en-US`…).
- `"forms"`: pega aquí una URL de [Formspree](https://formspree.io) (gratis) para recibir en tu correo los mensajes de contacto y las suscripciones al newsletter.

### 🎨 Cambiar colores
En `tailwind.config.ts` cambia los códigos de color de `leaf` (verde), `mango` (amarillo), `coral` y `sand` (arena).

### ❓ Preguntas frecuentes y testimonios
- Preguntas: `lib/faq.ts`.
- Testimonios: `components/Testimonials.tsx` (son **de ejemplo**; reemplázalos por opiniones reales y quita la etiqueta "Ejemplo").

---

## 4. Publicar gratis en Vercel (paso a paso)

1. **Crea cuentas gratis** en [github.com](https://github.com) y en [vercel.com](https://vercel.com) (en Vercel elige *Continue with GitHub*).
2. **Ten el código en GitHub.** Este repositorio ya está en GitHub; si trabajas con una copia, súbela a un repositorio tuyo.
3. En Vercel pulsa **Add New… → Project**, busca tu repositorio y pulsa **Import**.
4. Vercel detecta Next.js solo. No cambies nada y pulsa **Deploy**.
5. En 1–2 minutos tendrás tu tienda en una dirección como `https://fruitsisland.vercel.app`. 🎉
6. Ve a **Settings → Environment Variables** y agrega `NEXT_PUBLIC_SITE_URL` con esa dirección. Luego **Deployments → ⋯ → Redeploy**.
7. Cambia también `"siteUrl"` en `data/settings.json` por tu dirección.

Desde ese momento, **cada cambio que guardes en GitHub se publica automáticamente**.

### Dominio propio (opcional)
En Vercel: **Settings → Domains → Add**, escribe tu dominio (ej. `fruitsisland.com`) y sigue las instrucciones para configurar el DNS donde lo compraste.

### Activar los pagos reales
Sin claves, la tienda funciona en **modo demostración** (se puede comprar, pero no se cobra).

**Stripe (tarjetas + suscripciones del Club):**
1. Crea una cuenta en [stripe.com](https://stripe.com) y activa tu cuenta con los datos de tu negocio.
2. Ve a **Developers → API keys** y copia la *Secret key* (`sk_test_…` para pruebas).
3. En Vercel → Settings → Environment Variables agrega `STRIPE_SECRET_KEY` con esa clave → **Redeploy**.
4. Prueba con la tarjeta `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC.
5. Cuando todo funcione, cambia a la clave `sk_live_…` para cobrar de verdad.
6. Tus pedidos, datos de entrega y mensajes de regalo aparecen en **Stripe → Payments** (sección *Metadata*). Las suscripciones, en **Stripe → Subscriptions**, desde donde puedes pausarlas o cancelarlas. Activa los correos de recibo en **Settings → Customer emails**.

**PayPal (compras de una sola vez):**
1. Entra a [developer.paypal.com](https://developer.paypal.com) → **Apps & Credentials** → **Create App**.
2. Copia el *Client ID* y el *Secret*.
3. En Vercel agrega `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV` (`sandbox` para pruebas, `live` para cobrar) y `PAYPAL_COUNTRY_CODE` (ej. `MX`) → **Redeploy**.
4. Los pedidos aparecen en tu cuenta de PayPal. Los detalles del regalo quedan en **Vercel → Logs**.

> Las suscripciones del Club se cobran con Stripe (PayPal se desactiva automáticamente si el carrito tiene una suscripción).

---

## 5. Para desarrolladores

```bash
npm install
cp .env.example .env.local   # opcional
npm run dev                  # http://localhost:3000
npm run build                # compilación de producción
npm run typecheck
node scripts/generate-images.mjs   # regenera las ilustraciones de ejemplo
```

**Siguientes pasos recomendados:**
- *Cuentas con inicio de sesión:* hoy "Mi cuenta" guarda pedidos y direcciones en el dispositivo del cliente. Para cuentas multi-dispositivo, agrega [Clerk](https://clerk.com) o [Auth.js](https://authjs.dev) y guarda los pedidos con un webhook de Stripe (`checkout.session.completed`) en una base de datos (Vercel Postgres, Supabase).
- *Portal de suscripción:* activa el [Customer Portal de Stripe](https://dashboard.stripe.com/settings/billing/portal) para que los clientes gestionen su plan desde el enlace del correo.
- *Inventario:* usa `"available": false` para agotar productos, o conecta un CMS si el catálogo crece mucho.
