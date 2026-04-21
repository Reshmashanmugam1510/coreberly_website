const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const isLocalhost = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_BASE = `${(configuredApiBase || (isLocalhost ? "http://localhost:4000" : "")).replace(/\/$/, "")}/api`;

async function requestWithBase(base, path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const normalizedBase = String(base || "").replace(/\/$/, "");
  const url = `${normalizedBase}${path}`;

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers
    });
  } catch {
    throw new Error("Unable to reach the backend. Check the API base URL and CORS settings.");
  }

  const contentType = response.headers.get("content-type") || "";
  let data = {};

  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => ({}));
  } else {
    const text = await response.text().catch(() => "");
    data = text ? { error: text } : {};
  }

  if (!response.ok) {
    const serverError =
      data.error ||
      data.message ||
      response.statusText ||
      `HTTP ${response.status}`;
    throw new Error(serverError);
  }
  return data;
}

async function request(path, options = {}) {
  return requestWithBase(API_BASE, path, options);
}

export const api = {
  getSiteData() {
    return request("/site-data");
  },
  async sendContactMessage(payload) {
    const bases = isLocalhost
      ? [configuredApiBase ? API_BASE : "http://localhost:4000/api"]
      : [API_BASE, "/api", configuredApiBase ? `${configuredApiBase}/api` : ""];

    let lastError = null;
    const tried = new Set();

    for (const base of bases) {
      const normalizedBase = String(base || "").replace(/\/$/, "");
      if (tried.has(normalizedBase)) continue;
      tried.add(normalizedBase);

      try {
        return await requestWithBase(normalizedBase, "/contact", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      } catch (error) {
        if (String(error?.message || "").toLowerCase().includes("not found")) {
          lastError = new Error("Contact endpoint not found. Redeploy frontend and confirm /api/contact route.");
          continue;
        }
        lastError = error;
      }
    }

    if (lastError) throw lastError;
    throw new Error("Unable to send message. Contact API is unreachable.");
  },
  adminUnlock(password) {
    return request("/admin/unlock", { method: "POST", body: JSON.stringify({ password }) });
  },
  saveSiteData(payload) {
    return request("/admin/site-data", { method: "PUT", body: JSON.stringify(payload) });
  },
  changeAdminPassword(newPassword) {
    return request("/admin/password", { method: "PUT", body: JSON.stringify({ newPassword }) });
  },
  login(payload) {
    return request("/auth/login", { method: "POST", body: JSON.stringify(payload) });
  },
  register(payload) {
    return request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
  },
  getProducts() {
    return request("/products");
  },
  createOrder(payload) {
    return request("/orders", { method: "POST", body: JSON.stringify(payload) });
  },
  getShopOrders() {
    return request("/orders/shop");
  },
  getManufacturerOrders() {
    return request("/orders/manufacturer");
  },
  updateOrderStatus(orderId, status) {
    return request(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
  }
};
