"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchSiteSettings } from "@/lib/api";

export function PromoStrip() {
  const [text, setText] = useState("Join the Collector's List → 10% off your first order");

  useEffect(() => {
    fetchSiteSettings().then((s) => {
      if (s?.newsletterTitle && s?.newsletterSubtitle) {
        setText(`${s.newsletterTitle} → ${s.newsletterSubtitle}`);
      }
    }).catch(() => {});
  }, []);

  return (
    <Link
      href="/#newsletter"
      className="block bg-charcoal text-ivory text-center py-2 px-4 text-sm tracking-wider hover:bg-graphite transition-colors duration-300"
    >
      {text}
    </Link>
  );
}
