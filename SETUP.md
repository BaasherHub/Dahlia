# 🚀 Setup Guide — Dahlia Baasher Art Shop

Follow these steps in order. Takes about 30–45 minutes total.

---

## Step 1 — Create accounts (free tiers work fine to start)

| Service | Link | What it does |
|---|---|---|
| GitHub | github.com | Hosts your code |
| Railway | railway.app | Runs your site & database |
| Stripe | stripe.com | Takes payments |
| Resend | resend.com | Sends confirmation emails |
| EasyPost | easypost.com | Generates shipping labels |

---

## Step 2 — Push code to GitHub

```bash
cd dahlia-baasher
git init
git add .
git commit -m "Initial commit"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/dahlia-baasher.git
git push -u origin main
```

---

## Step 3 — Set up Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select `dahlia-baasher`
3. Click **Add Plugin** → **PostgreSQL** (Railway gives you a free database)
4. Create **two services**:

### Backend service
- Root directory: `/backend`
- Add these environment variables (Settings → Variables):

```
DATABASE_URL          → Copy from the PostgreSQL plugin (Railway sets this automatically)
STRIPE_SECRET_KEY     → From Stripe dashboard → Developers → API Keys
STRIPE_WEBHOOK_SECRET → See Step 4
RESEND_API_KEY        → From Resend dashboard
EMAIL_FROM            → orders@dahliabaasher.com (must be a verified Resend domain)
EASYPOST_API_KEY      → From EasyPost dashboard
FRONTEND_URL          → Your frontend Railway URL (set after frontend deploys)
ADMIN_KEY             → Make up a strong secret string (to protect adding paintings)
SHIP_FROM_NAME        → Dahlia Baasher
SHIP_FROM_STREET      → Your street address
SHIP_FROM_CITY        → Your city
SHIP_FROM_STATE       → Your state/province code
SHIP_FROM_ZIP         → Your postal code
SHIP_FROM_COUNTRY     → 2-letter country code (e.g. EG, US, GB)
SHIP_FROM_PHONE       → +your phone number
NODE_ENV              → production
```

### Frontend service
- Root directory: `/frontend`
- Add these variables:

```
VITE_API_URL → Your backend Railway URL (e.g. https://dahlia-backend.railway.app)
```

---

## Step 4 — Set up Stripe webhook

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://your-backend.railway.app/api/webhook`
3. Events to listen for: `checkout.session.completed`
4. Copy the **Signing secret** → paste as `STRIPE_WEBHOOK_SECRET` in Railway

---

## Step 5 — Set up Resend email

1. [resend.com](https://resend.com) → Add your domain (or use their sandbox for testing)
2. Follow their DNS verification steps
3. Copy the API key → paste as `RESEND_API_KEY` in Railway

---

## Step 6 — Seed the database with Dahlia's first paintings

After Railway deploys the backend, open the Railway shell for the backend service and run:

```bash
npm run db:seed
```

This adds 5 example paintings. You can edit `src/seed.js` before running to add real ones.

---

## Step 7 — Add real paintings via API

To add a painting, make a POST request with Dahlia's admin key:

```bash
curl -X POST https://your-backend.railway.app/api/paintings \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_KEY" \
  -d '{
    "title": "Morning Garden",
    "description": "A lush...",
    "price": 1400,
    "images": ["https://your-image-hosting.com/painting.jpg"],
    "dimensions": "70 × 90 cm",
    "medium": "Oil on linen",
    "year": 2024,
    "featured": true
  }'
```

**Tip for images:** Upload painting photos to Cloudinary (free) or any image hosting, then paste the URL.

---

## Changing the Style Later

Open `frontend/src/index.css` — the `:root` block at the top controls everything:

```css
:root {
  --color-bg:     #faf7f4;   /* page background */
  --color-accent: #9b6b47;   /* buttons, highlights */
  --font-display: 'Cormorant Garamond', serif;  /* headings */
  --font-body:    'Jost', sans-serif;            /* UI text */
  /* ... */
}
```

Change a color → `git push` → Railway redeploys in ~2 minutes. Done.

---

## How the automation works (after a purchase)

```
Customer clicks Pay
    ↓
Stripe processes card
    ↓
Stripe calls /api/webhook (your server)
    ↓
Server creates Order record in database
    ↓
Server marks paintings as "Sold" (removed from shop)
    ↓
Server calls EasyPost → generates shipping label (PDF)
    ↓
Server sends beautiful confirmation email via Resend
    ↓
Customer sees order + tracking on success page
```

Dahlia just needs to print the label and ship the painting. Everything else is automatic.

---

## Testing payments (before going live)

Use Stripe test mode:
- Test card: `4242 4242 4242 4242` · any future date · any CVC
- Switch to live mode in Stripe dashboard when ready

---

## Questions?

Feel free to ask for help with any step!
