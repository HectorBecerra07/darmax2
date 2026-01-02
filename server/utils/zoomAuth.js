// server/utils/zoomAuth.js
import axios from "axios";

let cachedToken = null;
let cachedTokenExp = 0;

async function fetchZoomToken() {
  const {
    ZOOM_ACCOUNT_ID,
    ZOOM_CLIENT_ID,
    ZOOM_CLIENT_SECRET,
    ZOOM_TOKEN_TTL_BUFFER = "60",
  } = process.env;

  const basic = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString("base64");

  const url =
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=` +
    encodeURIComponent(ZOOM_ACCOUNT_ID);

  const r = await axios.post(url, null, {
    headers: { Authorization: `Basic ${basic}` },
  });

  const { access_token, expires_in } = r.data;
  const buffer = Number(ZOOM_TOKEN_TTL_BUFFER);

  cachedToken = access_token;
  cachedTokenExp = Date.now() + (expires_in - buffer) * 1000;

  return access_token;
}

export async function getZoomAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExp) return cachedToken;
  return fetchZoomToken();
}

