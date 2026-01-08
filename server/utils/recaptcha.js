import axios from "axios";

/**
 * Verifies a Google reCAPTCHA v3 token.
 * @param {string} token - The token received from the frontend.
 * @returns {Promise<boolean>} - True if valid and score is sufficient, false otherwise.
 */
export async function verifyRecaptcha(token) {
  if (!token) return false;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn("RECAPTCHA_SECRET_KEY not set in environment variables. Skipping verification (unsafe).");
    return true; 
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );
    
    const data = response.data;
    
    if (!data.success) {
        console.warn("reCAPTCHA API error:", data["error-codes"]);
        return false;
    }

    // v3 check: Verify score
    // 1.0 is very likely a good user, 0.0 is very likely a bot
    const threshold = 0.5;
    if (data.score < threshold) {
        console.warn(`reCAPTCHA score too low: ${data.score} (Threshold: ${threshold})`);
        return false;
    }

    return true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}
