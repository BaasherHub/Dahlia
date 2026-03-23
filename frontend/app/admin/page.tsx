"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, ShoppingBag, Settings, Plus, TrendingUp, Mail } from "lucide-react";
import { format } from "date-fns";

interface Stats {
  totalPaintings: number;
  totalOrders: number;
  totalRevenue: number;
  pendingInquiries: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
    items: Array<{ painting: { title: string } }>;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Paintings", value: loading ? "…" : stats?.totalPaintings ?? 0, icon: ImageIcon, href: "/admin/paintings" },
    { label: "Total Orders", value: loading ? "…" : stats?.totalOrders ?? 0, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Revenue", value: loading ? "…" : `$${(stats?.totalRevenue ?? 0).toFixed(2)}`, icon: TrendingUp, href: "/admin/orders" },
    { label: "Commission Inquiries", value: loading ? "…" : stats?.pendingInquiries ?? 0, icon: Mail, href: "/admin/orders" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="label-sm mb-2">Welcome back</p>
        <h1 className="font-display text-4xl font-semibold text-charcoal">Dashboard</h1>
      </div>

      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="block p-6 bg-cream rounded-sm border border-gold/20 hover:border-gold transition-colors duration-400">
            <div className="flex items-center justify-between mb-4">
              <card.icon className="h-5 w-5 text-gold" />
            </div>
            <p className="font-display text-3xl font-semibold text-charcoal">{card.value}</p>
            <p className="text-sm text-graphite mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <Separator />

      <div>
        <h2 className="font-display text-xl font-semibold text-charcoal mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/paintings/new"><Button variant="outline" className="gap-2"><Plus className="h-4 w-4" />New Painting</Button></Link>
          <Link href="/admin/collections/new"><Button variant="outline" className="gap-2"><Plus className="h-4 w-4" />New Collection</Button></Link>
          <Link href="/admin/orders"><Button variant="outline" className="gap-2"><ShoppingBag className="h-4 w-4" />View Orders</Button></Link>
          <Link href="/admin/settings"><Button variant="outline" className="gap-2"><Settings className="h-4 w-4" />Settings</Button></Link>
        </div>
      </div>

      {stats?.recentOrders && stats.recentOrders.length > 0 && (
        <>
          <Separator />
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold text-charcoal">Recent Orders</h2>
              <Link href="/admin/orders"><Button variant="ghost" size="sm">View All</Button></Link>
            </div>
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-cream rounded-sm border border-gold/10">
                  <div>
                    <p className="font-medium text-charcoal text-sm">{order.customerName}</p>
                    <p className="text-xs text-graphite mt-0.5">
                      {order.items?.[0]?.painting?.title || "—"}
                      {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-charcoal text-sm">${order.total.toFixed(2)}</p>
                    <p className="text-xs text-graphite mt-0.5">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
