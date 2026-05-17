"use client";

import { useEffect, useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { adminFetch, adminUpdateOrder } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface OrderItem {
  id: string;
  price: number;
  painting?: { title: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  customerEmail: string;
  customerName: string;
  trackingCode?: string;
  carrier?: string;
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

  return (
    <div className="border border-gold/10 rounded-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full grid grid-cols-[1fr_1.5fr_1fr_auto_auto_auto] gap-4 items-center px-4 py-3 text-left hover:bg-cream/50 transition-colors"
      >
        <span className="font-mono text-xs text-graphite">{order.id.slice(0, 8)}…</span>
        <div>
          <p className="font-medium text-charcoal text-sm">{order.customerName}</p>
          <p className="text-xs text-graphite">{order.customerEmail}</p>
        </div>
        <span className="text-sm text-graphite truncate">
          {order.items?.map((i) => i.painting?.title || "Unknown").join(", ") || "—"}
        </span>
        <span className="text-sm font-medium text-charcoal">${order.total.toFixed(2)}</span>
        <span className={`text-sm ${STATUS_COLORS[order.status] || "text-graphite"}`}>{order.status}</span>
        <span className="text-xs text-graphite">
          {(() => { try { return format(new Date(order.createdAt), "MMM d, yyyy"); } catch { return "—"; } })()}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-gold/10 bg-cream/30 px-4 py-4 space-y-4">
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
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setRevenue(
      orders
        .map((o) => (o.id === updated.id ? updated : o))
        .filter((o) => o.status !== "CANCELLED")
        .reduce((sum, o) => sum + o.total, 0)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="label-sm mb-1">Manage</p>
          <h1 className="font-display text-3xl font-semibold text-charcoal">Orders</h1>
          <p className="text-sm text-graphite mt-1">{orders.length} total · click a row to edit</p>
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
          <div className="grid grid-cols-[1fr_1.5fr_1fr_auto_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-graphite uppercase tracking-wide">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Paintings</span>
            <span>Total</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} onUpdated={handleUpdated} />
          ))}
        </div>
      )}
    </div>
  );
}
