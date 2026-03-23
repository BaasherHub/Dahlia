"use client";

import { useEffect, useState, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { adminFetch } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  type: string;
  price: number;
  painting?: { title: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  stripeSessionId: string;
  orderItems: OrderItem[];
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.id.slice(0, 8)}…</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={
          row.original.status === "PAID"
            ? "text-green-600 font-medium"
            : "text-graphite"
        }
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "orderItems",
    header: "Items",
    cell: ({ row }) =>
      row.original.orderItems
        ?.map((i) => i.painting?.title || "Unknown")
        .join(", ") || "—",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) =>
      `$${(row.original.total / 100).toFixed(2)}`,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.createdAt), "MMM d, yyyy");
      } catch {
        return "—";
      }
    },
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data?.orders || []);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <p className="label-sm mb-1">Manage</p>
        <h1 className="font-display text-3xl font-semibold text-charcoal">
          Orders
        </h1>
        <p className="text-sm text-graphite mt-1">{orders.length} total</p>
      </div>

      <Separator />

      {loading ? (
        <p className="text-graphite py-8">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-graphite py-8">No orders yet.</p>
      ) : (
        <DataTable columns={columns} data={orders} searchKey="status" />
      )}
    </div>
  );
}
