const API_BASE = "http://localhost:4000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export const api = {
  getSiteData() {
    return request("/site-data");
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
