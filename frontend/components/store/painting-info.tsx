"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import useCart from "@/hooks/use-cart";

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
  sold: boolean;
  collection?: { id: string; name: string };
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

  const canPurchase =
    !painting.sold && painting.originalAvailable && !!painting.originalPrice;

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
          <span className="text-xs tracking-widest uppercase w-24 shrink-0">Medium</span>
          <span className="text-charcoal">{painting.medium}</span>
        </div>
        <div className="flex gap-8">
          <span className="text-xs tracking-widest uppercase w-24 shrink-0">Size</span>
          <span className="text-charcoal">{painting.dimensions}</span>
        </div>
        {painting.collection && (
          <div className="flex gap-8">
            <span className="text-xs tracking-widest uppercase w-24 shrink-0">
              Collection
            </span>
            <Link
              href={`/collections/${painting.collection.id}`}
              className="text-charcoal hover:text-gold-dark underline-offset-2 hover:underline"
            >
              {painting.collection.name}
            </Link>
          </div>
        )}
      </div>

      <Separator />

      <p className="text-graphite leading-relaxed text-base">{painting.description}</p>

      <Separator />

      {painting.sold ? (
        <div className="space-y-4">
          <p className="font-display text-xl text-graphite italic">
            This work has been sold.
          </p>
          <Link href="/commissions">
            <Button variant="outline">Inquire about a similar piece</Button>
          </Link>
        </div>
      ) : canPurchase ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gold/20 rounded-sm bg-cream/40">
            <div>
              <p className="text-xs tracking-widest uppercase text-graphite mb-1">
                Original · one of a kind
              </p>
              <p className="text-charcoal text-2xl font-medium">
                {formatPrice(painting.originalPrice!)}
              </p>
            </div>
            <Button onClick={addOriginal} size="lg" className="shrink-0">
              Add to Cart
            </Button>
          </div>
          <ul className="text-xs text-graphite space-y-1.5 border-l-2 border-gold/30 pl-4">
            <li>Original oil painting — ships from the studio</li>
            <li>Carefully packed for safe delivery</li>
            <li>Shipping calculated at checkout where applicable</li>
          </ul>
        </div>
      ) : (
        <p className="text-graphite text-sm">
          This work is not currently available for online purchase.{" "}
          <Link href="/contact" className="text-charcoal underline hover:text-gold-dark">
            Contact me
          </Link>{" "}
          for availability.
        </p>
      )}
    </div>
  );
}
