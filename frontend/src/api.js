const BASE_URL = import.meta.env.VITE_API_URL || ''

async function request(url, options = {}) {
  const res = await fetch(url, options)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export function getPaintings() {
  return request(`${BASE_URL}/api/paintings`)
}

export function getHeroPainting() {
  return request(`${BASE_URL}/api/paintings/hero`)
}

export function getPainting(id) {
  return request(`${BASE_URL}/api/paintings/${id}`)
}

export function getCollections() {
  return request(`${BASE_URL}/api/collections`)
}

export function getCollection(id) {
  return request(`${BASE_URL}/api/collections/${id}`)
}

export function createCheckout(data) {
  return request(`${BASE_URL}/api/orders/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function getOrderBySession(sessionId) {
  return request(`${BASE_URL}/api/orders/session/${sessionId}`)
}

export function getSiteSettings() {
  return request(`${BASE_URL}/api/site-settings`)
}

// Admin functions

export function adminVerify(adminKey) {
  return request(`${BASE_URL}/api/admin/verify`, {
    headers: { 'x-admin-key': adminKey },
  })
}

export function adminGetPaintings(adminKey) {
  return request(`${BASE_URL}/api/paintings/all`, {
    headers: { 'x-admin-key': adminKey },
  })
}

export function adminCreatePainting(adminKey, data) {
  return request(`${BASE_URL}/api/paintings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(data),
  })
}

export function adminUpdatePainting(adminKey, id, data) {
  return request(`${BASE_URL}/api/paintings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(data),
  })
}

export function adminDeletePainting(adminKey, id) {
  return request(`${BASE_URL}/api/paintings/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-key': adminKey },
  })
}

export function adminUpdateSiteSettings(adminKey, data) {
  return request(`${BASE_URL}/api/site-settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    },
    body: JSON.stringify(data),
  })
}

export function subscribeNewsletter(email) {
  return request(`${BASE_URL}/api/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}

export function submitCommission(data) {
  return request(`${BASE_URL}/api/commissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

// Alias for backward compatibility
export const fetchOrderBySession = getOrderBySession
