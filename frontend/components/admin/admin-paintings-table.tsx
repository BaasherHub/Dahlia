"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Copy, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  adminPatchPaintingStatus,
  adminDuplicatePainting,
} from "@/lib/api";
import toast from "react-hot-toast";

export interface AdminPaintingRow {
  id: string;
  title: string;
  images: string[];
  medium: string;
  originalPrice?: number;
  originalAvailable: boolean;
  featured: boolean;
  heroImage: boolean;
  sold: boolean;
  collection?: { name: string } | null;
}

export type PaintingSelectionProps = {
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  pageIds: string[];
};

export function buildPaintingColumns(
  onUpdated: (p: AdminPaintingRow) => void,
  onDuplicated: (p: AdminPaintingRow) => void,
  selection?: PaintingSelectionProps
): ColumnDef<AdminPaintingRow>[] {
  const cols: ColumnDef<AdminPaintingRow>[] = [];

  if (selection) {
    const allSelected =
      selection.pageIds.length > 0 &&
      selection.pageIds.every((id) => selection.selectedIds.has(id));
    cols.push({
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) =>
            selection.onToggleAll(selection.pageIds, e.target.checked)
          }
          aria-label="Select all on page"
          className="rounded border-charcoal/30"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selection.selectedIds.has(row.original.id)}
          onChange={() => selection.onToggle(row.original.id)}
          aria-label={`Select ${row.original.title}`}
          className="rounded border-charcoal/30"
        />
      ),
    });
  }

  cols.push(
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
        <Link
          href={`/admin/paintings/${row.original.id}`}
          className="font-medium text-charcoal hover:text-gold-dark"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: "medium",
      header: "Medium",
      cell: ({ row }) => (
        <span className="text-sm text-graphite max-w-[8rem] truncate block">
          {row.original.medium}
        </span>
      ),
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
      accessorKey: "sold",
      header: "Status",
      cell: ({ row }) => {
        const { sold, originalAvailable } = row.original;
        if (sold) {
          return <span className="text-red-600 font-medium text-sm">Sold</span>;
        }
        if (!originalAvailable) {
          return <span className="text-amber-700 font-medium text-sm">Draft</span>;
        }
        return <span className="text-green-700 font-medium text-sm">Live</span>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <PaintingRowActions
          painting={row.original}
          onUpdated={onUpdated}
          onDuplicated={onDuplicated}
        />
      ),
    }
  );

  return cols;
}

function PaintingRowActions({
  painting,
  onUpdated,
  onDuplicated,
}: {
  painting: AdminPaintingRow;
  onUpdated: (p: AdminPaintingRow) => void;
  onDuplicated: (p: AdminPaintingRow) => void;
}) {
  const [busy, setBusy] = useState(false);

  const toggleSold = async () => {
    setBusy(true);
    try {
      const nextSold = !painting.sold;
      const updated = await adminPatchPaintingStatus(painting.id, {
        sold: nextSold,
        ...(nextSold ? {} : { originalAvailable: true }),
      });
      onUpdated(updated as AdminPaintingRow);
      toast.success(nextSold ? "Marked as sold." : "Marked as available.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  };

  const duplicate = async () => {
    setBusy(true);
    try {
      const copy = await adminDuplicatePainting(painting.id);
      onDuplicated(copy as AdminPaintingRow);
      toast.success("Duplicate created — set price and mark live when ready.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Duplicate failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-1 justify-end">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={busy}
        onClick={toggleSold}
        className="text-xs h-8 px-2"
        title={painting.sold ? "Mark available" : "Mark sold"}
      >
        <Tag className="h-3.5 w-3.5 mr-1" />
        {painting.sold ? "Unsell" : "Sold"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={busy}
        onClick={duplicate}
        title="Duplicate"
        aria-label="Duplicate painting"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Link href={`/admin/paintings/${painting.id}`}>
        <Button variant="ghost" size="icon" aria-label="Edit">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}