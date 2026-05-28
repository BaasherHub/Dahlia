"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import useCart from "@/hooks/use-cart";

interface OrderItem {
  id: string;
  price: number;
  version: string;
  painting?: {
    title: string;
    images?: string[];
  };
}

export interface OrderDetails {
  id: string;
  customerEmail: string;
  customerName: string;
  total: number;
  status: string;
  items: OrderItem[];
}

interface OrderSuccessViewProps {
  sessionId?: string;
  order: OrderDetails | null;
}

export function OrderSuccessView({ sessionId, order }: OrderSuccessViewProps) {
  const cart = useCart();

  useEffect(() => {
    cart.removeAll();
    // Clear cart once after successful return from Stripe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="section-padding container-narrow">
      <div className="max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-8">
          <span className="text-gold-dark text-3xl" aria-hidden>
            ✓
          </span>
        </div>
        <p className="label-sm mb-4 text-gold text-center">Order Confirmed</p>
        <h1 className="heading-xl mb-6 text-center">Thank You!</h1>

        {order ? (
          <div className="text-left space-y-6">
            <p className="text-graphite leading-relaxed text-center">
              Payment received. A confirmation email was sent to{" "}
              <span className="text-charcoal font-medium">{order.customerEmail}</span>.
            </p>

            <div className="bg-cream rounded-sm border border-gold/20 p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold text-charcoal">Your order</h2>
              <Separator />
              <ul className="space-y-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    {item.painting?.images?.[0] && (
                      <div className="relative w-16 h-16 rounded-sm overflow-hidden bg-ivory shrink-0">
                        <Image
                          src={item.painting.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal">
                        {item.painting?.title || "Artwork"}
                      </p>
                      <p className="text-xs text-graphite capitalize mt-0.5">
                        {item.version}
                      </p>
                    </div>
                    <p className="text-charcoal font-medium shrink-0">
                      {formatPrice(item.price)}
                    </p>
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="flex justify-between font-medium text-charcoal">
                <span>Total paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="text-sm text-graphite space-y-2 bg-ivory border border-charcoal/8 rounded-sm p-4">
              <p className="font-medium text-charcoal">What happens next</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your piece will be prepared for shipment from the studio.</li>
                <li>Tracking details will be emailed when your order ships.</li>
                <li>Questions? Reply to your confirmation email.</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-graphite leading-relaxed text-center mb-4">
            Your payment was successful. Order details will arrive by email shortly
            {sessionId ? " — processing can take a minute." : "."}
          </p>
        )}

        <div className="flex gap-4 justify-center flex-wrap mt-10">
          <Link href="/gallery">
            <Button variant="outline" size="lg">
              Continue Browsing
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg">Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
