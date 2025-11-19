import axios from "axios";

// Lee las credenciales y la URL base del entorno
const {
  SKYDROPX_CLIENT_ID,
  SKYDROPX_CLIENT_SECRET,
  SKYDROPX_BASE_URL = "https://pro.skydropx.com", // CORREGIDO: Usar pro.skydropx.com
} = process.env;

if (!SKYDROPX_CLIENT_ID || !SKYDROPX_CLIENT_SECRET) {
  console.error("❌ No se encontraron SKYDROPX_CLIENT_ID o SKYDROPX_CLIENT_SECRET en process.env");
}

// Caché en memoria para el token
let tokenCache = {
  accessToken: null,
  expiresAt: 0,
};

/**
 * Obtiene un nuevo token de acceso desde Skydropx.
 */
async function getNewToken() {
  console.log("🔄 Generando nuevo token de Skydropx...");
  
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', SKYDROPX_CLIENT_ID);
    params.append('client_secret', SKYDROPX_CLIENT_SECRET);

    const { data } = await axios.post(
      `${SKYDROPX_BASE_URL}/api/v1/oauth/token`, // CORREGIDO: Usar SKYDROPX_BASE_URL
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, expires_in } = data;
    // Guardamos el token y calculamos el tiempo de expiración
    // Restamos 60 segundos como un margen de seguridad.
    const expiresAt = Date.now() + (expires_in * 1000) - 60000; 
    
    tokenCache = {
      accessToken: access_token,
      expiresAt,
    };

    console.log("✅ Nuevo token de Skydropx generado.");
    return access_token;

  } catch (error) {
    console.error("❌ Error al generar el token de Skydropx:", error.response?.status, error.response?.data);
    throw new Error("No se pudo autenticar con Skydropx.");
  }
}

/**
 * Obtiene un token válido, ya sea desde la caché o generando uno nuevo.
 */
async function getToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
    // Si el token en caché es válido, lo retornamos
    return tokenCache.accessToken;
  }
  // Si no, generamos uno nuevo
  return await getNewToken();
}

/**
 * Realiza una solicitud autenticada a la API de Skydropx.
 */
export async function skydropxRequest(method, path, body = null) {
  try {
    const token = await getToken();

    const { data } = await axios({
      method,
      url: `${SKYDROPX_BASE_URL}${path}`, // El path debe empezar con /api/v1/...
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      data: body ?? undefined,
    });

    return data;
  } catch (error) {
    console.error("❌ Error en solicitud a Skydropx:", error.response?.status, error.response?.data);
    // Si el error es 401, podría ser que el token expiró justo en ese momento.
    // Forzamos la renovación para el siguiente intento.
    if (error.response?.status === 401) {
        console.log("Token posiblemente expirado. Forzando renovación en la próxima solicitud.");
        tokenCache.expiresAt = 0;
    }
    throw error;
  }
}
