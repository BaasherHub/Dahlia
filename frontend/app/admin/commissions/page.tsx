"use client";

import { useEffect, useState, useCallback } from "react";
import { adminFetchCommissions, adminUpdateCommissionStatus } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface CommissionInquiry {
  id: string;
  name: string;
  email: string;
  vision: string;
  size: string;
  budget: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-gold/20 text-charcoal font-medium",
  read: "bg-blue-50 text-blue-700 font-medium",
  archived: "bg-charcoal/10 text-graphite",
};

const NEXT_STATUS: Record<string, string> = {
  new: "read",
  read: "archived",
  archived: "new",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  read: "Read",
  archived: "Archived",
};

function InquiryRow({ inquiry, onUpdated }: { inquiry: CommissionInquiry; onUpdated: (i: CommissionInquiry) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const cycleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setUpdating(true);
    try {
      const updated = await adminUpdateCommissionStatus(inquiry.id, NEXT_STATUS[inquiry.status] || "read");
      onUpdated(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="border border-gold/10 rounded-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full grid grid-cols-[1.5fr_1.5fr_1fr_1fr_auto_auto] gap-4 items-center px-4 py-3 text-left hover:bg-cream/50 transition-colors"
      >
        <div>
          <p className="font-medium text-charcoal text-sm">{inquiry.name}</p>
          <p className="text-xs text-graphite">{inquiry.email}</p>
        </div>
        <p className="text-sm text-graphite truncate">{inquiry.vision}</p>
        <p className="text-sm text-charcoal">{inquiry.size}</p>
        <p className="text-sm text-charcoal">{inquiry.budget}</p>
        <button
          type="button"
          onClick={cycleStatus}
          disabled={updating}
          className={`px-2 py-0.5 rounded-sm text-xs transition-opacity ${STATUS_STYLES[inquiry.status] || "bg-cream text-graphite"} ${updating ? "opacity-50" : "hover:opacity-80"}`}
        >
          {STATUS_LABELS[inquiry.status] || inquiry.status}
        </button>
        <span className="text-xs text-graphite whitespace-nowrap">
          {(() => { try { return format(new Date(inquiry.createdAt), "MMM d, yyyy"); } catch { return "—"; } })()}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-gold/10 bg-cream/30 px-4 py-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-graphite uppercase tracking-wide mb-1">Size</p>
              <p className="text-charcoal">{inquiry.size}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-graphite uppercase tracking-wide mb-1">Budget</p>
              <p className="text-charcoal">{inquiry.budget}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-graphite uppercase tracking-wide mb-1">Contact</p>
              <a href={`mailto:${inquiry.email}`} className="text-charcoal hover:underline">{inquiry.email}</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-graphite uppercase tracking-wide mb-1">Vision</p>
            <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">{inquiry.vision}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCommissionsPage() {
  const [inquiries, setInquiries] = useState<CommissionInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "archived">("all");

  const load = useCallback(async () => {
    try {
      const data = await adminFetchCommissions();
      setInquiries(Array.isArray(data) ? data : []);
    } catch {
      setInquiries([]);
      toast.error("Failed to load commission inquiries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpdated = (updated: CommissionInquiry) => {
    setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const filtered = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);
  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="label-sm mb-1">Manage</p>
          <h1 className="font-display text-3xl font-semibold text-charcoal">Commission Inquiries</h1>
          <p className="text-sm text-graphite mt-1">
            {inquiries.length} total{newCount > 0 && ` · ${newCount} new`} · click a row to expand · click status badge to cycle
          </p>
        </div>
      </div>

      <Separator />

      <div className="flex gap-2">
        {(["all", "new", "read", "archived"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-sm text-sm transition-colors capitalize ${
              filter === f
                ? "bg-charcoal text-ivory"
                : "bg-cream text-graphite hover:text-charcoal border border-gold/20"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-graphite py-8">Loading inquiries…</p>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-graphite">No {filter === "all" ? "" : filter} inquiries.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_auto_auto] gap-4 px-4 py-2 text-xs font-medium text-graphite uppercase tracking-wide">
            <span>Client</span>
            <span>Vision</span>
            <span>Size</span>
            <span>Budget</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          {filtered.map((inquiry) => (
            <InquiryRow key={inquiry.id} inquiry={inquiry} onUpdated={handleUpdated} />
          ))}
        </div>
      )}
    </div>
  );
}
