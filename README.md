# BrewHub

A coffee shop web app. Customers browse the menu and order from their table. Staff manage orders, branches, and the menu from a dashboard.

## What's included

**Customer side**
- Home page
- Menu + cart
- Checkout (table number)
- Branches (addresses and hours)

**Staff side** (after login)
- Overview
- Orders
- Menu (add / edit / delete)
- Branches
- Staff
- Equipment
- Analytics with charts

## Tech

- React 19
- Vite
- React Router
- Tailwind CSS
- Recharts

Data is mock/local for now — no real backend.

## Run it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

Or:

```bash
npm start
```

## Build

```bash
npm run build
npm run preview
```

## Login

Go to `/login` — any email and password works (demo only).

## Project layout

```
src/
  components/   shared UI
  pages/        routes
  context/      cart & orders
  data/         seed data
  utils/        auth helpers
  assets/       images
```

## Note

Lab / learning project. Orders and menu items are not saved to a real server.
