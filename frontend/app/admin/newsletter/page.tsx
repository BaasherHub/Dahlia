"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { Trash2, Download } from "lucide-react";
import toast from "react-hot-toast";
import {
  adminFetchNewsletterSubscribers,
  adminDeleteNewsletterSubscriber,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetchNewsletterSubscribers();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch {
      setSubscribers([]);
      toast.error("Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string, email: string) => {
    if (!confirm(`Remove ${email} from the list?`)) return;
    setRemovingId(id);
    try {
      await adminDeleteNewsletterSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast.success("Subscriber removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove.");
    } finally {
      setRemovingId(null);
    }
  };

  const exportCsv = () => {
    const header = "email,subscribed_at\n";
    const rows = subscribers
      .map((s) => `${s.email},${new Date(s.createdAt).toISOString()}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label-sm mb-1">Audience</p>
          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Newsletter
          </h1>
          <p className="text-sm text-graphite mt-1">
            {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
          </p>
        </div>
        {subscribers.length > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={exportCsv}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      <Separator />

      {loading ? (
        <p className="text-graphite py-8">Loading subscribers…</p>
      ) : subscribers.length === 0 ? (
        <p className="text-graphite py-12 text-center">
          No subscribers yet. They appear here when visitors sign up in the footer.
        </p>
      ) : (
        <div className="rounded-sm border border-gold/20 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 bg-cream text-xs font-medium text-graphite uppercase tracking-wide">
            <span>Email</span>
            <span>Subscribed</span>
            <span className="w-10" />
          </div>
          <ul className="divide-y divide-gold/10">
            {subscribers.map((s) => (
              <li
                key={s.id}
                className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3 hover:bg-cream/50"
              >
                <a
                  href={`mailto:${s.email}`}
                  className="text-sm text-charcoal hover:underline truncate"
                >
                  {s.email}
                </a>
                <span className="text-xs text-graphite whitespace-nowrap">
                  {format(new Date(s.createdAt), "MMM d, yyyy")}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={removingId === s.id}
                  onClick={() => remove(s.id, s.email)}
                  aria-label={`Remove ${s.email}`}
                >
                  <Trash2 className="h-4 w-4 text-graphite" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
