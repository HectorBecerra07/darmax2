const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

let cachedModels = null;
let cacheTimestamp = 0;
let pendingFetch = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene de forma sincrona los modelos cacheados en memoria si estan vigentes.
 */
export const getCachedConfiguradorModels = () => {
  const isFresh = cachedModels && (Date.now() - cacheTimestamp < CACHE_TTL_MS);
  return isFresh ? cachedModels : null;
};

/**
 * Obtiene todos los modelos del configurador utilizando cache en memoria y deduplicacion de peticiones.
 * @param {boolean} forceRefresh - Forzar una nueva peticion a la API
 * @returns {Promise<Array>}
 */
export const getConfiguradorModels = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = getCachedConfiguradorModels();
    if (cached) {
      return cached;
    }
  }

  // Si ya hay una peticion en curso, reutilizar la misma promesa
  if (pendingFetch) {
    return pendingFetch;
  }

  pendingFetch = (async () => {
    try {
      const response = await fetch(`${API_URL}/api/configurador/models`);
      if (!response.ok) {
        throw new Error("Error al cargar modelos del configurador");
      }
      const data = await response.json();
      cachedModels = data;
      cacheTimestamp = Date.now();
      return data;
    } finally {
      pendingFetch = null;
    }
  })();

  return pendingFetch;
};

/**
 * Invalida el cache en memoria de modelos.
 */
export const clearConfiguradorModelsCache = () => {
  cachedModels = null;
  cacheTimestamp = 0;
};
