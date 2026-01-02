// server/utils/zoomClient.js
import axios from "axios";
import { getZoomAccessToken } from "./zoomAuth.js";

export async function zoomRequest({ method, url, data, params }) {
  const token = await getZoomAccessToken();

  return axios({
    method,
    baseURL: "https://api.zoom.us/v2",
    url,
    headers: { Authorization: `Bearer ${token}` },
    data,
    params,
  });
}
