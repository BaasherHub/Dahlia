import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  return (
    <div className="section-padding container-narrow text-center">
      <div className="max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-8">
          <span className="text-gold-dark text-3xl">✓</span>
        </div>
        <p className="label-sm mb-4 text-gold">Order Confirmed</p>
        <h1 className="heading-xl mb-6">Thank You!</h1>
        <p className="text-graphite leading-relaxed mb-4">
          Your order has been confirmed and payment has been processed
          successfully. You&apos;ll receive a confirmation email shortly.
        </p>
        {session_id && (
          <p className="text-xs text-graphite/60 mb-8">
            Order reference: {session_id.slice(0, 20)}…
          </p>
        )}
        <div className="flex gap-4 justify-center flex-wrap">
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
