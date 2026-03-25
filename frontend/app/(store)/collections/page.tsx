import type { Metadata } from "next";
import { fetchCollections, fetchSiteSettings } from "@/lib/api";
import { CollectionCard } from "@/components/store/collection-card";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse painting collections and series.",
};

export default async function CollectionsPage() {
  let collections: Parameters<typeof CollectionCard>[0]['collection'][] = [];
  let settings: Awaited<ReturnType<typeof fetchSiteSettings>> = null;
  const [colRes, settingsRes] = await Promise.allSettled([
    fetchCollections(),
    fetchSiteSettings(),
  ]);
  if (colRes.status === "fulfilled") {
    const result = colRes.value;
    collections = Array.isArray(result) ? result : result?.collections || [];
  }
  if (settingsRes.status === "fulfilled") {
    settings = settingsRes.value;
  }

  return (
    <div className="section-padding container-wide">
      <div className="mb-12">
        <h1 className="heading-xl">{settings?.portfolioTitle?.trim() || "Collections"}</h1>
        <p className="text-graphite mt-4 max-w-2xl text-sm leading-relaxed">
          {settings?.portfolioSubtitle?.trim() ||
            "Start your collection — shop original one-of-a-kind oil paintings on premium linen canvas."}
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-graphite">No collections yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, i) => (
            <div
              key={collection.id}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CollectionCard collection={collection} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
