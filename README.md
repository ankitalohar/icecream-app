# Vivelle Ice Cream Platform

Full-stack React/Vite and Express/MongoDB ordering application with password login/signup, JWT sessions, Firestore synchronization, persistent carts, live order tracking, customer profiles, favorites, and an admin operations dashboard.

## Structure

```text
src/
  components/       navigation and route guards
  context/          auth, cart and toast providers
  pages/            login/signup, ordering, cart, profile, tracking and admin screens
  services/         authenticated API client and Firebase Auth session bridge
server/
  config/           MongoDB connection
  controllers/      API business logic
  middleware/       JWT role guards and API error handling
  models/           User (customer/admin roles), Product, Cart, Order
  routes/           REST endpoint definitions
  services/         trusted Firebase Admin / Firestore synchronization
  utils/            JWT/security helpers and startup seeding
```

## Setup

1. Copy `.env.example` to `.env` and configure `MONGODB_URI` and `JWT_SECRET`.
2. Set `ADMIN_EMAIL`, `ADMIN_PHONE`, and `ADMIN_PASSWORD` if you want the API to provision an admin at startup.
3. To synchronize data to Firestore and mint Firebase Auth custom tokens, set `FIREBASE_PROJECT_ID` and provide either `GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_SERVICE_ACCOUNT_JSON`. On Firebase/Google Cloud runtimes, use `FIREBASE_USE_APPLICATION_DEFAULT=true`.
4. Set the `VITE_FIREBASE_*` web-app values to let the browser establish its optional Firebase Auth session after API login/signup.
5. Install and run:

```bash
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:3001`. Indian mobile numbers like `9876543210` are stored as `+919876543210`.

## Workflows

- Signup collects full name, email, phone, address, password, confirm password, and role.
- Login accepts email or phone plus password.
- Successful login/signup saves a seven-day API JWT in `localStorage`, mirrors account/session data to Firestore when configured, and redirects users to `/order` or admins to `/dashboard`.
- Duplicate email or phone signup attempts return `Account already exists. Please login.` without crashing the API.
- Customer carts, favorites, delivery profiles and placed orders persist in MongoDB and configured Firestore collections.
- Admin dashboard shows total users, active users, total orders, revenue, recent customer orders, order IDs, and cart totals.

## REST API

```text
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
PUT    /api/auth/wishlist/:productId
POST   /api/auth/logout
GET    /api/products
GET    /api/cart
PUT    /api/cart
POST   /api/orders
GET    /api/orders
GET    /api/orders/track/:orderId
GET    /api/admin/dashboard
GET    /api/admin/orders
PATCH  /api/admin/orders/:id/status
DELETE /api/admin/orders/:id
```

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWT middleware separates user routes from admin routes.
- The API calculates subtotal, GST, delivery charge and grand total from database product prices.
- Firestore writes are restricted to the role-protected server using trusted Admin SDK credentials.
- `User.role` is constrained to `user` or `admin`.
