// server/utils/skydropx.js
import axios from "axios";

const {
  // OAuth PRO (cotizaciones, etc.)
  SKYDROPX_CLIENT_ID,
  SKYDROPX_CLIENT_SECRET,
  SKYDROPX_BASE_URL = "https://pro.skydropx.com",

  // API clásica (labels, shipments, etc.)
  SKYDROPX_API_KEY,
  SKYDROPX_API_BASE = "https://api.skydropx.com",
} = process.env;

if (!SKYDROPX_CLIENT_ID || !SKYDROPX_CLIENT_SECRET) {
  console.error("❌ No se encontraron SKYDROPX_CLIENT_ID o SKYDROPX_CLIENT_SECRET en process.env");
}

// Caché en memoria para el token OAuth PRO
let tokenCache = {
  accessToken: null,
  expiresAt: 0,
};

/**
 * Obtiene un nuevo token de acceso desde Skydropx PRO (OAuth).
 */
async function getNewToken() {
  console.log("🔄 Generando nuevo token de Skydropx PRO...");

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", SKYDROPX_CLIENT_ID);
    params.append("client_secret", SKYDROPX_CLIENT_SECRET);

    const { data } = await axios.post(
      `${SKYDROPX_BASE_URL}/api/v1/oauth/token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, expires_in } = data;

    const expiresAt = Date.now() + expires_in * 1000 - 60_000;

    tokenCache = {
      accessToken: access_token,
      expiresAt,
    };

    console.log("✅ Nuevo token PRO generado.");
    return access_token;
  } catch (error) {
    console.error(
      "❌ Error al generar el token PRO:",
      error.response?.status,
      error.response?.data
    );
    throw new Error("No se pudo autenticar con Skydropx PRO.");
  }
}

/**
 * Obtiene un token válido (desde caché o nuevo).
 */
async function getToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }
  return await getNewToken();
}

/**
 * Request a la API PRO (pro.skydropx.com) usando OAuth.
 * Ej: cotizaciones /api/v1/quotations
 */
export async function skydropxProRequest(method, path, body = null) {
  try {
    const token = await getToken();

    const { data } = await axios({
      method,
      url: `${SKYDROPX_BASE_URL}${path}`, // path empieza con /api/v1/...
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: body ?? undefined,
    });

    return data;
  } catch (error) {
    console.error(
      "❌ Error en solicitud PRO:",
      error.response?.status,
      error.response?.data
    );
    if (error.response?.status === 401) {
      console.log("Token PRO expirado. Forzando renovación.");
      tokenCache.expiresAt = 0;
    }
    throw error;
  }
}

/**
 * Request a la API clásica (api.skydropx.com) usando API KEY.
 * Ej: /v1/labels, /v1/shipments
 */
export async function skydropxApiRequest(method, path, body = null) {
  if (!SKYDROPX_API_KEY) {
    throw new Error(
      "SKYDROPX_API_KEY no está configurada en las variables de entorno"
    );
  }

  try {
    const { data } = await axios({
      method,
      url: `${SKYDROPX_API_BASE}${path}`, // path empieza con /v1/...
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token token=${SKYDROPX_API_KEY}`,
      },
      data: body ?? undefined,
    });

    return data;
  } catch (error) {
    console.error(
      "❌ Error en solicitud API clásica:",
      error.response?.status,
      error.response?.data
    );
    throw error;
  }
}
