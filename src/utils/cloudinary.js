/**
 * Optimiza URLs de Cloudinary agregando parametros de formato y calidad automatica (f_auto, q_auto),
 * y un ancho maximo para evitar transferencias innecesarias de imagenes de alta resolucion.
 */
export const optimizeCloudinaryUrl = (url, maxWidth = 800) => {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) {
    return url;
  }

  // Si ya contiene f_auto o q_auto, no volver a aplicar
  if (url.includes("/f_auto") || url.includes("/q_auto")) {
    return url;
  }

  const transform = maxWidth ? `w_${maxWidth},f_auto,q_auto` : "f_auto,q_auto";
  return url.replace("/image/upload/", `/image/upload/${transform}/`);
};

export default optimizeCloudinaryUrl;
