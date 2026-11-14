// src/services/bundlePricingService.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const CONFIG_KEY = "bundle_prices";

export const DEFAULT_BUNDLE_PRICES = {
  "Duo-Emprendedor": {
    "AtlantisMaxTouch": {
      "Vending8": 141900,
      "Vending5": 131900,
    },
    "AtlantisTouch": {
      "Vending8": 113900,
      "Vending5": 103900,
    },
    "AtlantisMax": {
      "Vending8": 137900,
      "Vending5": 127900,
    },
    "Atlantis": {
      "Vending8": 109900,
      "Vending5": 99900,
    },
  },
  "Tridente": {
    "AtlantisMaxTouch": {
      "Vending5": 152900,
    },
    "AtlantisTouch": {
      "Vending5": 124900,
    },
    "AtlantisMax": {
      "Vending5": 148900,
    },
    "Atlantis": {
      "Vending5": 120900,
    },
  },
  "Megalodon": {
    "AtlantisMaxTouch": {
      "Vending8": 162900,
    },
    "AtlantisTouch": {
      "Vending8": 134900,
    },
    "AtlantisMax": {
      "Vending8": 158900,
    },
    "Atlantis": {
      "Vending8": 130900,
    },
  },
};

let cachedBundlePrices = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minuto en memoria

/**
 * Normaliza las claves de modelo para comparaciones consistentes.
 */
export const normalizeModelKey = (slugOrName = "") => {
  const clean = slugOrName.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (clean.includes("atlantis") && clean.includes("max") && clean.includes("touch")) return "AtlantisMaxTouch";
  if (clean.includes("atlantis") && clean.includes("touch")) return "AtlantisTouch";
  if (clean.includes("atlantis") && clean.includes("max")) return "AtlantisMax";
  if (clean.includes("atlantis")) return "Atlantis";
  if (clean.includes("vending8") || clean.includes("8")) return "Vending8";
  if (clean.includes("vending5") || clean.includes("5")) return "Vending5";
  return slugOrName;
};

/**
 * Obtiene los precios de paquetes desde la API (tabla Configuration), con fallback a los valores por defecto.
 */
export const getBundlePrices = async (forceRefresh = false) => {
  if (!forceRefresh && cachedBundlePrices && Date.now() - lastFetchTime < CACHE_TTL) {
    return cachedBundlePrices;
  }

  try {
    const res = await fetch(`${API_URL}/api/configuration/${CONFIG_KEY}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.value) {
        const parsed = JSON.parse(data.value);
        cachedBundlePrices = {
          ...DEFAULT_BUNDLE_PRICES,
          ...parsed,
          "Duo-Emprendedor": { ...DEFAULT_BUNDLE_PRICES["Duo-Emprendedor"], ...(parsed["Duo-Emprendedor"] || {}) },
          "Tridente": { ...DEFAULT_BUNDLE_PRICES["Tridente"], ...(parsed["Tridente"] || {}) },
          "Megalodon": { ...DEFAULT_BUNDLE_PRICES["Megalodon"], ...(parsed["Megalodon"] || {}) },
        };
        lastFetchTime = Date.now();
        return cachedBundlePrices;
      }
    }
  } catch (error) {
    console.warn("No se pudo cargar precios personalizados de paquetes, usando valores por defecto:", error);
  }

  cachedBundlePrices = DEFAULT_BUNDLE_PRICES;
  lastFetchTime = Date.now();
  return cachedBundlePrices;
};

/**
 * Guarda los precios de paquetes en la base de datos a través de /api/configuration
 */
export const saveBundlePrices = async (prices) => {
  const res = await fetch(`${API_URL}/api/configuration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: CONFIG_KEY,
      value: JSON.stringify(prices),
    }),
  });

  if (!res.ok) {
    throw new Error("Error al guardar la configuración de precios de paquetes en el servidor.");
  }

  cachedBundlePrices = prices;
  lastFetchTime = Date.now();
  return prices;
};

/**
 * Calcula el precio base del paquete según las máquinas seleccionadas.
 */
export const calculateBundleBasePrice = (bundleId, aguaModel, limpiezaModel, prices = DEFAULT_BUNDLE_PRICES) => {
  const normalizedBundleId =
    bundleId?.toLowerCase().includes("duo") ? "Duo-Emprendedor" :
    bundleId?.toLowerCase().includes("tridente") ? "Tridente" :
    bundleId?.toLowerCase().includes("megalodon") ? "Megalodon" : bundleId;

  const bundleConfig = prices[normalizedBundleId] || DEFAULT_BUNDLE_PRICES[normalizedBundleId];
  if (!bundleConfig) return 0;

  const aguaKey = normalizeModelKey(aguaModel?.slug || aguaModel?.name || "");
  const aguaGroup = bundleConfig[aguaKey] || bundleConfig["AtlantisTouch"] || Object.values(bundleConfig)[0];
  if (!aguaGroup) return 0;

  const limpiezaKey = normalizeModelKey(limpiezaModel?.slug || limpiezaModel?.name || (normalizedBundleId === "Megalodon" ? "Vending8" : "Vending5"));
  
  if (typeof aguaGroup[limpiezaKey] === "number") {
    return aguaGroup[limpiezaKey];
  }

  // Fallback si la combinacion exacta no existe
  const fallbackPrice = Object.values(aguaGroup)[0];
  return typeof fallbackPrice === "number" ? fallbackPrice : 0;
};
