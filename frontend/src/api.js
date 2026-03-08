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

const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-key': sessionStorage.getItem('adminKey') || '',
});

export async function adminVerify() {
  // Try new endpoint first, fall back to old endpoint for backwards compatibility
  try {
    const res = await fetch(`${BASE}/api/admin/verify`, { headers: adminHeaders() });
    if (res.status !== 404) return res.ok;
  } catch {}
  // Fallback: old backend used /api/paintings/all for auth check
  try {
    const res = await fetch(`${BASE}/api/paintings/all`, { headers: adminHeaders() });
    if (res.status !== 404) return res.ok;
  } catch {}
  // Fallback 2: try fetching paintings with admin header (works on new backend too)
  try {
    const res = await fetch(`${BASE}/api/admin/paintings`, { headers: adminHeaders() });
    return res.ok;
  } catch {}
  return false;
}

export async function adminGetPaintings() {
  // Try new endpoint, fall back to old for backwards compatibility
  let res = await fetch(`${BASE}/api/admin/paintings`, { headers: adminHeaders() });
  if (res.status === 404) {
    res = await fetch(`${BASE}/api/paintings/all`, { headers: adminHeaders() });
  }
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function adminCreatePainting(data) {
  const res = await fetch(`${BASE}/api/paintings`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function adminUpdatePainting(id, data) {
  const res = await fetch(`${BASE}/api/paintings/${id}`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function adminDeletePainting(id) {
  const res = await fetch(`${BASE}/api/paintings/${id}`, {
    method: 'DELETE', headers: adminHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}

export async function adminGetCollections() {
  const res = await fetch(`${BASE}/api/collections`, { headers: adminHeaders() });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function adminCreateCollection(data) {
  const res = await fetch(`${BASE}/api/collections`, {
    method: 'POST', headers: adminHeaders(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function adminUpdateCollection(id, data) {
  const res = await fetch(`${BASE}/api/collections/${id}`, {
    method: 'PUT', headers: adminHeaders(), body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function adminDeleteCollection(id) {
  const res = await fetch(`${BASE}/api/collections/${id}`, {
    method: 'DELETE', headers: adminHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}

export async function adminGetOrders() {
  let res = await fetch(`${BASE}/api/admin/orders`, { headers: adminHeaders() });
  if (res.status === 404) {
    res = await fetch(`${BASE}/api/orders/all`, { headers: adminHeaders() });
  }
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}
