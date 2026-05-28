"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { adminFetchAllPaintings } from "@/lib/api";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  buildPaintingColumns,
  type AdminPaintingRow,
} from "@/components/admin/admin-paintings-table";
import toast from "react-hot-toast";

export default function AdminPaintingsPage() {
  const [paintings, setPaintings] = useState<AdminPaintingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "sold" | "draft">("all");

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const result = await adminFetchAllPaintings(p, 50);
      if (Array.isArray(result)) {
        setPaintings(result);
      } else {
        setPaintings(result?.data ?? []);
        setTotalPages(result?.pagination?.pages ?? 1);
        setTotal(result?.pagination?.total ?? result?.data?.length ?? 0);
      }
    } catch {
      setPaintings([]);
      toast.error("Failed to load paintings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [load, page]);

  const handleUpdated = useCallback((updated: AdminPaintingRow) => {
    setPaintings((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
  }, []);

  const handleDuplicated = useCallback((copy: AdminPaintingRow) => {
    setPaintings((prev) => [copy, ...prev]);
    setTotal((t) => t + 1);
  }, []);

  const columns = useMemo(
    () => buildPaintingColumns(handleUpdated, handleDuplicated),
    [handleUpdated, handleDuplicated]
  );

  const filtered = useMemo(() => {
    return paintings.filter((p) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "sold") return p.sold;
      if (statusFilter === "live") return !p.sold && p.originalAvailable;
      if (statusFilter === "draft") return !p.sold && !p.originalAvailable;
      return true;
    });
  }, [paintings, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-sm mb-1">Manage</p>
          <h1 className="font-display text-3xl font-semibold text-charcoal">Paintings</h1>
          <p className="text-sm text-graphite mt-1">{total} total in catalog</p>
        </div>
        <Link href="/admin/paintings/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Painting
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "all", label: "All" },
            { id: "live", label: "Live" },
            { id: "draft", label: "Draft" },
            { id: "sold", label: "Sold" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setStatusFilter(f.id)}
            className={`px-3 py-1.5 rounded-sm text-sm transition-colors ${
              statusFilter === f.id
                ? "bg-charcoal text-ivory"
                : "bg-cream text-graphite border border-gold/20 hover:text-charcoal"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Separator />

      {loading ? (
        <p className="text-graphite py-8">Loading paintings…</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={filtered}
            searchKey="title"
            clientPagination={false}
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-graphite">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
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
