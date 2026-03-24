import type { Metadata } from "next";
import { fetchPaintings } from "@/lib/api";
import { PaintingCard } from "@/components/store/painting-card";
import { GalleryFilters } from "./gallery-filters";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse all original paintings and prints.",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const params: Record<string, string> = {};
  if (sp.category) params.category = sp.category;
  if (sp.collectionId) params.collectionId = sp.collectionId;

  let paintings: Parameters<typeof PaintingCard>[0]['painting'][] = [];
  try {
    const result = await fetchPaintings(params);
    paintings = Array.isArray(result) ? result : result?.data ?? [];
  } catch {
    paintings = [];
  }

  return (
    <div className="section-padding container-wide">
      <div className="mb-12">
        <p className="label-sm mb-3">All Works</p>
        <h1 className="heading-xl">Gallery</h1>
      </div>

      <GalleryFilters />

      {paintings.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-graphite">No paintings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {paintings.map((painting, i) => (
            <div
              key={painting.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <PaintingCard painting={painting} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
