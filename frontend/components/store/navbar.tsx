"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import useCart from "@/hooks/use-cart";

const mainNav = [
  { name: "Gallery", href: "/gallery" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact", hasDropdown: true },
] as const;

const contactLinks = [
  { name: "Contact", href: "/contact" },
  { name: "Commissions", href: "/commissions" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const cart = useCart();
  const itemCount = cart.items.length;

  return (
    <header className="bg-ivory backdrop-blur-sm border-b border-charcoal/8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-script text-3xl md:text-4xl font-normal text-charcoal normal-case tracking-normal hover:text-gold-dark transition-colors duration-400"
          >
            Dahlia
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {mainNav.map((item) =>
              "hasDropdown" in item && item.hasDropdown ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setContactOpen(true)}
                  onMouseLeave={() => setContactOpen(false)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm tracking-widest uppercase text-graphite hover:text-charcoal transition-colors duration-400"
                    aria-expanded={contactOpen}
                    aria-haspopup="true"
                  >
                    {item.name}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        contactOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {contactOpen && (
                    <div className="absolute top-full left-0 mt-1 py-2 w-56 bg-ivory border border-charcoal/10 rounded-sm shadow-lg z-50">
                      <Link
                        href="/contact"
                        className="block px-4 py-2 text-sm text-graphite hover:text-charcoal hover:bg-cream transition-colors"
                      >
                        Contact
                      </Link>
                      <Link
                        href="/commissions"
                        className="block px-4 py-2 text-sm text-graphite hover:text-charcoal hover:bg-cream transition-colors"
                      >
                        Commissions
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm tracking-widest uppercase text-graphite hover:text-charcoal transition-colors duration-400"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 text-charcoal hover:text-gold-dark transition-colors duration-400"
              aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-charcoal font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="md:hidden p-2 text-charcoal"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-ivory border-t border-charcoal/6">
          <nav className="flex flex-col px-6 py-4 gap-1">
            <Link
              href="/gallery"
              className="text-sm tracking-widest uppercase text-graphite hover:text-charcoal py-3"
              onClick={() => setMobileOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/collections"
              className="text-sm tracking-widest uppercase text-graphite hover:text-charcoal py-3"
              onClick={() => setMobileOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/about"
              className="text-sm tracking-widest uppercase text-graphite hover:text-charcoal py-3"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <p className="text-xs uppercase tracking-wider text-graphite pt-3 pb-1">Contact</p>
            {contactLinks.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className="text-sm tracking-widest uppercase text-graphite hover:text-charcoal py-2 pl-4 border-l-2 border-gold/30"
                onClick={() => setMobileOpen(false)}
              >
                {child.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
