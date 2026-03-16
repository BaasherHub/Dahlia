import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCollection } from "@/lib/api";
import { PaintingCard } from "@/components/store/painting-card";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const collection = await fetchCollection(id);
    return {
      title: collection.name,
      description: collection.description,
    };
  } catch {
    return { title: "Collection" };
  }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { id } = await params;
  let collection: {
    id: string;
    name: string;
    description?: string;
    paintings: Parameters<typeof PaintingCard>[0]['painting'][];
  };
  try {
    collection = await fetchCollection(id);
  } catch {
    notFound();
  }

  return (
    <div className="section-padding container-wide">
      <div className="mb-12">
        <p className="label-sm mb-3">Collection</p>
        <h1 className="heading-xl">{collection.name}</h1>
        {collection.description && (
          <p className="text-graphite mt-4 max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        )}
      </div>

      {collection.paintings?.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-graphite">No paintings in this collection yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {(collection.paintings || []).map(
            (painting: Parameters<typeof PaintingCard>[0]['painting'], i: number) => (
              <div
                key={painting.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <PaintingCard painting={painting} />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
