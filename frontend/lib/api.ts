import { parseApiErrorResponse } from "@/lib/admin-errors";
import { getApiBaseUrl } from "@/lib/api-base";

function apiUrl(path: string): string {
  const base = getApiBaseUrl();
  return `${base}${path}`;
}

export async function fetchPaintings(params?: Record<string, string>) {
  const qs = params ? new URLSearchParams(params).toString() : "";
  const res = await fetch(apiUrl(`/api/paintings${qs ? "?" + qs : ""}`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch paintings");
  return res.json();
}

export async function fetchHeroPainting() {
  const res = await fetch(apiUrl("/api/paintings/hero"), { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchPainting(id: string) {
  const res = await fetch(apiUrl(`/api/paintings/${id}`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch painting");
  return res.json();
}

export async function fetchCollections() {
  const res = await fetch(apiUrl("/api/collections"), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function fetchCollection(id: string) {
  const res = await fetch(apiUrl(`/api/collections/${id}`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch collection");
  return res.json();
}

export async function fetchSiteSettings() {
  const res = await fetch(apiUrl("/api/site-settings"), { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function submitCommission(data: {
  name: string;
  email: string;
  vision: string;
  size: string;
  budget: string;
}) {
  const res = await fetch(apiUrl("/api/commissions"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseApiErrorResponse(res));
  }
  return res.json();
}

export async function submitContact(data: { name: string; email: string; subject: string; message: string }) {
  const res = await fetch(apiUrl("/api/contact"), {
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
  const res = await fetch(apiUrl("/api/newsletter"), {
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
  const res = await fetch(apiUrl("/api/orders/checkout"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to create checkout session");
  }
  return res.json() as Promise<{ url: string; sessionId?: string }>;
}

export async function fetchOrderBySession(sessionId: string) {
  const res = await fetch(apiUrl(`/api/orders/session/${sessionId}`), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

export async function adminFetch(path: string, options: RequestInit = {}) {
  return fetch(apiUrl(path), {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
  });
}

export async function adminLogin(key: string): Promise<boolean> {
  const res = await fetch(apiUrl("/api/admin/login"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });
  return res.ok;
}

export async function adminLogout(): Promise<void> {
  await fetch(apiUrl("/api/admin/logout"), {
    method: "POST",
    credentials: "include",
  });
}

export async function verifyAdminSession(): Promise<boolean> {
  const res = await fetch(apiUrl("/api/admin/verify"), {
    credentials: "include",
  });
  return res.ok;
}

export async function releaseCheckoutHold(sessionId: string): Promise<void> {
  await fetch(apiUrl("/api/orders/release-hold"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
}

export async function adminFetchAllPaintings(page = 1, limit = 50) {
  const res = await adminFetch(`/api/paintings/all?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch paintings");
  return res.json();
}

export async function adminCreatePainting(data: Record<string, unknown>) {
  const res = await adminFetch("/api/paintings", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseApiErrorResponse(res));
  }
  return res.json();
}

export async function adminUpdatePainting(id: string, data: Record<string, unknown>) {
  const res = await adminFetch(`/api/paintings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseApiErrorResponse(res));
  }
  return res.json();
}

export async function adminDeletePainting(id: string) {
  const res = await adminFetch(`/api/paintings/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || err?.message || `Failed to delete painting (${res.status})`);
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

export async function adminFetchCommissions() {
  const res = await adminFetch("/api/admin/commissions");
  if (!res.ok) throw new Error("Failed to fetch commissions");
  return res.json();
}

export async function adminUpdateCommissionStatus(id: string, status: string) {
  const res = await adminFetch(`/api/admin/commissions/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to update inquiry");
  }
  return res.json();
}

export async function adminPatchPaintingStatus(
  id: string,
  data: { sold?: boolean; originalAvailable?: boolean }
) {
  const res = await adminFetch(`/api/paintings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseApiErrorResponse(res));
  }
  return res.json();
}

export async function adminDuplicatePainting(id: string) {
  const res = await adminFetch(`/api/paintings/${id}/duplicate`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(await parseApiErrorResponse(res));
  }
  return res.json();
}

export async function adminFetchNewsletterSubscribers() {
  const res = await adminFetch("/api/newsletter");
  if (!res.ok) throw new Error("Failed to fetch subscribers");
  return res.json();
}

export async function adminDeleteNewsletterSubscriber(id: string) {
  const res = await adminFetch(`/api/newsletter/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove subscriber");
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
