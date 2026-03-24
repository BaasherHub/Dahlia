import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";

export function Footer() {
  return (
    <footer className="bg-cream border-t border-charcoal/10 text-charcoal mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-widest uppercase text-charcoal mb-4">
              Dahlia
            </h2>
            <p className="text-sm leading-relaxed text-graphite">
              Original paintings on premium materials. Each piece is a window
              into a world of color, emotion, and quiet beauty.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs tracking-widest uppercase text-gold-dark mb-6">
              Navigate
            </h3>
            <nav className="flex flex-col gap-3">
              {[
                { name: "Home", href: "/" },
                { name: "Gallery", href: "/gallery" },
                { name: "Collections", href: "/collections" },
                { name: "About", href: "/about" },
                { name: "Commissions", href: "/commissions" },
                { name: "Contact", href: "/contact" },
                { name: "Cart", href: "/cart" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-graphite hover:text-charcoal transition-colors duration-400"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div id="newsletter">
            <h3 className="text-xs tracking-widest uppercase text-gold-dark mb-6">
              Stay in Touch
            </h3>
            <p className="text-sm text-graphite mb-4">
              Be the first to know about new works and exhibitions.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-charcoal/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-graphite">
            © {new Date().getFullYear()} Dahlia Baasher. All rights reserved.
          </p>
          <p className="text-xs text-graphite">
            Fine Art · Original Paintings
          </p>
        </div>
      </div>
    </footer>
  );
}
