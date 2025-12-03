// server/utils/skydropx.js
import axios from "axios";

const {
  SKYDROPX_CLIENT_ID,
  SKYDROPX_CLIENT_SECRET,
  SKYDROPX_BASE_URL = "https://pro.skydropx.com",
} = process.env;

if (!SKYDROPX_CLIENT_ID || !SKYDROPX_CLIENT_SECRET) {
  console.error(
    "❌ No se encontraron SKYDROPX_CLIENT_ID o SKYDROPX_CLIENT_SECRET en process.env"
  );
}

// Caché en memoria para el token OAuth PRO
let tokenCache = {
  accessToken: null,
  expiresAt: 0,
};

async function getNewToken() {
  console.log("🔄 Generando nuevo token de Skydropx PRO...");

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
}

async function getToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }
  return await getNewToken();
}

// 👉 Helper general para API PRO (cotizaciones, shipments, etc.)
export async function skydropxProRequest(method, path, body = null) {
  try {
    const token = await getToken();

    const { data } = await axios({
      method,
      url: `${SKYDROPX_BASE_URL}${path}`, // path debe empezar con /api/v1/...
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

    // Si el token caduca, forzamos renovar en la siguiente
    if (error.response?.status === 401) {
      tokenCache.expiresAt = 0;
    }
    throw error;
  }
}
