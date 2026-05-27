# Vivelle Ice Cream Platform

Full-stack React/Vite and Express/MongoDB ordering application with OTP authentication, JWT sessions, persistent carts, live order tracking, customer profiles, favorites, and an admin operations dashboard.

## Structure

```text
src/
  components/       navigation and route guards
  context/          auth, cart and toast providers
  pages/            login, order, profile, tracking and admin screens
  services/api.js   authenticated frontend API client
server/
  config/           MongoDB connection
  controllers/      API business logic
  middleware/       JWT role guards and API error handling
  models/           User (customer/admin roles), Product, Cart, Order, OTP Verification
  routes/           REST endpoint definitions
  utils/            OTP delivery, JWT/security and startup seeding
```

## Setup

1. Copy `.env.example` to `.env` and configure `MONGODB_URI`, `JWT_SECRET`, and `OTP_SECRET`.
2. For local UI development, leave `OTP_DEV_MODE=true`. The verification code is returned to the authentication screen and logged by the API.
3. For production, set `OTP_DEV_MODE=false`, configure SMTP for Nodemailer email OTP and Twilio credentials for mobile OTP.
4. Set `ADMIN_EMAIL` and optionally `ADMIN_PHONE`. The API provisions a `User` record with `role: 'admin'` at startup; public admin signup is intentionally disabled.
5. Install and run:

```bash
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:3001`. Phone OTP identifiers must use E.164 format such as `+919876543210`.

## Workflows

- Selecting `Order` while signed out redirects to `/login?redirect=/order`.
- Users sign up or log in using email or SMS OTP. Successful verification saves a seven-day JWT, the public user record, and the `user` or `admin` role in browser local storage.
- This is an OTP-only authentication system; `Recover access with OTP` re-verifies an existing account rather than resetting a password.
- Customer carts, favorites, delivery profiles and placed orders persist in MongoDB.
- Placed orders show an order ID and tracking link. The tracking page refreshes status every ten seconds.
- Customer login redirects to `/order`; customer navigation provides profile, order history, saved addresses, logout, and cart access.
- Admin OTP login redirects to `/dashboard`, with reporting, recent orders, order search/filter, status updates and deletion controls.

## REST API

```text
POST   /api/auth/otp/request
POST   /api/auth/otp/verify
GET    /api/auth/me
PUT    /api/auth/profile
PUT    /api/auth/wishlist/:productId
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

- The API calculates subtotal, GST, delivery charge and grand total from database product prices.
- OTPs are HMAC-hashed, expire after ten minutes, rate limited to one request per minute, and stop after five failed attempts.
- JWT middleware separates user routes from admin routes.
- `User.role` is constrained to `user` or `admin`; new accounts default to `user`, while admin access is provisioned from server configuration.
- Profile images are stored as small data URLs for this implementation; production deployments should replace this with object storage and malware/type validation.
