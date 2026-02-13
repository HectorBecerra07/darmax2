import axios from "axios";

/**
 * Verifies a Google reCAPTCHA v3 token.
 * @param {string} token - The token received from the frontend.
 * @returns {Promise<{success: boolean, message: string, errors?: string[]}>} - An object indicating success, a message, and optional error codes.
 */
export async function verifyRecaptcha(token) {
  if (!token) {
    return { success: false, message: "Token de reCAPTCHA no proporcionado." };
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not set in environment variables. Skipping verification (unsafe).");
    return { success: true, message: "Verificación omitida por falta de clave secreta." };
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );
    
    const data = response.data;
    
    if (!data.success) {
        const message = "La API de Google reCAPTCHA indicó un fallo.";
        console.warn(`${message} Errores:`, data["error-codes"]);
        return { success: false, message, errors: data["error-codes"] };
    }

    // v3 check: Verify score
    // 1.0 is very likely a good user, 0.0 is very likely a bot
    const threshold = 0.5;
    if (data.score < threshold) {
        const message = `Puntuación de reCAPTCHA demasiado baja: ${data.score} (Umbral: ${threshold})`;
        console.warn(message);
        return { success: false, message };
    }

    return { success: true, message: "Verificación de reCAPTCHA exitosa." };
  } catch (error) {
    const message = "Error de red o excepción durante la verificación de reCAPTCHA.";
    console.error(message, error);
    return { success: false, message };
  }
}
