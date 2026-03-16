"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import useCart from "@/hooks/use-cart";

const navigation = [
  { name: "Gallery", href: "/gallery" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Commissions", href: "/commissions" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cart = useCart();
  const itemCount = cart.items.length;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-ivory/90 backdrop-blur-sm border-b border-charcoal/6">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-widest text-charcoal uppercase hover:text-gold-dark transition-colors duration-400"
          >
            Dahlia
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm tracking-widest uppercase text-graphite hover:text-charcoal transition-colors duration-400"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart + mobile toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 text-charcoal hover:text-gold-dark transition-colors duration-400"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-charcoal font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-charcoal"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-ivory border-t border-charcoal/6">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm tracking-widest uppercase text-graphite hover:text-charcoal transition-colors duration-400 py-2"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
