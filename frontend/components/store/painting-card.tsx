import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface Painting {
  id: string;
  title: string;
  images: string[];
  medium: string;
  dimensions: string;
  originalPrice?: number;
  printPrice?: number;
  originalAvailable: boolean;
  printAvailable: boolean;
  sold: boolean;
}

interface PaintingCardProps {
  painting: Painting;
}

export function PaintingCard({ painting }: PaintingCardProps) {
  const price = painting.originalPrice;
  const image = painting.images?.[0] || "";

  return (
    <Link href={`/paintings/${painting.id}`} className="group block">
      <div className="overflow-hidden rounded-sm bg-cream aspect-square relative">
        {image && (
          <Image
            src={image}
            alt={painting.title}
            fill
            className="object-cover transition-transform duration-600 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {painting.sold && (
          <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center">
            <span className="text-ivory text-sm tracking-widest uppercase font-display">
              Sold
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-display text-charcoal font-medium text-lg leading-tight group-hover:text-gold-dark transition-colors duration-400">
          {painting.title}
        </h3>
        <p className="text-sm text-graphite">{painting.medium}</p>
        <p className="text-sm text-graphite">{painting.dimensions}</p>
        {price && (
          <p className="text-charcoal text-base font-medium">
            {formatPrice(price)}
          </p>
        )}
      </div>
    </Link>
  );
}
