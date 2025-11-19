import axios from "axios";

const {
  SKYDROPX_API_KEY,
  SKYDROPX_BASE_URL = "https://api.skydropx.com/v1",
} = process.env;

if (!SKYDROPX_API_KEY) {
  console.error("❌ No se encontró SKYDROPX_API_KEY en process.env");
}

export async function skydropxRequest(method, path, body = null) {
  try {
    const { data } = await axios({
      method,
      url: `${SKYDROPX_BASE_URL}${path}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token token=${SKYDROPX_API_KEY}`,
      },
      data: body ?? undefined,
    });

    return data;
  } catch (error) {
    console.error("❌ Error Skydropx:", error.response?.status, error.response?.data);
    throw error;
  }
}
