const $ = (id) => document.getElementById(id);

const timezoneSelect = $("timezoneSelect");
const userValueEl = $("userValue");
const logoutBtn = $("logoutBtn");
const statusEl = $("status");
const resultEl = $("result");
const tzValueEl = $("tzValue");
const timeValueEl = $("timeValue");
const errorEl = $("error");
const refreshBtn = $("refreshBtn");

let refreshTimer = null;
const Auth = window.Auth;

function setError(message) {
  errorEl.textContent = message;
  errorEl.style.display = message ? "block" : "none";
}

function setStatus(message) {
  statusEl.textContent = message;
}

async function loadTimezones() {
  setError("");
  setStatus("Loading timezones...");
  timezoneSelect.disabled = true;

  const zones = await Auth.apiFetchJson("/api/timezones/all");

  timezoneSelect.innerHTML = "";
  for (const z of zones) {
    const opt = document.createElement("option");
    opt.value = z;
    opt.textContent = z;
    timezoneSelect.appendChild(opt);
  }

  timezoneSelect.disabled = false;
  setStatus("Select a timezone to view the current time.");
}

async function updateCurrentTime() {
  const zone = timezoneSelect.value;
  if (!zone) return;

  setError("");

  const data = await Auth.apiFetchJson(`/api/timezones/time/${encodeURIComponent(zone)}`);
  tzValueEl.textContent = data.timezone;
  timeValueEl.textContent = data.currentTime;
  resultEl.style.display = "block";
  setStatus("");
}

function startAutoRefresh() {
  stopAutoRefresh();
  refreshTimer = setInterval(updateCurrentTime, 1000);
}

function stopAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = null;
}

timezoneSelect.addEventListener("change", async () => {
  stopAutoRefresh();
  setStatus("Fetching current time...");
  try {
    await updateCurrentTime();
    startAutoRefresh();
  } catch (err) {
    stopAutoRefresh();
    setError(err?.message || "Failed to load current time.");
    setStatus("");
  }
});

refreshBtn.addEventListener("click", async () => {
  try {
    setStatus("Refreshing...");
    await updateCurrentTime();
    startAutoRefresh();
  } catch (err) {
    setError(err?.message || "Failed to refresh time.");
    setStatus("");
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    if (!Auth || !Auth.getToken()) {
      window.location.href = "/login.html";
      return;
    }

    try {
      const me = await Auth.apiFetchJson("/api/auth/me");
      if (me && me.user && me.user.username) userValueEl.textContent = me.user.username;
    } catch (err) {
      Auth.handleAuthError(err);
      return;
    }

    await loadTimezones();
    if (timezoneSelect.options.length > 0) {
      timezoneSelect.value = timezoneSelect.options[0].value;
      await updateCurrentTime();
      startAutoRefresh();
    } else {
      setStatus("No timezones returned from the backend.");
    }
  } catch (err) {
    Auth?.handleAuthError?.(err);
    setError(err?.message || "Failed to load timezones.");
    setStatus("");
    timezoneSelect.disabled = true;
  }
});

logoutBtn.addEventListener("click", () => {
  Auth.clearToken();
  window.location.href = "/login.html";
});
