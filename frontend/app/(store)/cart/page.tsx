"use client";

import Link from "next/link";
import { CartItemRow } from "@/components/store/cart-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import useCart from "@/hooks/use-cart";

export default function CartPage() {
  const cart = useCart();
  const total = cart.items.reduce((sum, item) => sum + item.price, 0);

  if (cart.items.length === 0) {
    return (
      <div className="section-padding container-narrow text-center">
        <div className="max-w-sm mx-auto">
          <p className="label-sm mb-4">Your Cart</p>
          <h1 className="heading-lg mb-6">Cart is Empty</h1>
          <p className="text-graphite mb-8">
            Browse the gallery to find paintings you love.
          </p>
          <a href="/gallery">
            <Button variant="outline" size="lg">
              Browse Gallery
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding container-narrow">
      <p className="label-sm mb-4">Your Cart</p>
      <h1 className="heading-lg mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <CartItemRow key={`${item.paintingId}-${item.type}`} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="bg-cream rounded-sm p-6 h-fit space-y-4">
          <h2 className="font-display text-lg font-semibold text-charcoal">
            Order Summary
          </h2>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-graphite">
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
            </span>
            <span className="font-medium text-charcoal">
              {formatPrice(total)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-medium text-charcoal">Total</span>
            <span className="font-display italic text-xl text-gold-dark">
              {formatPrice(total)}
            </span>
          </div>
          <Link href="/checkout">
            <Button className="w-full mt-2" size="lg">
              Proceed to Checkout
            </Button>
          </Link>
          <p className="text-xs text-graphite text-center">
            Secured by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
