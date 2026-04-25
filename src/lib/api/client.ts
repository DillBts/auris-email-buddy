import { auth } from "../firebase";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function getAuthHeader(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  const token = await user.getIdToken(true);
  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  const gat = localStorage.getItem("google_access_token");
  if (gat) headers["x-google-access-token"] = gat;
  return headers;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const authHeader = await getAuthHeader();

  console.log(`[api] ${method} ${path} headers:`, {
    ...authHeader,
    "x-google-access-token": authHeader["x-google-access-token"] ? authHeader["x-google-access-token"].slice(0, 20) + "…" : "MISSING",
  });
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    if (res.status === 401 && (err.error ?? "").includes("re-authenticate")) {
      const user = auth.currentUser;
      if (user) {
        window.location.href = `${BASE_URL}/auth/gmail?uid=${user.uid}`;
      }
    }
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};