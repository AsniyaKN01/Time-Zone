const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");
const usernameOrEmailEl = document.getElementById("usernameOrEmail");
const passwordEl = document.getElementById("password");

function setError(message) {
  errorEl.textContent = message;
  errorEl.style.display = message ? "block" : "none";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError("");

  const payload = {
    usernameOrEmail: usernameOrEmailEl.value,
    password: passwordEl.value,
  };

  try {
    const res = await fetch(apiUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    localStorage.setItem("auth_token", data.token);
    window.location.href = "/";
  } catch (err) {
    setError(err?.message || "Login failed");
  }
});
