# Dahlia — What Was Fixed (v2.1.0)

## Summary of All Changes

### 🔴 Critical Bug Fixes

#### 1. Admin Settings Page — Complete Rewrite
**File:** `frontend/app/admin/settings/page.tsx`

**Problem:** The settings form used completely wrong field names (`siteName`, `tagline`, `artistBio`, `contactEmail`, `instagramUrl`) that don't exist in your database schema. Saving settings did nothing — it sent fields your backend doesn't know about.

**Fix:** Rewrote the page to map to every actual field in your `SiteSettings` Prisma model. Organised into sections: Homepage, About Page, Gallery Page, Commissions Page, Navigation & Footer. Your sister can now edit all website text from one clean page.

---

#### 2. Image Upload — Complete Rewrite
**File:** `frontend/components/admin/image-upload.tsx`

**Problem:** Used `next-cloudinary`'s `CldUploadWidget` which requires:
- The `next-cloudinary` npm package (adds complexity)
- A Cloudinary widget configuration that wasn't set up
- Additional environment variables

**Fix:** Replaced with a direct browser → Cloudinary upload using a standard HTML `<input type="file">`. Uses your `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and an **unsigned upload preset** named `dahlia`.

**Action required:** In Cloudinary dashboard → Settings → Upload → Upload Presets → Add Preset → set Mode to **Unsigned** → name it `dahlia` → Save.

---

#### 3. Orders Page — Wrong API Endpoint
**File:** `frontend/app/admin/orders/page.tsx`

**Problem:** Was fetching from `/api/orders` (public, unauthenticated endpoint that doesn't return orders). Should be `/api/admin/orders` (authenticated, returns full order data).

**Fix:** Changed to use `adminFetch("/api/admin/orders")` which sends the admin key header and hits the correct route. Also fixed field names: `orderItems` → `items`, and added `total` display without the /100 division (your backend stores dollars not cents).

---

#### 4. Dashboard — Not Using Stats Endpoint
**File:** `frontend/app/admin/page.tsx`

**Problem:** Dashboard called `adminFetchAllPaintings()` and `adminFetchCollections()` separately just to count items, and showed no revenue or order data.

**Fix:** Now uses `/api/admin/stats` which your backend already provides — returns `totalPaintings`, `totalOrders`, `totalRevenue`, `pendingInquiries`, and `recentOrders` in one call. Dashboard now shows all 4 stats cards and a recent orders list.

---

#### 5. lib/api.ts — Added Missing Functions + Fixed Endpoints
**File:** `frontend/lib/api.ts`

**Changes:**
- Added `adminFetchOrders()` — uses correct `/api/admin/orders` endpoint
- Added `adminFetchStats()` — uses `/api/admin/stats`
- Added `adminUpdateOrder()` — for updating order status/tracking
- Improved error handling on create/update painting to surface backend error messages
- Removed dependency on `next-cloudinary`

---

#### 6. package.json — Removed Unused Dependency
**File:** `frontend/package.json`

**Change:** Removed `next-cloudinary` since image upload no longer uses it. Run `npm install` after replacing this file.

---

#### 7. Painting Form — UX Improvements
**File:** `frontend/components/admin/painting-form.tsx`

**Changes:**
- Added validation: blocks form submission if no images uploaded
- Improved layout with clear sections (Basic Info, Pricing & Availability, Visibility)
- Better descriptions on each toggle so your sister knows what each one does
- Cancel button added
- Clearer required field indicators

---

#### 8. Backend Upload Route — Cleaned Up
**File:** `backend/src/routes/upload.js`

**Problem:** The original multipart parser had edge cases that could fail silently.

**Fix:** Cleaner implementation with better error messages. Note: this route is now a fallback only — uploads go directly from the browser to Cloudinary in normal use.

---

## Environment Variables Checklist

### Frontend (`.env.local` or Railway env vars)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dahlia
```

### Backend (Railway env vars — already set, just verify)
```
DATABASE_URL=postgresql://...
ADMIN_KEY=your-secret-key
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://dahliabaasher.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RESEND_API_KEY=re_...
```

## Steps After Replacing Files

1. `cd frontend && npm install` (picks up removed next-cloudinary)
2. In Cloudinary: create unsigned upload preset named `dahlia`
3. Add `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dahlia` to frontend env vars
4. Deploy — both Railway services rebuild automatically via GitHub
