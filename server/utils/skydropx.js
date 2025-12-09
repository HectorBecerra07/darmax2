import axios from "axios";

const {
  SKYDROPX_ENV = "sandbox",

  SKYDROPX_BASE_URL_PRO,
  SKYDROPX_CLIENT_ID_PRO,
  SKYDROPX_CLIENT_SECRET_PRO,

  SKYDROPX_BASE_URL_SB,
  SKYDROPX_CLIENT_ID_SB,
  SKYDROPX_CLIENT_SECRET_SB,
} = process.env;

const isProd = SKYDROPX_ENV === "production";

const BASE_URL = isProd
  ? SKYDROPX_BASE_URL_PRO || "https://pro.skydropx.com"
  : SKYDROPX_BASE_URL_SB || "https://sb-pro.skydropx.com";

const SKYDROPX_CLIENT_ID = isProd ? SKYDROPX_CLIENT_ID_PRO : SKYDROPX_CLIENT_ID_SB;
const SKYDROPX_CLIENT_SECRET = isProd
  ? SKYDROPX_CLIENT_SECRET_PRO
  : SKYDROPX_CLIENT_SECRET_SB;

if (!SKYDROPX_CLIENT_ID || !SKYDROPX_CLIENT_SECRET) {
  console.error(
    "❌ No se encontraron credenciales de Skydropx para el entorno:",
    SKYDROPX_ENV
  );
} else {
  console.log(
    `🌐 Skydropx PRO usando base URL: ${BASE_URL} (ENV=${SKYDROPX_ENV}) client_id=${SKYDROPX_CLIENT_ID.slice(0, 4)}***`
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

  const { data } = await axios.post(`${BASE_URL}/api/v1/oauth/token`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

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

export async function skydropxProRequest(method, path, body = null) {
  try {
    const token = await getToken();
    const url = `${BASE_URL}${path}`; // path debe empezar con /api/v1/...

    console.log(`🚀 SkydropxRequest -> ${method} ${url}`);

    const { data } = await axios({
      method,
      url,
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
      error.response?.data || String(error)
    );

    if (error.response?.status === 401) {
      tokenCache.expiresAt = 0;
    }
    throw error;
  }
}
