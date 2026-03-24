const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchPaintings(params?: Record<string, string>) {
  const qs = params ? new URLSearchParams(params).toString() : "";
  const res = await fetch(`${API_URL}/api/paintings${qs ? "?" + qs : ""}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch paintings");
  return res.json();
}

export async function fetchHeroPainting() {
  const res = await fetch(`${API_URL}/api/paintings/hero`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPainting(id: string) {
  const res = await fetch(`${API_URL}/api/paintings/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch painting");
  return res.json();
}

export async function fetchCollections() {
  const res = await fetch(`${API_URL}/api/collections`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function fetchCollection(id: string) {
  const res = await fetch(`${API_URL}/api/collections/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch collection");
  return res.json();
}

export async function fetchSiteSettings() {
  const res = await fetch(`${API_URL}/api/site-settings`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function submitCommission(data: Record<string, string>) {
  const res = await fetch(`${API_URL}/api/commissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit commission");
  return res.json();
}

export async function submitContact(data: { name: string; email: string; subject: string; message: string }) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to send message");
  }
  return res.json();
}

export async function subscribeNewsletter(email: string) {
  const res = await fetch(`${API_URL}/api/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Failed to subscribe");
  return res.json();
}

export interface CheckoutPayload {
  items: Array<{ paintingId: string; type: "original" | "print" }>;
  customerEmail: string;
  customerName: string;
  shipping: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
  };
}

export async function createCheckoutSession(payload: CheckoutPayload) {
  const res = await fetch(`${API_URL}/api/orders/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to create checkout session");
  }
  return res.json();
}

export async function fetchOrderBySession(sessionId: string) {
  const res = await fetch(`${API_URL}/api/orders/session/${sessionId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

function getAdminKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("adminKey") || "";
}

export async function adminFetch(path: string, options: RequestInit = {}) {
  const adminKey = getAdminKey();
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
      ...(options.headers as Record<string, string>),
    },
  });
}

export async function verifyAdminKey(key: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/api/admin/verify`, {
    headers: { "x-admin-key": key },
  });
  return res.ok;
}

export async function adminFetchAllPaintings() {
  const res = await adminFetch("/api/paintings/all");
  if (!res.ok) throw new Error("Failed to fetch paintings");
  return res.json();
}

export async function adminCreatePainting(data: Record<string, unknown>) {
  const res = await adminFetch("/api/paintings", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to create painting");
  }
  return res.json();
}

export async function adminUpdatePainting(id: string, data: Record<string, unknown>) {
  const res = await adminFetch(`/api/paintings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to update painting");
  }
  return res.json();
}

export async function adminDeletePainting(id: string) {
  const res = await adminFetch(`/api/paintings/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to delete painting");
  }
  return res.json();
}

export async function adminFetchCollections() {
  const res = await adminFetch("/api/collections");
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function adminCreateCollection(data: Record<string, unknown>) {
  const res = await adminFetch("/api/collections", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create collection");
  return res.json();
}

export async function adminUpdateCollection(id: string, data: Record<string, unknown>) {
  const res = await adminFetch(`/api/collections/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update collection");
  return res.json();
}

export async function adminDeleteCollection(id: string) {
  const res = await adminFetch(`/api/collections/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete collection");
  return res.json();
}

export async function adminUpdateSiteSettings(data: Record<string, unknown>) {
  const res = await adminFetch("/api/site-settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Failed to update settings (${res.status})`);
  }
  return res.json();
}

export async function adminFetchOrders() {
  const res = await adminFetch("/api/admin/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function adminFetchStats() {
  const res = await adminFetch("/api/admin/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function adminUpdateOrder(
  id: string,
  data: { status?: string; trackingCode?: string; carrier?: string }
) {
  const res = await adminFetch(`/api/admin/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}
