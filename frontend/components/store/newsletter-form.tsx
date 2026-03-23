"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";
import toast from "react-hot-toast";

interface NewsletterFormProps {
  dark?: boolean;
}

export function NewsletterForm({ dark = false }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = dark
    ? "bg-ivory/10 border-ivory/20 text-ivory placeholder:text-ivory/40 focus:border-gold"
    : "bg-ivory border-gold/30 text-charcoal placeholder:text-graphite/50 focus:border-gold";

  const buttonClass = dark
    ? "bg-gold text-charcoal hover:bg-gold-light"
    : "bg-charcoal text-ivory hover:bg-graphite";

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className={`flex-1 h-10 rounded-sm border px-3 py-2 text-sm outline-none transition-colors duration-400 ${inputClass}`}
      />
      <button
        type="submit"
        disabled={loading}
        className={`h-10 px-4 text-sm rounded-sm transition-colors duration-400 disabled:opacity-60 ${buttonClass}`}
      >
        {loading ? "…" : "Subscribe"}
      </button>
    </form>
  );
}
