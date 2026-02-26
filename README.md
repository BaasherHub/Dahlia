# Dahlia Baasher — Art Shop

Full-stack painting e-commerce site with Stripe payments, automated order emails, and shipping.

## Stack
- **Frontend**: React + Vite (Railway static deploy)
- **Backend**: Node.js + Express (Railway service)
- **Database**: PostgreSQL (Railway addon)
- **Payments**: Stripe
- **Emails**: Resend
- **Shipping**: EasyPost

## Project Structure
```
dahlia-baasher/
├── frontend/        # React app
├── backend/         # Express API
└── README.md
```

## Quick Start

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/dahlia-baasher
cd dahlia-baasher/frontend && npm install
cd ../backend && npm install
```

### 2. Environment variables
Copy `.env.example` to `.env` in both `frontend/` and `backend/` and fill in your keys.

### 3. Run locally
```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

## Deploy to Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a **PostgreSQL** plugin to your project
4. Create two services: `backend` (root: `/backend`) and `frontend` (root: `/frontend`)
5. Add environment variables (see `.env.example` files)
6. Railway auto-deploys on every `git push` ✅

## Changing the Style
All colors, fonts, and spacing live in:
```
frontend/src/index.css   ← CSS variables at the top (:root block)
```
Change `--color-primary`, `--color-bg`, `--font-display` etc. and the whole site updates instantly.
