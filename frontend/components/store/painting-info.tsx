"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import useCart from "@/hooks/use-cart";
import toast from "react-hot-toast";

interface Painting {
  id: string;
  title: string;
  description: string;
  images: string[];
  medium: string;
  dimensions: string;
  year?: number;
  originalPrice?: number;
  originalAvailable: boolean;
  printPrice?: number;
  printAvailable: boolean;
  sold: boolean;
  collection?: { name: string };
}

interface PaintingInfoProps {
  painting: Painting;
}

export function PaintingInfo({ painting }: PaintingInfoProps) {
  const cart = useCart();

  const addOriginal = () => {
    if (!painting.originalPrice) return;
    cart.addItem({
      paintingId: painting.id,
      title: painting.title,
      image: painting.images?.[0] || "",
      type: "original",
      price: painting.originalPrice,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-charcoal leading-tight">
          {painting.title}
        </h1>
        {painting.year && (
          <p className="text-graphite mt-2 text-sm tracking-widest uppercase">
            {painting.year}
          </p>
        )}
      </div>

      <Separator />

      <div className="space-y-3 text-sm text-graphite">
        <div className="flex gap-8">
          <span className="text-xs tracking-widest uppercase w-24">Medium</span>
          <span className="text-charcoal">{painting.medium}</span>
        </div>
        <div className="flex gap-8">
          <span className="text-xs tracking-widest uppercase w-24">Size</span>
          <span className="text-charcoal">{painting.dimensions}</span>
        </div>
        {painting.collection && (
          <div className="flex gap-8">
            <span className="text-xs tracking-widest uppercase w-24">
              Collection
            </span>
            <span className="text-charcoal">{painting.collection.name}</span>
          </div>
        )}
      </div>

      <Separator />

      <p className="text-graphite leading-relaxed">{painting.description}</p>

      <Separator />

      {/* Pricing & purchase */}
      {painting.sold ? (
        <p className="font-display text-xl text-graphite italic">
          This work has been sold.
        </p>
      ) : (
        <div className="space-y-4">
          {painting.originalAvailable && painting.originalPrice && (
            <div className="flex items-center justify-between p-4 border border-gold/20 rounded-sm">
              <div>
                <p className="text-xs tracking-widest uppercase text-graphite mb-1">
                  Original
                </p>
                <p className="text-charcoal text-xl font-medium">
                  {formatPrice(painting.originalPrice)}
                </p>
              </div>
              <Button onClick={addOriginal} variant="outline">
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
