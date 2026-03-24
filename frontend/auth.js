const TOKEN_KEY = "auth_token";

/** Empty in dev (Vite proxies /api). Set VITE_API_BASE for production if UI is on another host. */
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

function joinApi(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function apiFetchJson(path, options = {}) {
  const url = joinApi(path);
  const token = getToken();
  const headers = Object.assign({}, options.headers || {});

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, Object.assign({}, options, { headers }));
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`Request failed (${res.status})${text ? `: ${text}` : ""}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function handleAuthError(err) {
  const status = err && err.status;
  if (status === 401 || status === 403) {
    clearToken();
    window.location.href = "/login.html";
    return true;
  }
  return false;
}

window.Auth = {
  getToken,
  setToken,
  clearToken,
  apiFetchJson,
  handleAuthError,
};
