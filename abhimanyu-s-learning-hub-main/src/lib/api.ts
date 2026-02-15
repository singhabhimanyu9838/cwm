const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://cwm-backend.onrender.com/api";

console.log("API BASE:", API_BASE);

export async function api(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
}
