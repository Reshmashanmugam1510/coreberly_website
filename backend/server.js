const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("DB Error:", err);
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://coreberly-website.vercel.app"  // ✅ YOUR VERCEL LINK
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

function run(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function onRun(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function seedData() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('shop_owner', 'manufacturer')),
      manufacturer_name TEXT
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      manufacturer_name TEXT NOT NULL,
      price REAL NOT NULL,
      moq INTEGER NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_owner_id INTEGER NOT NULL,
      shop_name TEXT NOT NULL,
      address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      FOREIGN KEY(shop_owner_id) REFERENCES users(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      manufacturer_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      password_hash TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data_json TEXT NOT NULL
    )
  `);

  const usersCount = await get("SELECT COUNT(*) AS count FROM users");
  if (usersCount.count === 0) {
    const manufacturerPassword = await bcrypt.hash("pass1234", 10);
    const shopPassword = await bcrypt.hash("pass1234", 10);
    await run(
      "INSERT INTO users (name, email, password_hash, role, manufacturer_name) VALUES (?, ?, ?, 'manufacturer', ?)",
      ["Agro Mills Manager", "agro@factory.com", manufacturerPassword, "Agro Mills Ltd"]
    );
    await run(
      "INSERT INTO users (name, email, password_hash, role, manufacturer_name) VALUES (?, ?, ?, 'manufacturer', ?)",
      ["CleanChem Manager", "clean@factory.com", manufacturerPassword, "CleanChem Industries"]
    );
    await run(
      "INSERT INTO users (name, email, password_hash, role, manufacturer_name) VALUES (?, ?, ?, 'shop_owner', NULL)",
      ["Demo Shop Owner", "owner@shop.com", shopPassword]
    );
  }

  const productsCount = await get("SELECT COUNT(*) AS count FROM products");
  if (productsCount.count === 0) {
    const products = [
      ["Premium Basmati Rice 25kg", "Groceries", "Agro Mills Ltd", 1450, 2],
      ["Refined Sunflower Oil 5L", "Groceries", "Agro Mills Ltd", 610, 4],
      ["Laundry Detergent 2kg", "Home Care", "CleanChem Industries", 220, 10],
      ["Floor Cleaner 5L", "Home Care", "CleanChem Industries", 390, 6]
    ];
    for (const product of products) {
      await run(
        "INSERT INTO products (name, category, manufacturer_name, price, moq) VALUES (?, ?, ?, ?, ?)",
        product
      );
    }
  }

  const adminCount = await get("SELECT COUNT(*) AS count FROM admin_settings");
  if (adminCount.count === 0) {
    const hash = await bcrypt.hash("coreberly2025", 10);
    await run("INSERT INTO admin_settings (id, password_hash) VALUES (1, ?)", [hash]);
  }

  const siteCount = await get("SELECT COUNT(*) AS count FROM site_content");
  if (siteCount.count === 0) {
    const defaults = {
      team: [
        {
          name: "CHARANN .K.S",
          badge: "FOUNDER & CEO",
          title: "CEO",
          bio: "",
          photo: "",
          linkedin: ""
        },
        {
          name: "KANI. G.S",
          badge: "CO-FOUNDER & CTO",
          title: "CTO",
          bio: "",
          photo: "",
          linkedin: ""
        },
        {
          name: "ANISH VISWANATHAN.V.R",
          badge: "COO",
          title: "COO",
          bio: "",
          photo: "",
          linkedin: ""
        },
        {
          name: "KISHORE.V",
          badge: "LEAD DEVELOPER",
          title: "DEVELOPER",
          bio: "",
          photo: "",
          linkedin: ""
        }
      ],
      partners: [
        { name: "Amazon Web Services", type: "Cloud Partner", icon: "☁️", badge: "CERTIFIED" },
        { name: "Microsoft Azure", type: "Cloud & AI Partner", icon: "🔵", badge: "PARTNER" },
        { name: "Google Cloud", type: "Cloud Solutions", icon: "🌐", badge: "CERTIFIED" }
      ],
      gallery: [
        { url: "", caption: "Team Collaboration Session" },
        { url: "", caption: "Product Sprint Planning" },
        { url: "", caption: "Design Workshop" },
        { url: "", caption: "Client Demo Day" },
        { url: "", caption: "Tech Hackathon 2024" },
        { url: "", caption: "Office Culture" }
      ],
      hero: {
        tagline:
          "Coreberly partners with startups and enterprises to design, develop, and deploy intelligent digital solutions - from custom software to cloud-native platforms.",
        projects: "150+",
        satisfaction: "98%",
        engineers: "40+",
        countries: "12+",
        tquote:
          "\"Coreberly transformed our legacy platform into a modern SaaS product in just 4 months. The team's technical depth and communication made us feel we had a true in-house engineering team.\"",
        tname: "Rajesh Kumar",
        trole: "CTO, FinTech Startup - Bangalore"
      },
      contact: { email: "hello@coreberly.in", linkedin: "#", twitter: "#" }
    };
    await run("INSERT INTO site_content (id, data_json) VALUES (1, ?)", [JSON.stringify(defaults)]);
  }
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
      manufacturerName: user.manufacturer_name || null
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  return next();
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, manufacturerName } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!["shop_owner", "manufacturer"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    if (role === "manufacturer" && !manufacturerName) {
      return res.status(400).json({ error: "Manufacturer name is required" });
    }
    const exists = await get("SELECT id FROM users WHERE email = ?", [email]);
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await run(
      "INSERT INTO users (name, email, password_hash, role, manufacturer_name) VALUES (?, ?, ?, ?, ?)",
      [name, email, passwordHash, role, role === "manufacturer" ? manufacturerName : null]
    );
    const user = await get(
      "SELECT id, name, role, manufacturer_name FROM users WHERE id = ?",
      [result.lastID]
    );
    return res.json({ token: createToken(user), user });
  } catch (error) {
    return res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    return res.json({
      token: createToken(user),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        manufacturer_name: user.manufacturer_name || null
      }
    });
  } catch {
    return res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/site-data", async (req, res) => {
  try {
    const row = await get("SELECT data_json FROM site_content WHERE id = 1");
    if (!row) return res.status(404).json({ error: "Site data missing" });
    return res.json(JSON.parse(row.data_json));
  } catch {
    return res.status(500).json({ error: "Failed to load site data" });
  }
});

app.post("/api/admin/unlock", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: "Password is required" });
    const row = await get("SELECT password_hash FROM admin_settings WHERE id = 1");
    if (!row) return res.status(500).json({ error: "Admin not configured" });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid password" });
    const token = jwt.sign({ id: 1, role: "admin", name: "Coreberly Admin" }, JWT_SECRET, {
      expiresIn: "1d"
    });
    return res.json({ token });
  } catch {
    return res.status(500).json({ error: "Unlock failed" });
  }
});

app.put("/api/admin/site-data", auth, adminOnly, async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ error: "Invalid payload" });
    }
    await run("UPDATE site_content SET data_json = ? WHERE id = 1", [JSON.stringify(payload)]);
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Save failed" });
  }
});

app.put("/api/admin/password", auth, adminOnly, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await run("UPDATE admin_settings SET password_hash = ? WHERE id = 1", [hash]);
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Password update failed" });
  }
});

app.get("/api/products", auth, async (req, res) => {
  const products = await all("SELECT * FROM products ORDER BY id DESC");
  res.json(products);
});

app.post("/api/orders", auth, async (req, res) => {
  try {
    if (req.user.role !== "shop_owner") return res.status(403).json({ error: "Forbidden" });
    const { shopName, address, paymentMethod, items } = req.body;
    if (!shopName || !address || !paymentMethod || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order payload" });
    }

    const createdAt = new Date().toISOString();
    const orderResult = await run(
      "INSERT INTO orders (shop_owner_id, shop_name, address, payment_method, status, created_at) VALUES (?, ?, ?, ?, 'pending', ?)",
      [req.user.id, shopName, address, paymentMethod, createdAt]
    );

    for (const item of items) {
      const product = await get("SELECT * FROM products WHERE id = ?", [item.productId]);
      if (!product) continue;
      if (Number(item.quantity) < product.moq) {
        return res.status(400).json({ error: `MOQ not met for ${product.name}` });
      }
      await run(
        "INSERT INTO order_items (order_id, product_id, manufacturer_name, quantity, unit_price) VALUES (?, ?, ?, ?, ?)",
        [orderResult.lastID, product.id, product.manufacturer_name, Number(item.quantity), product.price]
      );
    }

    return res.json({ success: true, orderId: orderResult.lastID });
  } catch {
    return res.status(500).json({ error: "Order creation failed" });
  }
});

app.get("/api/orders/shop", auth, async (req, res) => {
  if (req.user.role !== "shop_owner") return res.status(403).json({ error: "Forbidden" });
  const rows = await all(
    `
      SELECT o.id AS order_id, o.shop_name, o.address, o.payment_method, o.status, o.created_at,
             oi.product_id, oi.quantity, oi.unit_price, oi.manufacturer_name, p.name AS product_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE o.shop_owner_id = ?
      ORDER BY o.id DESC
    `,
    [req.user.id]
  );
  return res.json(groupOrders(rows));
});

app.get("/api/orders/manufacturer", auth, async (req, res) => {
  if (req.user.role !== "manufacturer") return res.status(403).json({ error: "Forbidden" });
  const rows = await all(
    `
      SELECT o.id AS order_id, o.shop_name, o.address, o.payment_method, o.status, o.created_at,
             oi.product_id, oi.quantity, oi.unit_price, oi.manufacturer_name, p.name AS product_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
      WHERE oi.manufacturer_name = ?
      ORDER BY o.id DESC
    `,
    [req.user.manufacturerName]
  );
  return res.json(groupOrders(rows));
});

app.patch("/api/orders/:orderId/status", auth, async (req, res) => {
  if (req.user.role !== "manufacturer") return res.status(403).json({ error: "Forbidden" });
  const { orderId } = req.params;
  const { status } = req.body;
  if (!["processing", "shipped", "delivered"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const ownsItem = await get(
    "SELECT id FROM order_items WHERE order_id = ? AND manufacturer_name = ?",
    [orderId, req.user.manufacturerName]
  );
  if (!ownsItem) return res.status(403).json({ error: "Not your order" });

  await run("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);
  return res.json({ success: true });
});

function groupOrders(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.order_id)) {
      map.set(row.order_id, {
        id: row.order_id,
        shopName: row.shop_name,
        address: row.address,
        paymentMethod: row.payment_method,
        status: row.status,
        createdAt: row.created_at,
        items: []
      });
    }
    map.get(row.order_id).items.push({
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      unitPrice: row.unit_price,
      manufacturerName: row.manufacturer_name
    });
  }
  return [...map.values()];
}

seedData().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
});
