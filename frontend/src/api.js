const BASE = import.meta.env.VITE_API_URL || '';

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

export async function createCheckout({ paintingIds, customerEmail, shipping, version }) {
  const res = await fetch(`${BASE}/api/orders/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paintingIds, customerEmail, shipping, version }),
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
