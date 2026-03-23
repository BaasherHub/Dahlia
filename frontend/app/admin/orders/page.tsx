"use client";

import { useEffect, useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { adminFetch } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

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

const STATUS_COLORS: Record<string, string> = {
  PAID: "text-green-600 font-medium",
  SHIPPED: "text-blue-600 font-medium",
  DELIVERED: "text-emerald-700 font-medium",
  PENDING: "text-yellow-600 font-medium",
  CANCELLED: "text-red-500 font-medium",
};

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.slice(0, 8)}…</span>,
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-charcoal">{row.original.customerName}</p>
        <p className="text-xs text-graphite">{row.original.customerEmail}</p>
      </div>
    ),
  },
  {
    accessorKey: "items",
    header: "Paintings",
    cell: ({ row }) => row.original.items?.map((i) => i.painting?.title || "Unknown").join(", ") || "—",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className={STATUS_COLORS[row.original.status] || "text-graphite"}>{row.original.status}</span>
    ),
  },
  {
    accessorKey: "trackingCode",
    header: "Tracking",
    cell: ({ row }) =>
      row.original.trackingCode ? (
        <span className="font-mono text-xs text-graphite">{row.original.carrier} · {row.original.trackingCode}</span>
      ) : (
        <span className="text-graphite text-xs">—</span>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      try { return format(new Date(row.original.createdAt), "MMM d, yyyy"); } catch { return "—"; }
    },
  },
];

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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="label-sm mb-1">Manage</p>
          <h1 className="font-display text-3xl font-semibold text-charcoal">Orders</h1>
          <p className="text-sm text-graphite mt-1">{orders.length} total</p>
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
        <DataTable columns={columns} data={orders} searchKey="customerName" />
      )}
    </div>
  );
}
