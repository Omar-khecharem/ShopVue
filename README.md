# ShopVue — Premium E-Commerce Platform

A full-stack e-commerce application built with **Node.js**, **Express**, **MongoDB** (backend) and **Vue 3**, **Vite**, **TailwindCSS** (frontend). Features a dynamic, admin-configurable homepage, cinematic product pages, instant search, and a complete admin panel.

---

## Features

### Frontend
- **Dynamic Homepage** — Fully configurable from admin: hero banners, product grids, testimonials, FAQ, newsletter, brand logos, promo blocks, banner carousel
- **Cinematic Product Details** — GSAP-powered hero animation with image zoom, scroll-triggered storytelling via `@vueuse/motion`
- **Instant Search** — Overlay modal with debounced API search, keyboard navigation (arrow keys + enter), recent search history (localStorage), trending suggestions
- **Enhanced Product Cards** — 3D tilt on hover, image zoom, quick preview modal, wishlist toggle, star rating, delivery estimate, discount badges, stock scarcity
- **Multi-Step Checkout** — 4-step progress indicator (Cart → Shipping → Payment → Confirmation) with smooth transitions
- **Exit Intent Popup** — Triggers on mouse leave (Y < 15px), offers discount in exchange for email
- **Social Proof Notifications** — Periodic "Someone in X purchased Y" toasts with fade animations
- **Full Admin Panel** — Dashboard, Products CRUD, Orders management, Homepage Builder (add/reorder/enable/disable sections), Banner Manager (with schedule), Categories, Users

### Backend
- **RESTful API** under `/api/v1` — Auth, Users, Products, Orders, Categories, Homepage Sections, Banners
- **JWT Authentication** — Register, login, protected routes, role-based access (`user` / `admin`)
- **MongoDB Models** — User, Product (text-indexed), Order, Category, HomepageSection (Mixed content), Banner (with schedule)
- **Image Upload** — Cloudinary integration via multer memory storage
- **Security** — `helmet`, `cors`, `express-rate-limit`, `mongo-sanitize`, `hpp`, `express-mongo-sanitize`
- **Validation** — Custom middleware with field-type checking (string, number, email, mongoId, enum), request params validation
- **Error Handling** — Centralized error handler for Mongoose errors, JWT errors, Multer errors
- **API Features** — Search (regex), filter, sort, field selection, pagination with metadata

---

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | Vue 3 (Composition API), Vite, TailwindCSS v4, GSAP, @vueuse/motion, Vue Router, Axios |
| Backend  | Node.js, Express, Mongoose, JWT, bcrypt, Cloudinary, multer |
| Database | MongoDB |
| Admin    | Fully integrated Vue SPA with role-based access |

---

## Project Structure

```
ecommerce-project/
├── backend/
│   └── src/
│       ├── app.js                # Express app setup
│       ├── server.js             # Server entry point
│       ├── config/env.js         # Environment configuration
│       ├── models/               # Mongoose schemas
│       ├── controllers/v1/       # Route handlers
│       ├── routes/v1/            # API route definitions
│       ├── services/             # Business logic
│       ├── middlewares/          # Auth, validation, error handling, upload
│       ├── validators/           # Request validation schemas
│       └── utils/                # AppError utility
│
├── frontend/
│   └── src/
│       ├── main.js               # Vue app entry
│       ├── App.vue               # Root component with page transitions
│       ├── style.css             # TailwindCSS v4 + custom utilities
│       ├── router/index.js       # Vue Router with admin guard
│       ├── pages/                # Home, ProductDetails, Cart, Login, Register
│       ├── components/           # Navbar, Footer, ProductCard, SearchModal ...
│       │   └── homepage/         # 11 dynamic section renderers
│       ├── admin/                # Admin panel pages
│       ├── store/                # Reactive stores (auth, cart, wishlist, search, toast)
│       └── services/api.js       # Axios instance with JWT interceptor
│
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone and install dependencies

```bash
git clone https://github.com/Omar-khecharem/ShopVue.git
cd ShopVue

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Environment variables

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### 3. Seed the database (optional)

```bash
cd backend
node src/seed.js
```

### 4. Start development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173`, the backend on `http://localhost:5000`.

### 5. Create an admin user

Register at `/register`, then set `role: "admin"` in MongoDB directly:

```javascript
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

Then visit `/admin/dashboard`.

---

## API Endpoints

| Method | Endpoint                  | Auth   | Description |
|--------|---------------------------|--------|-------------|
| POST   | /api/v1/auth/register     | —      | Register user |
| POST   | /api/v1/auth/login        | —      | Login |
| GET    | /api/v1/auth/me           | user   | Get current user |
| GET    | /api/v1/products          | —      | List products (search, sort, paginate) |
| GET    | /api/v1/products/:id      | —      | Get product |
| POST   | /api/v1/products          | admin  | Create product (multipart) |
| PUT    | /api/v1/products/:id      | admin  | Update product |
| DELETE | /api/v1/products/:id      | admin  | Delete product |
| GET    | /api/v1/orders            | user   | List own orders |
| POST   | /api/v1/orders            | user   | Create order |
| PUT    | /api/v1/orders/:id/status | admin  | Update order status |
| GET    | /api/v1/categories        | —      | List categories |
| POST   | /api/v1/categories        | admin  | Create category |
| PUT    | /api/v1/categories/:id    | admin  | Update category |
| DELETE | /api/v1/categories/:id    | admin  | Delete category |
| GET    | /api/v1/homepage          | —      | Get active homepage sections |
| GET    | /api/v1/homepage/admin    | admin  | Get all sections |
| POST   | /api/v1/homepage          | admin  | Create section |
| PUT    | /api/v1/homepage/:id      | admin  | Update section |
| DELETE | /api/v1/homepage/:id      | admin  | Delete section |
| PUT    | /api/v1/homepage/reorder  | admin  | Batch reorder sections |
| GET    | /api/v1/banners           | —      | Get active banners |
| GET    | /api/v1/banners/admin     | admin  | Get all banners |
| POST   | /api/v1/banners           | admin  | Create banner |
| PUT    | /api/v1/banners/:id       | admin  | Update banner |
| DELETE | /api/v1/banners/:id       | admin  | Delete banner |
| GET    | /api/v1/users             | admin  | List all users |
| GET    | /api/v1/health            | —      | Health check |

---

## Homepage Section Types

| Type              | Description |
|-------------------|-------------|
| `hero`            | Full-screen banner with overlay text and CTA |
| `featured`        | Newest products grid |
| `best_sellers`    | Most popular products (alternate background) |
| `trending`        | Trending products with badge |
| `product_grid`    | Custom product selection |
| `social_proof`    | Statistics counters |
| `testimonials`    | Customer reviews with star ratings |
| `benefits`        | Feature/benefit cards |
| `faq`             | Accordion FAQ |
| `newsletter`      | Email signup form |
| `brands`          | Brand logo strip |
| `banner_carousel` | Auto-rotating banner carousel |
| `promo_block`     | Custom promotional block with background |
| `custom_html`     | Raw HTML injection |

---

## Branch Structure

```
main ── dev ── feature/project-setup
             ├── feature/backend
             ├── feature/frontend-core
             ├── feature/frontend-components
             ├── feature/frontend-pages
             └── feature/frontend-admin
```

Each feature branch represents a cohesive unit of work, merged into `dev` with `--no-ff`, then `dev` into `main` for releases.

---

## License

MIT
