"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil } from "lucide-react";
import { adminFetchCollections } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Collection {
  id: string;
  name: string;
  coverImage?: string;
  description?: string;
  order: number;
  paintings?: Array<{ id: string }>;
}

const columns: ColumnDef<Collection>[] = [
  {
    accessorKey: "coverImage",
    header: "",
    cell: ({ row }) => {
      const img = row.original.coverImage;
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-charcoal">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "paintings",
    header: "Works",
    cell: ({ row }) => row.original.paintings?.length || 0,
  },
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/admin/collections/${row.original.id}`}>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const result = await adminFetchCollections();
      setCollections(
        Array.isArray(result) ? result : result?.collections || []
      );
    } catch {
      setCollections([]);
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
            Collections
          </h1>
          <p className="text-sm text-graphite mt-1">
            {collections.length} total
          </p>
        </div>
        <Link href="/admin/collections/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Collection
          </Button>
        </Link>
      </div>

      <Separator />

      {loading ? (
        <p className="text-graphite py-8">Loading collections…</p>
      ) : (
        <DataTable columns={columns} data={collections} searchKey="name" />
      )}
    </div>
  );
}
