const API_BASE =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_URL ||
  "https://cwm-backend.onrender.com/api";


console.log("API BASE:", API_BASE);

export async function api(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let errorMessage = "API Error";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Fallback
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses (like 204 No Content or successful DELETE with empty body)
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }

  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}


