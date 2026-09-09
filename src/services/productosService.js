const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

let cachedProductos = null;
let productosTimestamp = 0;
let pendingProductosFetch = null;

let cachedCategorias = null;
let categoriasTimestamp = 0;
let pendingCategoriasFetch = null;

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene sincronamente los productos cacheados si siguen vigentes.
 */
export const getCachedProductos = () => {
  const isFresh = cachedProductos && (Date.now() - productosTimestamp < CACHE_TTL_MS);
  return isFresh ? cachedProductos : null;
};

/**
 * Obtiene los productos con cache en memoria y deduplicacion de peticiones concurrentes.
 * @param {boolean} forceRefresh
 * @returns {Promise<Array>}
 */
export const getProductos = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = getCachedProductos();
    if (cached) {
      return cached;
    }
  }

  if (pendingProductosFetch) {
    return pendingProductosFetch;
  }

  pendingProductosFetch = (async () => {
    try {
      const response = await fetch(`${API_URL}/api/productos`);
      if (!response.ok) {
        throw new Error("Error al cargar los productos");
      }
      const data = await response.json();
      cachedProductos = data;
      productosTimestamp = Date.now();
      return data;
    } finally {
      pendingProductosFetch = null;
    }
  })();

  return pendingProductosFetch;
};

/**
 * Obtiene categorias con cache en memoria.
 * @param {boolean} forceRefresh
 * @returns {Promise<Array>}
 */
export const getCategorias = async (forceRefresh = false) => {
  const isFresh = cachedCategorias && (Date.now() - categoriasTimestamp < CACHE_TTL_MS);
  if (!forceRefresh && isFresh) {
    return cachedCategorias;
  }

  if (pendingCategoriasFetch) {
    return pendingCategoriasFetch;
  }

  pendingCategoriasFetch = (async () => {
    try {
      const response = await fetch(`${API_URL}/api/categorias`);
      if (!response.ok) {
        throw new Error("Error al cargar categorias");
      }
      const data = await response.json();
      cachedCategorias = data;
      categoriasTimestamp = Date.now();
      return data;
    } finally {
      pendingCategoriasFetch = null;
    }
  })();

  return pendingCategoriasFetch;
};

/**
 * Invalida el cache de productos.
 */
export const clearProductosCache = () => {
  cachedProductos = null;
  productosTimestamp = 0;
  cachedCategorias = null;
  categoriasTimestamp = 0;
};
