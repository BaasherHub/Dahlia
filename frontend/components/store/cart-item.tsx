"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import useCart, { CartItem } from "@/hooks/use-cart";

interface CartItemProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemProps) {
  const cart = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-gold/10">
      <Link
        href={`/paintings/${item.paintingId}`}
        className="relative w-20 h-20 rounded-sm overflow-hidden bg-cream flex-shrink-0 hover:opacity-90 transition-opacity"
      >
        {item.image && (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/paintings/${item.paintingId}`}
          className="font-display text-charcoal font-medium hover:text-gold-dark transition-colors"
        >
          {item.title}
        </Link>
        <p className="text-sm text-graphite capitalize mt-1">{item.type}</p>
        <p className="text-charcoal font-medium mt-2">{formatPrice(item.price)}</p>
      </div>

      <button
        type="button"
        onClick={() => cart.removeItem(item.paintingId, item.type)}
        className="flex-shrink-0 p-1 text-graphite hover:text-charcoal transition-colors duration-400"
        aria-label={`Remove ${item.title} from cart`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
