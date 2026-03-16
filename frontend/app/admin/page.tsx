"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetchAllPaintings, adminFetchCollections } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImageIcon, Library, ShoppingBag, Settings, Plus } from "lucide-react";

interface Stats {
  paintings: number;
  collections: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ paintings: 0, collections: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([adminFetchAllPaintings(), adminFetchCollections()]).then(
      ([paintings, collections]) => {
        const p =
          paintings.status === "fulfilled"
            ? Array.isArray(paintings.value)
              ? paintings.value.length
              : paintings.value?.paintings?.length || 0
            : 0;
        const c =
          collections.status === "fulfilled"
            ? Array.isArray(collections.value)
              ? collections.value.length
              : collections.value?.collections?.length || 0
            : 0;
        setStats({ paintings: p, collections: c });
        setLoading(false);
      }
    );
  }, []);

  const cards = [
    {
      label: "Total Paintings",
      value: loading ? "…" : stats.paintings,
      icon: ImageIcon,
      href: "/admin/paintings",
    },
    {
      label: "Collections",
      value: loading ? "…" : stats.collections,
      icon: Library,
      href: "/admin/collections",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="label-sm mb-2">Welcome back</p>
        <h1 className="font-display text-4xl font-semibold text-charcoal">
          Dashboard
        </h1>
      </div>

      <Separator />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="block p-6 bg-cream rounded-sm border border-gold/20 hover:border-gold transition-colors duration-400 group"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon className="h-5 w-5 text-gold" />
            </div>
            <p className="font-display text-3xl font-semibold text-charcoal">
              {card.value}
            </p>
            <p className="text-sm text-graphite mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <Separator />

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-xl font-semibold text-charcoal mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/paintings/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              New Painting
            </Button>
          </Link>
          <Link href="/admin/collections/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              New Collection
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              View Orders
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
