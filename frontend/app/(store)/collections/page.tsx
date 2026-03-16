import type { Metadata } from "next";
import { fetchCollections } from "@/lib/api";
import { CollectionCard } from "@/components/store/collection-card";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse painting collections and series.",
};

export default async function CollectionsPage() {
  let collections: Parameters<typeof CollectionCard>[0]['collection'][] = [];
  try {
    const result = await fetchCollections();
    collections = Array.isArray(result) ? result : result?.collections || [];
  } catch {
    collections = [];
  }

  return (
    <div className="section-padding container-wide">
      <div className="mb-12">
        <p className="label-sm mb-3">Series</p>
        <h1 className="heading-xl">Collections</h1>
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
