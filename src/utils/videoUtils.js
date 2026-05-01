/**
 * Convierte una URL de video (YouTube, Instagram, Facebook, TikTok) 
 * a su formato correspondiente para ser usada en un iframe (embed).
 * 
 * @param {string} url - La URL original del video.
 * @returns {string} - La URL transformada para embed.
 */
export const getEmbedUrl = (url) => {
  if (!url) return "";

  // 1. YouTube (Soporta links normales, cortos y shorts)
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
  }

  // 2. Instagram (Soporta posts y reels)
  if (url.includes("instagram.com")) {
    let cleanUrl = url.split("?")[0]; // Quitamos parámetros de rastreo
    if (cleanUrl.endsWith("/")) cleanUrl = cleanUrl.slice(0, -1);
    return `${cleanUrl}/embed`;
  }

  // 3. Facebook
  if (url.includes("facebook.com")) {
    // Si ya es un embed de FB, lo dejamos como está
    if (url.includes("plugins/video.php")) return url;
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
  }

  // 4. TikTok
  if (url.includes("tiktok.com")) {
    const match = url.match(/\/video\/(\d+)/);
    if (match && match[1]) {
      return `https://www.tiktok.com/embed/v2/${match[1]}`;
    }
  }

  // Si no coincide con ninguno, devolvemos el original
  return url;
};
