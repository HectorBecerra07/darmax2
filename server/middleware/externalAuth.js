import crypto from "crypto";

const externalAuthMiddleware = (req, res, next) => {
  const configuredApiKey = process.env.EXTERNAL_API_KEY;

  if (!configuredApiKey) {
    console.error("EXTERNAL_API_KEY no esta configurada en las variables de entorno.");
    return res.status(500).json({
      success: false,
      message: "Error de configuracion en el servidor para servicios externos.",
    });
  }

  // Soporta Authorization: Bearer <token> o x-api-key: <token>
  const authHeader = req.headers.authorization;
  const customHeader = req.headers["x-api-key"];

  let providedToken = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    providedToken = authHeader.slice(7).trim();
  } else if (customHeader && typeof customHeader === "string") {
    providedToken = customHeader.trim();
  }

  if (!providedToken) {
    return res.status(401).json({
      success: false,
      message: "Se requiere autenticacion mediante Bearer Token (Authorization: Bearer <TOKEN>) o encabezado x-api-key.",
    });
  }

  // Comparacion segura contra ataques de temporizacion
  const configuredBuffer = Buffer.from(configuredApiKey);
  const providedBuffer = Buffer.from(providedToken);

  const isValid =
    configuredBuffer.length === providedBuffer.length &&
    crypto.timingSafeEqual(configuredBuffer, providedBuffer);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: "Token de acceso externo invalido o no autorizado.",
    });
  }

  req.isExternalService = true;
  next();
};

export default externalAuthMiddleware;
