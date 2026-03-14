const BASE = import.meta.env.VITE_API_URL || '';

// ── Public API ──────────────────────────────────────────────

export async function getPaintings(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/api/paintings${qs ? '?' + qs : ''}`);
  if (!res.ok) throw new Error('Failed to fetch paintings');
  return res.json();
}
export const fetchPaintings = getPaintings;

export async function getPainting(id) {
  const res = await fetch(`${BASE}/api/paintings/${id}`);
  if (!res.ok) throw new Error('Painting not found');
  return res.json();
}
export const fetchPainting = getPainting;

export async function getHeroPainting() {
  const res = await fetch(`${BASE}/api/paintings/hero`);
  if (!res.ok) return null;
  return res.json();
}

export async function getCollections() {
  const res = await fetch(`${BASE}/api/collections`);
  if (!res.ok) throw new Error('Failed to fetch collections');
  return res.json();
}

export async function getCollection(id) {
  const res = await fetch(`${BASE}/api/collections/${id}`);
  if (!res.ok) throw new Error('Collection not found');
  return res.json();
}

export async function createCheckout(payload) {
  const res = await fetch(`${BASE}/api/orders/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Checkout failed');
  return data;
}

export async function fetchOrderBySession(sessionId) {
  const res = await fetch(`${BASE}/api/orders/session/${sessionId}`);
  if (!res.ok) throw new Error('Order not found');
  return res.json();
}

// ── Admin API ─────────────────────────────────────────────

const adminGetHeaders = () => ({
  'x-admin-key': sessionStorage.getItem('adminKey') || '',
});

const adminPostHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-key': sessionStorage.getItem('adminKey') || '',
});

export async function adminVerify() {
  try {
    const res = await fetch(`${BASE}/api/admin/verify`, { headers: adminGetHeaders() });
    return res.ok;
  } catch { return false; }
}

export async function adminGetPaintings() {
  const res = await fetch(`${BASE}/api/paintings/all`, { headers: adminGetHeaders() });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function adminCreatePainting(data) {
  const res = await fetch(`${BASE}/api/paintings`, {
    method: 'POST', headers: adminPostHeaders(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function adminUpdatePainting(id, data) {
  const res = await fetch(`${BASE}/api/paintings/${id}`, {
    method: 'PUT', headers: adminPostHeaders(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function adminDeletePainting(id) {
  const res = await fetch(`${BASE}/api/paintings/${id}`, {
    method: 'DELETE', headers: adminPostHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}

export async function adminGetCollections() {
  const res = await fetch(`${BASE}/api/collections`, { headers: adminGetHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function adminCreateCollection(data) {
  const res = await fetch(`${BASE}/api/collections`, {
    method: 'POST', headers: adminPostHeaders(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function adminUpdateCollection(id, data) {
  const res = await fetch(`${BASE}/api/collections/${id}`, {
    method: 'PUT', headers: adminPostHeaders(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function adminDeleteCollection(id) {
  const res = await fetch(`${BASE}/api/collections/${id}`, {
    method: 'DELETE', headers: adminPostHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}

export async function adminGetOrders() {
  const res = await fetch(`${BASE}/api/admin/orders`, { headers: adminGetHeaders() });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function adminUploadImage(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'dahlia-paintings');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Upload failed');
  }
  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  };
}

// ── Site Settings API ─────────────────────────────────────

export async function getSiteSettings() {
  const res = await fetch(`${BASE}/api/site-settings`);
  if (!res.ok) throw new Error('Failed to fetch site settings');
  return res.json();
}

export async function adminUpdateSiteSettings(data) {
  const res = await fetch(`${BASE}/api/site-settings`, {
    method: 'PUT', headers: adminPostHeaders(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update site settings');
  return res.json();
}
