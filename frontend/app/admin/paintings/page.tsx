"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil } from "lucide-react";
import { adminFetchAllPaintings } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

interface Painting {
  id: string;
  title: string;
  images: string[];
  medium: string;
  originalPrice?: number;
  featured: boolean;
  sold: boolean;
  createdAt: string;
}

const columns: ColumnDef<Painting>[] = [
  {
    accessorKey: "images",
    header: "",
    cell: ({ row }) => {
      const img = row.original.images?.[0];
      return img ? (
        <div className="relative w-10 h-10 rounded-sm overflow-hidden bg-cream">
          <Image src={img} alt="" fill className="object-cover" sizes="40px" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-sm bg-cream" />
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium text-charcoal">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "medium",
    header: "Medium",
  },
  {
    accessorKey: "originalPrice",
    header: "Price",
    cell: ({ row }) =>
      row.original.originalPrice
        ? formatPrice(row.original.originalPrice)
        : "—",
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (row.original.featured ? "Yes" : "No"),
  },
  {
    accessorKey: "sold",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={
          row.original.sold ? "text-red-500" : "text-green-600"
        }
      >
        {row.original.sold ? "Sold" : "Available"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/admin/paintings/${row.original.id}`}>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

export default function AdminPaintingsPage() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const result = await adminFetchAllPaintings();
      setPaintings(Array.isArray(result) ? result : result?.data ?? []);
    } catch {
      setPaintings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-sm mb-1">Manage</p>
          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Paintings
          </h1>
          <p className="text-sm text-graphite mt-1">
            {paintings.length} total
          </p>
        </div>
        <Link href="/admin/paintings/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Painting
          </Button>
        </Link>
      </div>

      <Separator />

      {loading ? (
        <p className="text-graphite py-8">Loading paintings…</p>
      ) : (
        <DataTable columns={columns} data={paintings} searchKey="title" />
      )}
    </div>
  );
}
