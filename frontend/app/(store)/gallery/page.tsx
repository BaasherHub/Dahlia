import type { Metadata } from "next";
import { fetchPaintings, fetchSiteSettings } from "@/lib/api";
import { PaintingCard } from "@/components/store/painting-card";
import { Suspense } from "react";
import { GalleryFilters } from "./gallery-filters";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse original paintings.",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const params: Record<string, string> = {};
  if (sp.collectionId) params.collectionId = sp.collectionId;
  if (sp.featured === "true") params.featured = "true";

  let paintings: Parameters<typeof PaintingCard>[0]['painting'][] = [];
  let settings = null;
  try {
    const [result, siteSettings] = await Promise.all([
      fetchPaintings(params),
      fetchSiteSettings(),
    ]);
    paintings = Array.isArray(result) ? result : result?.data ?? [];
    settings = siteSettings;
  } catch {
    paintings = [];
  }

  return (
    <div className="section-padding container-wide">
      <div className="mb-8">
        <p className="label-sm mb-3">{settings?.galleryLabel?.trim() || "All Works"}</p>
        <h1 className="heading-xl">{settings?.galleryTitle?.trim() || "Gallery"}</h1>
        {settings?.gallerySubtitle?.trim() && (
          <p className="text-graphite mt-4 max-w-2xl text-sm leading-relaxed">
            {settings.gallerySubtitle.trim()}
          </p>
        )}
      </div>
      <div className="mb-10">
        <Suspense fallback={null}>
          <GalleryFilters />
        </Suspense>
      </div>

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
