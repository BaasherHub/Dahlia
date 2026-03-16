import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/80 mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-widest uppercase text-ivory mb-4">
              Dahlia
            </h2>
            <p className="text-sm leading-relaxed text-ivory/60">
              Original paintings and fine art prints. Each piece is a window
              into a world of color, emotion, and quiet beauty.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-gold mb-6">
              Navigate
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Gallery", href: "/gallery" },
                { name: "Collections", href: "/collections" },
                { name: "About", href: "/about" },
                { name: "Commissions", href: "/commissions" },
                { name: "Cart", href: "/cart" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-ivory/60 hover:text-ivory transition-colors duration-400"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-gold mb-6">
              Stay in Touch
            </h3>
            <p className="text-sm text-ivory/60 mb-4">
              Be the first to know about new works and exhibitions.
            </p>
            <NewsletterForm dark />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ivory/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ivory/40">
            © {new Date().getFullYear()} Dahlia Baasher. All rights reserved.
          </p>
          <p className="text-xs text-ivory/40">
            Fine Art · Original Paintings · Limited Prints
          </p>
        </div>
      </div>
    </footer>
  );
}
