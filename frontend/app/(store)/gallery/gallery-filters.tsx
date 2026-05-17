"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

const filters = [
  { label: "All works", value: "" },
  { label: "Featured", value: "featured" },
];

export function GalleryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("featured") ? "featured" : "";

  const setFilter = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "featured") {
        params.set("featured", "true");
      } else {
        params.delete("featured");
      }
      router.push(`/gallery?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex gap-3 flex-wrap">
      {filters.map((f) => (
        <Button
          key={f.value}
          variant={current === f.value ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter(f.value)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
}
