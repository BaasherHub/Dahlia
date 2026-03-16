import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroPainting {
  id: string;
  title: string;
  images: string[];
  description: string;
  medium?: string;
  dimensions?: string;
}

interface HeroProps {
  painting: HeroPainting | null;
}

export function Hero({ painting }: HeroProps) {
  if (!painting) {
    return (
      <section className="relative min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-charcoal tracking-tight mb-6">
            Dahlia Studio
          </h1>
          <p className="text-graphite text-lg max-w-md mx-auto">
            Original paintings and fine art prints
          </p>
          <Link href="/gallery" className="mt-8 inline-block">
            <Button size="lg" variant="outline">
              View Gallery
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {painting.images?.[0] && (
          <Image
            src={painting.images[0]}
            alt={painting.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-end min-h-screen pb-20 px-6 lg:px-16">
        <div className="max-w-lg">
          <p className="text-gold text-xs tracking-widest uppercase mb-4 animate-fade-in">
            Featured Work
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-ivory leading-tight mb-4">
            {painting.title}
          </h1>
          <p className="text-ivory/70 text-sm mb-2">
            {painting.medium}
            {painting.dimensions ? ` · ${painting.dimensions}` : ""}
          </p>
          <p className="text-ivory/60 text-base max-w-sm leading-relaxed mb-8 line-clamp-3">
            {painting.description}
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href={`/paintings/${painting.id}`}>
              <Button size="lg" className="bg-ivory text-charcoal hover:bg-gold-light">
                View Painting
              </Button>
            </Link>
            <Link href="/gallery">
              <Button
                size="lg"
                variant="outline"
                className="border-ivory/50 text-ivory hover:bg-ivory/10"
              >
                Browse Gallery
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
