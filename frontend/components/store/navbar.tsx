"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import useCart from "@/hooks/use-cart";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const cart = useCart();
  const itemCount = cart.items.length;

  const portfolioChildren = [
    { name: "Collections", href: "/collections" },
    { name: "Featured Works", href: "/gallery?featured=true" },
  ];

  const contactChildren = [
    { name: "Contact", href: "/contact" },
    { name: "Commissions", href: "/commissions" },
  ];

  const mainNav = [
    { name: "About", href: "/about" },
    { name: "Portfolio", href: "/collections", hasDropdown: true, children: portfolioChildren },
    { name: "Contact", href: "/contact", hasDropdown: true, children: contactChildren },
  ];

  return (
    <header className="bg-ivory backdrop-blur-sm border-b border-charcoal/8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-widest text-charcoal uppercase hover:text-gold-dark transition-colors duration-400"
          >
            Dahlia
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {mainNav.map((item) =>
              item.hasDropdown && item.children ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() =>
                    item.name === "Portfolio"
                      ? setPortfolioOpen(true)
                      : setContactOpen(true)
                  }
                  onMouseLeave={() =>
                    item.name === "Portfolio"
                      ? setPortfolioOpen(false)
                      : setContactOpen(false)
                  }
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-sm tracking-widest uppercase text-graphite hover:text-charcoal transition-colors duration-400"
                  >
                    {item.name}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        (item.name === "Portfolio" && portfolioOpen) ||
                        (item.name === "Contact" && contactOpen)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </Link>
                  {(item.name === "Portfolio" && portfolioOpen) ||
                  (item.name === "Contact" && contactOpen) ? (
                    <div className="absolute top-full left-0 mt-1 py-2 w-56 bg-ivory border border-charcoal/10 rounded-sm shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.href + child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-graphite hover:text-charcoal hover:bg-cream transition-colors"
                          onClick={() => {
                            setPortfolioOpen(false);
                            setContactOpen(false);
                          }}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
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
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-ivory border-t border-charcoal/6">
          <nav className="flex flex-col px-6 py-4 gap-2">
            {mainNav.map((item) =>
              item.hasDropdown && item.children ? (
                <div key={item.name} className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-graphite py-2">
                    {item.name}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.href + child.name}
                      href={child.href}
                      className="block text-sm tracking-widest uppercase text-graphite hover:text-charcoal py-2 pl-4 border-l-2 border-gold/30"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm tracking-widest uppercase text-graphite hover:text-charcoal py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
