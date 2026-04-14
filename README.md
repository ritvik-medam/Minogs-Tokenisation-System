# 🍽️ Mingos Canteen Tokenisation System

A full-stack web application for RV University's Mingos Canteen — order food, skip the queue, get your token!

---

## 🚀 Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Frontend  | React 18 + Vite        |
| Backend   | Node.js + Express      |
| Database  | MongoDB + Mongoose     |
| Auth      | JWT (JSON Web Tokens)  |
| Styling   | Custom CSS (dark theme)|

---

## ✨ Features

- 🔐 **Auth** — Signup / Login with JWT sessions
- 🍛 **Menu** — 10 categories, 45+ food items with emojis
- 🔍 **Smart Search** — Real-time suggestions while typing
- 🛒 **Cart** — Add/remove items, quantity control
- 🎫 **Token System** — Unique daily token on order placement
- ⏳ **Queue Prediction** — Estimated wait time calculation
- 🔄 **Real-Time Status** — Pending → Preparing → Ready (polls every 5s)
- 🔥 **Trending Items** — Most ordered today
- 📊 **Peak Detection** — High Rush / Low Traffic indicator
- 📦 **Order History** — All past orders with reorder button
- ⚙️ **Admin Panel** — Full menu & order management + analytics

---

## 📁 Project Structure

```
mingos/
├── backend/
│   ├── models/          # Mongoose schemas (User, MenuItem, Order)
│   ├── routes/          # Express routes (auth, menu, orders, admin)
│   ├── middleware/       # JWT auth middleware
│   ├── config/          # DB seed data (45 menu items + admin user)
│   ├── .env             # Environment variables
│   └── server.js        # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Navbar, FoodCard, OrderStatus
    │   ├── context/     # AuthContext, CartContext
    │   ├── pages/       # Home, Auth, Cart, Orders, Profile, Admin
    │   ├── utils/       # Axios API instance
    │   └── styles/      # Global CSS
    ├── .env             # VITE_API_URL
    └── vite.config.js
```

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mingos
JWT_SECRET=your_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
# or: npm start
```

The server starts at **http://localhost:5000**
Menu items and admin user are auto-seeded on first run.

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

App opens at **http://localhost:5173**

---

## 🔑 Default Accounts

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@mingos.com    | admin123  |

Register any new account for student/user role.

---

## 🌐 API Endpoints

| Method | Endpoint                       | Description              | Auth     |
|--------|--------------------------------|--------------------------|----------|
| POST   | /api/auth/signup               | Register new user        | —        |
| POST   | /api/auth/login                | Login & get token        | —        |
| GET    | /api/auth/me                   | Get current user         | 🔒 User  |
| GET    | /api/menu                      | All menu items grouped   | —        |
| GET    | /api/menu/search?q=dosa        | Search menu items        | —        |
| GET    | /api/menu/popular              | Trending items today     | —        |
| GET    | /api/menu/peak-status          | High Rush / Low Traffic  | —        |
| POST   | /api/orders                    | Place order              | 🔒 User  |
| GET    | /api/orders                    | User order history       | 🔒 User  |
| GET    | /api/orders/:id                | Get order status         | 🔒 User  |
| POST   | /api/orders/:id/reorder        | Reorder from history     | 🔒 User  |
| GET    | /api/admin/stats               | Dashboard analytics      | 🔒 Admin |
| GET    | /api/admin/orders              | All orders               | 🔒 Admin |
| PUT    | /api/admin/orders/:id/status   | Update order status      | 🔒 Admin |
| GET    | /api/admin/menu                | All menu items           | 🔒 Admin |
| POST   | /api/admin/menu                | Add menu item            | 🔒 Admin |
| PUT    | /api/admin/menu/:id            | Edit menu item           | 🔒 Admin |
| DELETE | /api/admin/menu/:id            | Delete menu item         | 🔒 Admin |

---

## 🚀 Deployment

### Frontend → Vercel
1. Push `frontend/` folder to GitHub
2. Import into [vercel.com](https://vercel.com)
3. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy!

### Backend → Render
1. Push `backend/` folder to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Build command: `npm install`
4. Start command: `node server.js`
5. Set environment variables (MONGODB_URI, JWT_SECRET, CLIENT_URL)
6. Deploy!

---

## 👥 Team — Tokenisation of Mingos
- Medam Ritvik (1RUA24CSE0249)
- Pranav R (1RUA24CSE0315)
- Lochan Mohan (1RUA24CSE0225)

Course: Agile Software Engineering & DevOps | RV University
