const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

const form = document.getElementById("registerForm");
const errorEl = document.getElementById("error");
const successEl = document.getElementById("success");
const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");

function setError(message) {
  errorEl.textContent = message;
  errorEl.style.display = message ? "block" : "none";
}

function setSuccess(message) {
  successEl.textContent = message;
  successEl.style.display = message ? "block" : "none";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const payload = {
    username: usernameEl.value,
    email: emailEl.value,
    password: passwordEl.value,
  };

  try {
    const res = await fetch(apiUrl("/api/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    setSuccess("Account created. Redirecting to login...");
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 900);
  } catch (err) {
    setError(err?.message || "Registration failed");
  }
});
