"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { adminBulkPaintingStatus, adminFetchAllPaintings } from "@/lib/api";
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

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

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((ids: string[], checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    return paintings.filter((p) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "sold") return p.sold;
      if (statusFilter === "live") return !p.sold && p.originalAvailable;
      if (statusFilter === "draft") return !p.sold && !p.originalAvailable;
      return true;
    });
  }, [paintings, statusFilter]);

  const pageIds = useMemo(() => filtered.map((p) => p.id), [filtered]);

  const selection = useMemo(
    () => ({
      selectedIds,
      onToggle: toggleSelect,
      onToggleAll: toggleSelectAll,
      pageIds,
    }),
    [selectedIds, toggleSelect, toggleSelectAll, pageIds]
  );

  const runBulk = async (payload: {
    sold?: boolean;
    originalAvailable?: boolean;
    featured?: boolean;
  }) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkBusy(true);
    try {
      const { updated } = await adminBulkPaintingStatus({ ids, ...payload });
      toast.success(`Updated ${updated} painting${updated === 1 ? "" : "s"}.`);
      setSelectedIds(new Set());
      await load(page);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk update failed.");
    } finally {
      setBulkBusy(false);
    }
  };

  const columns = useMemo(
    () => buildPaintingColumns(handleUpdated, handleDuplicated, selection),
    [handleUpdated, handleDuplicated, selection]
  );

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
          {selectedIds.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-cream border border-gold/20 rounded-sm">
              <span className="text-sm text-charcoal font-medium mr-2">
                {selectedIds.size} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={bulkBusy}
                onClick={() => runBulk({ sold: true })}
              >
                Mark sold
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={bulkBusy}
                onClick={() => runBulk({ sold: false, originalAvailable: true })}
              >
                Mark live
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={bulkBusy}
                onClick={() => runBulk({ featured: true })}
              >
                Feature
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={bulkBusy}
                onClick={() => runBulk({ featured: false })}
              >
                Unfeature
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={bulkBusy}
                onClick={() => setSelectedIds(new Set())}
              >
                Clear
              </Button>
            </div>
          )}
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
