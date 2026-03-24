"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartItemRow } from "@/components/store/cart-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import useCart from "@/hooks/use-cart";
import { createCheckoutSession } from "@/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "IN", name: "India" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "OTHER", name: "Other" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    phone: "",
  });

  const total = cart.items.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.items.length === 0) return;
    setLoading(true);
    try {
      const payload = {
        items: cart.items.map((item) => ({
          paintingId: item.paintingId,
          type: item.type,
        })),
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        shipping: {
          name: formData.customerName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country === "OTHER" ? "US" : formData.country,
          phone: formData.phone || undefined,
        },
      };
      const { url } = await createCheckoutSession(payload);
      if (url) {
        window.location.href = url;
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  if (cart.items.length === 0) {
    return (
      <div className="section-padding container-narrow text-center">
        <p className="label-sm mb-4">Checkout</p>
        <h1 className="heading-lg mb-6">Your cart is empty</h1>
        <p className="text-graphite mb-8">Add items to your cart before checkout.</p>
        <Link href="/gallery">
          <Button variant="outline" size="lg">
            Browse Gallery
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="section-padding container-wide">
      <p className="label-sm mb-4">Checkout</p>
      <h1 className="heading-lg mb-10">Complete Your Order</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="font-display text-lg font-semibold text-charcoal mb-6">
                Contact & Shipping
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      required
                      value={formData.customerName}
                      onChange={update("customerName")}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={update("customerEmail")}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    required
                    value={formData.street}
                    onChange={update("street")}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={update("city")}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province *</Label>
                    <Input
                      id="state"
                      required
                      value={formData.state}
                      onChange={update("state")}
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP / Postcode *</Label>
                    <Input
                      id="zip"
                      required
                      value={formData.zip}
                      onChange={update("zip")}
                      placeholder="ZIP"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <select
                      id="country"
                      required
                      value={formData.country}
                      onChange={update("country")}
                      className="flex h-10 w-full rounded-md border border-charcoal/20 bg-ivory px-3 py-2 text-sm ring-offset-ivory placeholder:text-graphite focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={update("phone")}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="bg-cream rounded-sm p-6 h-fit space-y-4">
            <h2 className="font-display text-lg font-semibold text-charcoal">Order Summary</h2>
            <Separator />
            <div className="space-y-3">
              {cart.items.map((item) => (
                <CartItemRow key={`${item.paintingId}-${item.type}`} item={item} />
              ))}
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-graphite">
                {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
              </span>
              <span className="font-medium text-charcoal">{formatPrice(total)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-medium text-charcoal">Total</span>
              <span className="font-display italic text-xl text-gold-dark">
                {formatPrice(total)}
              </span>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2"
              size="lg"
            >
              {loading ? "Processing…" : "Pay with Stripe"}
            </Button>
            <p className="text-xs text-graphite text-center">Secured by Stripe</p>
            <Link href="/cart" className="block text-center text-sm text-graphite hover:text-charcoal">
              Back to cart
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
