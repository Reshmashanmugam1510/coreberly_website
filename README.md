# Manufacturer Marketplace (Full Stack)

Full-stack e-shopping website where a **shop owner** buys products from **manufacturers**.

## Stack

- Backend: Node.js, Express, SQLite, JWT auth
- Frontend: React (Vite)

## Run backend

```bash
cd backend
npm install
npm start
```

Backend runs at `http://localhost:4000`.

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Demo accounts

- Shop owner: `owner@shop.com` / `pass1234`
- Manufacturer: `agro@factory.com` / `pass1234`

## Features

- Register/login with role (`shop_owner` or `manufacturer`)
- Product marketplace with MOQ rules
- Cart and checkout for shop owners
- Shop owner order history
- Manufacturer-specific incoming orders
- Manufacturer can update order status (`processing`, `shipped`, `delivered`)
