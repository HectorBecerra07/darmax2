/**
 * Optimiza URLs de Cloudinary agregando parametros de formato y calidad automatica (f_auto, q_auto),
 * un ancho maximo para transferencias eficientes y versionamiento para invalidacion de cache.
 */

// Version de compilacion o variable de entorno para evitar que el navegador guarde en cache imagenes desactualizadas
const DEFAULT_IMAGE_VERSION = 
  (typeof __APP_BUILD_TIME__ !== "undefined" ? __APP_BUILD_TIME__ : "") ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_IMAGE_CACHE_VERSION) ||
  "1";

export const optimizeCloudinaryUrl = (url, maxWidth = 800, customVersion = null) => {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) {
    return url;
  }

  let optimized = url;

  // Si no contiene f_auto ni q_auto, aplicar optimizaciones de transformacion
  if (!optimized.includes("/f_auto") && !optimized.includes("/q_auto")) {
    const transform = maxWidth ? `w_${maxWidth},f_auto,q_auto` : "f_auto,q_auto";
    optimized = optimized.replace("/image/upload/", `/image/upload/${transform}/`);
  }

  // Version para cache busting: si se renuevan imagenes en Cloudinary, evita retencion forzada de 30 dias del navegador
  const activeVersion = customVersion || (typeof import.meta !== "undefined" && import.meta.env?.VITE_IMAGE_CACHE_VERSION) || DEFAULT_IMAGE_VERSION;
  if (activeVersion && !optimized.includes("?v=") && !optimized.includes("&v=")) {
    const separator = optimized.includes("?") ? "&" : "?";
    optimized = `${optimized}${separator}v=${activeVersion}`;
  }

  return optimized;
};

export default optimizeCloudinaryUrl;
