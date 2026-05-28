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
import toast from "react-hot-toast";

interface Painting {
  id: string;
  title: string;
  images: string[];
  medium: string;
  originalPrice?: number;
  originalAvailable: boolean;
  featured: boolean;
  heroImage: boolean;
  sold: boolean;
  createdAt: string;
  collection?: { name: string } | null;
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
    id: "collection",
    header: "Collection",
    cell: ({ row }) => (
      <span className="text-graphite text-sm">
        {row.original.collection?.name || "—"}
      </span>
    ),
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (row.original.featured ? "Yes" : "—"),
  },
  {
    accessorKey: "heroImage",
    header: "Hero",
    cell: ({ row }) => (row.original.heroImage ? "Yes" : "—"),
  },
  {
    accessorKey: "sold",
    header: "Status",
    cell: ({ row }) => {
      const { sold, originalAvailable } = row.original;
      if (sold) {
        return <span className="text-red-500 font-medium">Sold</span>;
      }
      if (!originalAvailable) {
        return <span className="text-amber-700 font-medium">Unavailable</span>;
      }
      return <span className="text-green-600 font-medium">Available</span>;
    },
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const result = await adminFetchAllPaintings(p);
      if (Array.isArray(result)) {
        setPaintings(result);
      } else {
        setPaintings(result?.data ?? []);
        setTotalPages(result?.pagination?.pages ?? 1);
        setTotal(result?.pagination?.total ?? result?.data?.length ?? 0);
      }
    } catch {
      setPaintings([]);
      toast.error("Failed to load paintings. Check your admin key and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [load, page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-sm mb-1">Manage</p>
          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Paintings
          </h1>
          <p className="text-sm text-graphite mt-1">
            {total > 0 ? `${total} total` : `${paintings.length} total`}
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
        <>
          <DataTable
            columns={columns}
            data={paintings}
            searchKey="title"
            clientPagination={false}
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-graphite">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
