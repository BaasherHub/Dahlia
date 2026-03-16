"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

const filters = [
  { label: "All", value: "" },
  { label: "Originals", value: "original" },
  { label: "Prints", value: "print" },
];

export function GalleryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") || "";

  const setFilter = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("category", value);
      } else {
        params.delete("category");
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
