import Image from "next/image";
import Link from "next/link";

interface Collection {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  paintings?: Array<{ id: string }>;
  _count?: { paintings: number };
}

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const count = collection._count?.paintings ?? collection.paintings?.length ?? 0;

  return (
    <Link href={`/collections/${collection.id}`} className="group block">
      <div className="overflow-hidden rounded-sm bg-cream aspect-square relative">
        {collection.coverImage ? (
          <Image
            src={collection.coverImage}
            alt={collection.name}
            fill
            className="object-cover transition-transform duration-600 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cream to-gold/20" />
        )}
        <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/10 transition-colors duration-400" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-ivory text-2xl font-semibold">
            {collection.name}
          </h3>
          {count > 0 && (
            <p className="text-ivory/70 text-sm mt-1">
              {count} {count === 1 ? "work" : "works"}
            </p>
          )}
        </div>
      </div>
      {collection.description && (
        <p className="mt-3 text-sm text-graphite line-clamp-2">
          {collection.description}
        </p>
      )}
    </Link>
  );
}
