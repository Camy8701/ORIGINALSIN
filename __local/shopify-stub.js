(function () {
  const SHOPIFY_API_FRAGMENT = "originalsin-store.myshopify.com/api/";
  const CART_STATE_KEY = "originalsin_local_cart_state_v1";
  const nativeFetch = window.fetch ? window.fetch.bind(window) : null;
  let catalogPromise;

  if (!nativeFetch) return;

  function localUrl(path) {
    return new URL(path.replace(/^\//, ""), document.baseURI).toString();
  }

  const CATALOG_PATH = localUrl("__local/catalog.json");

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function randomId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function normalizeItems(items) {
    if (Array.isArray(items)) return items;
    return items ? [items] : [];
  }

  function loadCatalog() {
    if (!catalogPromise) {
      catalogPromise = nativeFetch(CATALOG_PATH).then((response) => response.json());
    }
    return catalogPromise;
  }

  function readCartState() {
    try {
      const raw = window.localStorage.getItem(CART_STATE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeCartState(cart) {
    window.localStorage.setItem(CART_STATE_KEY, JSON.stringify(cart));
    return cart;
  }

  function createEmptyCart() {
    return {
      id: `gid://local/Cart/${randomId("cart")}`,
      checkoutUrl: localUrl("checkout"),
      lines: [],
    };
  }

  function findVariant(catalog, merchandiseId) {
    for (const product of catalog.products || []) {
      const variants = (((product || {}).variants || {}).nodes) || [];
      const variant = variants.find((entry) => entry.id === merchandiseId);
      if (variant) {
        return { product, variant };
      }
    }
    return null;
  }

  function buildLine({ lineId, quantity, product, variant }) {
    return {
      id: lineId,
      quantity,
      merchandise: {
        id: variant.id,
        title: variant.title,
        availableForSale: variant.availableForSale,
        quantityAvailable: variant.quantityAvailable,
        sku: variant.sku || "",
        price: clone(variant.price),
        selectedOptions: clone(variant.selectedOptions || []),
        product: {
          featuredImage: clone(((variant.product || {}).featuredImage) || product.featuredImage || null),
          handle: product.handle,
          title: product.title,
          options: clone(product.options || []),
          colorVariants: clone(product.colorVariants || { references: { nodes: [] } }),
          variants: { nodes: clone(((product.variants || {}).nodes) || []) },
        },
      },
      attributes: [],
      cost: {
        amountPerQuantity: clone(variant.price),
      },
    };
  }

  function calculateTotalAmount(lines) {
    const total = lines.reduce((sum, line) => {
      const amount = parseFloat((((line || {}).merchandise || {}).price || {}).amount || "0");
      return sum + amount * (line.quantity || 0);
    }, 0);
    return total.toFixed(2);
  }

  function buildCartPayload(cart) {
    const lines = cart.lines || [];
    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      totalQuantity: lines.reduce((sum, line) => sum + (line.quantity || 0), 0),
      lines: {
        edges: lines.map((line, index) => ({
          cursor: `cursor-${index + 1}`,
          node: line,
        })),
      },
      cost: {
        totalAmount: {
          amount: calculateTotalAmount(lines),
          currencyCode: "USD",
        },
      },
    };
  }

  function jsonResponse(payload) {
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async function handleCartCreate() {
    const cart = writeCartState(createEmptyCart());
    return jsonResponse({
      data: {
        cartCreate: {
          cart: {
            id: cart.id,
          },
        },
      },
    });
  }

  async function handleFetchCart(variables) {
    const cart = readCartState();
    const payload = cart && cart.id === variables.id ? buildCartPayload(cart) : null;
    return jsonResponse({
      data: {
        cart: payload,
      },
    });
  }

  async function handleCartLinesAdd(variables) {
    const catalog = await loadCatalog();
    const cart = readCartState() || createEmptyCart();
    const items = normalizeItems(variables.items);

    for (const item of items) {
      const match = findVariant(catalog, item.merchandiseId);
      if (!match) continue;
      const existing = cart.lines.find((line) => line.merchandise.id === item.merchandiseId);
      const quantityToAdd = Math.max(1, Number(item.quantity || 1));
      if (existing) {
        existing.quantity += quantityToAdd;
      } else {
        cart.lines.push(
          buildLine({
            lineId: `gid://local/CartLine/${randomId("line")}`,
            quantity: quantityToAdd,
            product: match.product,
            variant: match.variant,
          })
        );
      }
    }

    writeCartState(cart);
    return jsonResponse({
      data: {
        cartLinesAdd: {
          cart: buildCartPayload(cart),
          userErrors: [],
        },
      },
    });
  }

  async function handleCartLinesUpdate(variables) {
    const cart = readCartState() || createEmptyCart();
    const items = normalizeItems(variables.items);
    for (const item of items) {
      const line = cart.lines.find((entry) => entry.id === item.id);
      if (!line) continue;
      const quantity = Math.max(0, Number(item.quantity || 0));
      if (quantity === 0) {
        cart.lines = cart.lines.filter((entry) => entry.id !== item.id);
      } else {
        line.quantity = quantity;
      }
    }
    writeCartState(cart);
    return jsonResponse({
      data: {
        cartLinesUpdate: {
          cart: buildCartPayload(cart),
          userErrors: [],
        },
      },
    });
  }

  async function handleCartLinesRemove(variables) {
    const cart = readCartState() || createEmptyCart();
    const removeIds = new Set(variables.lineIds || []);
    cart.lines = cart.lines.filter((entry) => !removeIds.has(entry.id));
    writeCartState(cart);
    return jsonResponse({
      data: {
        cartLinesRemove: {
          cart: buildCartPayload(cart),
          userErrors: [],
        },
      },
    });
  }

  async function interceptShopifyRequest(input, init) {
    const request = input instanceof Request ? input : null;
    const url = request ? request.url : String(input);
    if (!url.includes(SHOPIFY_API_FRAGMENT)) {
      return nativeFetch(input, init);
    }

    const bodyText = request ? await request.clone().text() : (init && init.body) || "";
    const payload = bodyText ? JSON.parse(bodyText) : {};
    const query = payload.query || "";
    const variables = payload.variables || {};

    if (query.includes("mutation cartCreate")) {
      return handleCartCreate();
    }
    if (query.includes("query FetchCart")) {
      return handleFetchCart(variables);
    }
    if (query.includes("mutation AddItemToCart") || query.includes("cartLinesAdd")) {
      return handleCartLinesAdd(variables);
    }
    if (query.includes("mutation cartLinesUpdate")) {
      return handleCartLinesUpdate(variables);
    }
    if (query.includes("mutation cartLinesRemove")) {
      return handleCartLinesRemove(variables);
    }

    return jsonResponse({ data: {} });
  }

  window.fetch = function patchedFetch(input, init) {
    return interceptShopifyRequest(input, init);
  };
})();
