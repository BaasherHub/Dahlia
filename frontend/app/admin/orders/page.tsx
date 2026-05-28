"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminFetch, adminUpdateOrder } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Copy, ExternalLink, Mail } from "lucide-react";
import toast from "react-hot-toast";

interface OrderItem {
  id: string;
  price: number;
  version?: string;
  paintingId?: string;
  painting?: { id?: string; title: string; images?: string[] };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  customerEmail: string;
  customerName: string;
  shipName: string;
  shipStreet: string;
  shipCity: string;
  shipState: string;
  shipZip: string;
  shipCountry: string;
  shipPhone?: string;
  trackingCode?: string;
  carrier?: string;
  labelUrl?: string;
  stripePaymentId: string;
  stripeSessionId: string;
  items: OrderItem[];
}

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_COLORS: Record<string, string> = {
  PAID: "text-green-600 font-medium",
  SHIPPED: "text-blue-600 font-medium",
  DELIVERED: "text-emerald-700 font-medium",
  PENDING: "text-yellow-600 font-medium",
  CANCELLED: "text-red-500 font-medium",
};

function copyText(label: string, value: string) {
  navigator.clipboard.writeText(value).then(
    () => toast.success(`${label} copied.`),
    () => toast.error("Could not copy.")
  );
}

function formatAddress(order: Order): string {
  const lines = [
    order.shipName,
    order.shipStreet,
    `${order.shipCity}, ${order.shipState} ${order.shipZip}`,
    order.shipCountry,
  ];
  if (order.shipPhone) lines.push(order.shipPhone);
  return lines.filter(Boolean).join("\n");
}

function stripePaymentUrl(id: string): string {
  if (id.startsWith("pi_")) {
    return `https://dashboard.stripe.com/payments/${id}`;
  }
  return `https://dashboard.stripe.com/search?query=${encodeURIComponent(id)}`;
}

function stripeSessionUrl(id: string): string {
  return `https://dashboard.stripe.com/checkout/sessions/${id}`;
}

function OrderRow({ order, onUpdated }: { order: Order; onUpdated: (o: Order) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.trackingCode || "");
  const [carrier, setCarrier] = useState(order.carrier || "");

  const save = async () => {
    setSaving(true);
    try {
      const updated = await adminUpdateOrder(order.id, { status, trackingCode: tracking, carrier });
      onUpdated(updated);
      toast.success("Order updated.");
      setExpanded(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update order.");
    } finally {
      setSaving(false);
    }
  };

  const shipPreview = [order.shipCity, order.shipState, order.shipCountry]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="border border-gold/10 rounded-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full grid grid-cols-[1fr_1.2fr_1fr_0.8fr_auto_auto] gap-3 items-center px-4 py-3 text-left hover:bg-cream/50 transition-colors"
      >
        <span className="font-mono text-xs text-graphite">{order.id.slice(0, 8)}…</span>
        <div>
          <p className="font-medium text-charcoal text-sm">{order.customerName}</p>
          <p className="text-xs text-graphite">{order.customerEmail}</p>
        </div>
        <span className="text-sm text-graphite truncate">
          {shipPreview || "—"}
        </span>
        <span className="text-sm text-graphite truncate hidden sm:block">
          {order.items?.map((i) => i.painting?.title || "Unknown").join(", ") || "—"}
        </span>
        <span className="text-sm font-medium text-charcoal">${order.total.toFixed(2)}</span>
        <span className={`text-sm ${STATUS_COLORS[order.status] || "text-graphite"}`}>{order.status}</span>
      </button>

      {expanded && (
        <div className="border-t border-gold/10 bg-cream/30 px-4 py-5 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-graphite uppercase tracking-wide">Shipping address</h3>
              <pre className="text-sm text-charcoal whitespace-pre-wrap font-sans bg-ivory border border-gold/10 rounded-sm p-3">
                {formatAddress(order)}
              </pre>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => copyText("Address", formatAddress(order))}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy address
                </Button>
                <a href={`mailto:${order.customerEmail}`}>
                  <Button type="button" size="sm" variant="outline" className="gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    Email customer
                  </Button>
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-medium text-graphite uppercase tracking-wide">Payment & IDs</h3>
              <dl className="text-sm space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="text-graphite w-28 shrink-0">Order ID</dt>
                  <dd className="font-mono text-xs text-charcoal break-all">{order.id}</dd>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => copyText("Order ID", order.id)}
                    aria-label="Copy order ID"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="text-graphite w-28 shrink-0">Stripe payment</dt>
                  <dd className="font-mono text-xs text-charcoal break-all">{order.stripePaymentId}</dd>
                  <a
                    href={stripePaymentUrl(order.stripePaymentId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-dark hover:text-charcoal"
                    aria-label="Open in Stripe"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="text-graphite w-28 shrink-0">Checkout session</dt>
                  <dd className="font-mono text-xs text-charcoal break-all">{order.stripeSessionId}</dd>
                  <a
                    href={stripeSessionUrl(order.stripeSessionId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-dark hover:text-charcoal"
                    aria-label="Open session in Stripe"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div>
                  <dt className="text-graphite">Placed</dt>
                  <dd className="text-charcoal">
                    {(() => {
                      try {
                        return format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a");
                      } catch {
                        return "—";
                      }
                    })()}
                  </dd>
                </div>
              </dl>
              {order.labelUrl && (
                <a
                  href={order.labelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gold-dark hover:underline inline-flex items-center gap-1"
                >
                  Shipping label <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-graphite uppercase tracking-wide mb-2">Line items</h3>
            <ul className="space-y-2">
              {order.items?.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 text-sm border border-gold/10 rounded-sm px-3 py-2 bg-ivory"
                >
                  <span className="text-charcoal font-medium">
                    {item.painting?.title || "Unknown"}
                    {item.version && item.version !== "original" && (
                      <span className="text-graphite font-normal"> ({item.version})</span>
                    )}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-charcoal">${item.price.toFixed(2)}</span>
                    {(item.paintingId || item.painting?.id) && (
                      <Link
                        href={`/admin/paintings/${item.paintingId || item.painting?.id}`}
                        className="text-gold-dark hover:text-charcoal text-xs"
                      >
                        View painting
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-graphite uppercase tracking-wide">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
                className="w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm bg-ivory text-charcoal focus:outline-none focus:ring-1 focus:ring-gold"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-graphite uppercase tracking-wide">Carrier</label>
              <Input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. UPS, FedEx"
                disabled={saving}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-graphite uppercase tracking-wide">Tracking Code</label>
              <Input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="Tracking number"
                disabled={saving}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setExpanded(false)} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        const list: Order[] = Array.isArray(data) ? data : data?.orders || [];
        setOrders(list);
        setRevenue(list.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + o.total, 0));
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpdated = (updated: Order) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === updated.id ? updated : o));
      setRevenue(next.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + o.total, 0));
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="label-sm mb-1">Manage</p>
          <h1 className="font-display text-3xl font-semibold text-charcoal">Orders</h1>
          <p className="text-sm text-graphite mt-1">{orders.length} total · click a row for full details</p>
        </div>
        {!loading && orders.length > 0 && (
          <div className="text-right">
            <p className="label-sm mb-1">Total Revenue</p>
            <p className="font-display text-2xl font-semibold text-charcoal">${revenue.toFixed(2)}</p>
          </div>
        )}
      </div>
      <Separator />
      {loading ? (
        <p className="text-graphite py-8">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-graphite">No orders yet.</p>
          <p className="text-sm text-graphite/60 mt-1">Orders will appear here once customers complete checkout.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="hidden sm:grid grid-cols-[1fr_1.2fr_1fr_0.8fr_auto_auto] gap-3 px-4 py-2 text-xs font-medium text-graphite uppercase tracking-wide">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Ship to</span>
            <span>Paintings</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onUpdated={handleUpdated} />
          ))}
        </div>
      )}
    </div>
  );
}
