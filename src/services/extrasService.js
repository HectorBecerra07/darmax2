const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Obtiene los extras asociados a un modelo específico usando su slug.
 * @param {string} slug - El slug del modelo (ej: "neptuno", "atlantis").
 * @returns {Promise<Array>} - Lista de extras configurados para ese modelo.
 */
export const getExtrasByModelSlug = async (slug) => {
  try {
    const response = await fetch(`${API_URL}/api/configurador/models/${slug}/extras`);
    if (!response.ok) {
      throw new Error(`Error al obtener extras para el modelo ${slug}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("getExtrasByModelSlug error:", error);
    throw error;
  }
};

/**
 * Obtiene todos los extras disponibles en el sistema.
 * @param {boolean|null} isTinaco - true para solo tinacos, false para no tinacos, null para todos.
 * @returns {Promise<Array>} - Lista de extras.
 */
export const getAllExtras = async (isTinaco = null) => {
  try {
    let url = `${API_URL}/api/configurador/extras`;
    if (isTinaco !== null) {
      url += `?isTinaco=${isTinaco}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener todos los extras: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("getAllExtras error:", error);
    throw error;
  }
};
