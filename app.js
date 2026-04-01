const STORAGE_KEYS = {
  products: "mm_products",
  cart: "mm_cart",
  orders: "mm_orders"
};

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.products)) {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(seedProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.cart)) {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.orders)) {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify([]));
  }
}

function getProducts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.products) || "[]");
}

function getCart() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || "[]");
}

function setCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

function getOrders() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || "[]");
}

function setOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

function formatCurrency(value) {
  return "Rs " + value.toLocaleString();
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.id === tabId);
  });
}

function renderCategoryFilter() {
  const products = getProducts();
  const categories = [...new Set(products.map((p) => p.category))];
  const filter = document.getElementById("categoryFilter");
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filter.appendChild(option);
  });
}

function renderProducts() {
  const products = getProducts();
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const selectedCategory = document.getElementById("categoryFilter").value;
  const grid = document.getElementById("productGrid");
  const template = document.getElementById("productCardTemplate");
  grid.innerHTML = "";

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.manufacturer.toLowerCase().includes(search);
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty">No products match your search.</p>';
    return;
  }

  filtered.forEach((product) => {
    const card = template.content.cloneNode(true);
    card.querySelector(".product-name").textContent = product.name;
    card.querySelector(".manufacturer-name").textContent = "By " + product.manufacturer;
    card.querySelector(".category-tag").textContent = product.category;
    card.querySelector(".price").textContent = formatCurrency(product.price) + " / unit";
    card.querySelector(".moq").textContent = "MOQ: " + product.moq + " units";

    const qtyInput = card.querySelector(".qty-input");
    qtyInput.min = product.moq;
    qtyInput.value = product.moq;

    const addBtn = card.querySelector(".add-cart-btn");
    addBtn.addEventListener("click", () => {
      const qty = Number(qtyInput.value);
      if (qty < product.moq || Number.isNaN(qty)) {
        alert("Quantity must be at least MOQ (" + product.moq + ").");
        return;
      }
      addToCart(product.id, qty);
    });

    grid.appendChild(card);
  });
}

function addToCart(productId, quantity) {
  const products = getProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity
    });
  }

  setCart(cart);
  renderCart();
  alert("Added to cart.");
}

function removeCartItem(productId) {
  const cart = getCart().filter((item) => item.productId !== productId);
  setCart(cart);
  renderCart();
}

function renderCart() {
  const cartItemsDiv = document.getElementById("cartItems");
  const totalDiv = document.getElementById("cartTotal");
  const cart = getCart();
  const products = getProducts();

  cartItemsDiv.innerHTML = "";

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="empty">Your cart is empty.</p>';
    totalDiv.textContent = "";
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return;
    const lineTotal = item.quantity * product.price;
    total += lineTotal;

    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML =
      "<div>" +
      "<strong>" + product.name + "</strong><br/>" +
      "<span class='muted'>" + product.manufacturer + "</span><br/>" +
      "Qty: " + item.quantity + " x " + formatCurrency(product.price) +
      "</div>" +
      "<div>" +
      "<strong>" + formatCurrency(lineTotal) + "</strong><br/>" +
      "<button data-remove='" + product.id + "'>Remove</button>" +
      "</div>";
    cartItemsDiv.appendChild(row);
  });

  cartItemsDiv.querySelectorAll("button[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeCartItem(btn.dataset.remove);
    });
  });

  totalDiv.textContent = "Cart Total: " + formatCurrency(total);
}

function placeOrder() {
  const shopName = document.getElementById("shopName").value.trim();
  const address = document.getElementById("deliveryAddress").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;
  const cart = getCart();
  const products = getProducts();

  if (!shopName || !address) {
    alert("Please enter shop name and delivery address.");
    return;
  }
  if (cart.length === 0) {
    alert("Cart is empty.");
    return;
  }

  const orderItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      productName: product ? product.name : "Unknown",
      manufacturer: product ? product.manufacturer : "Unknown",
      unitPrice: product ? product.price : 0,
      quantity: item.quantity,
      amount: (product ? product.price : 0) * item.quantity
    };
  });

  const order = {
    id: "ORD-" + Date.now(),
    shopName,
    address,
    paymentMethod,
    createdAt: new Date().toISOString(),
    status: "pending",
    items: orderItems,
    total: orderItems.reduce((sum, item) => sum + item.amount, 0)
  };

  const orders = getOrders();
  orders.unshift(order);
  setOrders(orders);
  setCart([]);

  renderCart();
  renderShopOrders();
  renderManufacturerOrders();
  alert("Order placed successfully.");
}

function statusPill(status) {
  return "<span class='status " + status + "'>" + status.toUpperCase() + "</span>";
}

function renderShopOrders() {
  const list = document.getElementById("shopOrdersList");
  const orders = getOrders();
  list.innerHTML = "";

  if (orders.length === 0) {
    list.innerHTML = '<p class="empty">No orders yet.</p>';
    return;
  }

  orders.forEach((order) => {
    const card = document.createElement("div");
    card.className = "order-card";
    const itemLines = order.items
      .map((it) => it.productName + " (" + it.quantity + ") - " + formatCurrency(it.amount))
      .join("<br/>");

    card.innerHTML =
      "<strong>" + order.id + "</strong> " + statusPill(order.status) + "<br/>" +
      "<span class='muted'>" + new Date(order.createdAt).toLocaleString() + "</span><br/>" +
      "Shop: " + order.shopName + "<br/>" +
      "Address: " + order.address + "<br/>" +
      "Payment: " + order.paymentMethod + "<br/>" +
      "<div class='actions'>" + itemLines + "</div>" +
      "<div class='actions'><strong>Total: " + formatCurrency(order.total) + "</strong></div>";
    list.appendChild(card);
  });
}

function renderManufacturerOptions() {
  const select = document.getElementById("manufacturerSelect");
  seedManufacturers.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return;
  order.status = newStatus;
  setOrders(orders);
  renderShopOrders();
  renderManufacturerOrders();
}

function renderManufacturerOrders() {
  const selectedManufacturer = document.getElementById("manufacturerSelect").value;
  const wrap = document.getElementById("manufacturerOrders");
  const orders = getOrders().filter((order) =>
    order.items.some((item) => item.manufacturer === selectedManufacturer)
  );

  wrap.innerHTML = "";
  if (orders.length === 0) {
    wrap.innerHTML = '<p class="empty">No orders for this manufacturer.</p>';
    return;
  }

  orders.forEach((order) => {
    const relevantItems = order.items.filter((item) => item.manufacturer === selectedManufacturer);
    const subtotal = relevantItems.reduce((sum, item) => sum + item.amount, 0);
    const lines = relevantItems
      .map((item) => item.productName + " - Qty " + item.quantity + " (" + formatCurrency(item.amount) + ")")
      .join("<br/>");

    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML =
      "<strong>" + order.id + "</strong> " + statusPill(order.status) + "<br/>" +
      "Shop: " + order.shopName + "<br/>" +
      "Delivery: " + order.address + "<br/>" +
      "<div class='actions'>" + lines + "</div>" +
      "<div class='actions'><strong>Manufacturer subtotal: " + formatCurrency(subtotal) + "</strong></div>" +
      "<div class='actions'>" +
      "<button data-status='processing'>Mark Processing</button> " +
      "<button data-status='shipped'>Mark Shipped</button> " +
      "<button data-status='delivered'>Mark Delivered</button>" +
      "</div>";

    card.querySelectorAll("button[data-status]").forEach((btn) => {
      btn.addEventListener("click", () => {
        updateOrderStatus(order.id, btn.dataset.status);
      });
    });
    wrap.appendChild(card);
  });
}

function attachEvents() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  document.getElementById("searchInput").addEventListener("input", renderProducts);
  document.getElementById("categoryFilter").addEventListener("change", renderProducts);
  document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
  document.getElementById("manufacturerSelect").addEventListener("change", renderManufacturerOrders);
}

function bootstrap() {
  initStorage();
  renderCategoryFilter();
  renderManufacturerOptions();
  attachEvents();
  renderProducts();
  renderCart();
  renderShopOrders();
  renderManufacturerOrders();
}

bootstrap();
