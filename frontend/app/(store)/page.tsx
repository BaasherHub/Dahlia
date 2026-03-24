import { Hero } from "@/components/store/hero";
import { PaintingCard } from "@/components/store/painting-card";
import { CollectionCard } from "@/components/store/collection-card";
import { fetchHeroPainting, fetchPaintings, fetchCollections, fetchSiteSettings } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function HomePage() {
  const [hero, paintings, collections, settings] = await Promise.allSettled([
    fetchHeroPainting(),
    fetchPaintings({ featured: "true", limit: "6" }),
    fetchCollections(),
    fetchSiteSettings(),
  ]);

  const heroPainting = hero.status === "fulfilled" ? hero.value : null;
  const featuredPaintings =
    paintings.status === "fulfilled"
      ? Array.isArray(paintings.value)
        ? paintings.value
        : paintings.value?.data ?? []
      : [];
  const allCollections =
    collections.status === "fulfilled"
      ? Array.isArray(collections.value)
        ? collections.value
        : collections.value?.collections || []
      : [];
  const siteSettings = settings.status === "fulfilled" ? settings.value : null;

  return (
    <>
      {/* Hero */}
      <Hero painting={heroPainting} settings={siteSettings} />

      {/* Start your collection — Anna Sudbina style */}
      <section className="section-padding border-b border-charcoal/6">
        <div className="container-wide">
          <p className="label-sm mb-3">Start your collection</p>
          <h2 className="heading-lg mb-10">Shop Art</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/gallery?category=print"
              className="group block bg-cream rounded-sm p-8 md:p-12 border border-charcoal/10 hover:border-gold/40 transition-colors duration-400"
            >
              <h3 className="font-display text-2xl font-semibold text-charcoal mb-3 group-hover:text-gold-dark transition-colors">
                {siteSettings?.printsTitle || "Limited Edition Prints"}
              </h3>
              <p className="text-graphite text-sm mb-6">
                {siteSettings?.printsSubtitle || "High-quality reproductions on museum-grade paper"}
              </p>
              <span className="text-sm tracking-widest uppercase text-gold group-hover:underline">
                Shop Prints →
              </span>
            </Link>
            <Link
              href="/gallery?category=original"
              className="group block bg-cream rounded-sm p-8 md:p-12 border border-charcoal/10 hover:border-gold/40 transition-colors duration-400"
            >
              <h3 className="font-display text-2xl font-semibold text-charcoal mb-3 group-hover:text-gold-dark transition-colors">
                Original Paintings
              </h3>
              <p className="text-graphite text-sm mb-6">
                One-of-a-kind works on premium linen canvas
              </p>
              <span className="text-sm tracking-widest uppercase text-gold group-hover:underline">
                Shop Originals →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto px-6 lg:px-12" />

      {/* Featured Works */}
      {featuredPaintings.length > 0 && (
        <section className="section-padding">
          <div className="container-wide">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="label-sm mb-3">Selected Works</p>
                <h2 className="heading-lg">
                  {siteSettings?.featuredWorksTitle || "Featured Paintings"}
                </h2>
              </div>
              <Link href="/gallery">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPaintings.slice(0, 6).map((painting: { id: string }) => (
                <div key={painting.id} className="animate-fade-in">
                  <PaintingCard painting={painting as Parameters<typeof PaintingCard>[0]["painting"]} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Separator className="max-w-7xl mx-auto px-6 lg:px-12" />

      {/* Collections */}
      {allCollections.length > 0 && (
        <section className="section-padding">
          <div className="container-wide">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="label-sm mb-3">Series</p>
                <h2 className="heading-lg">Collections</h2>
              </div>
              <Link href="/collections">
                <Button variant="outline" size="sm">
                  All Collections
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allCollections.slice(0, 3).map((collection: { id: string }) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection as Parameters<typeof CollectionCard>[0]["collection"]}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Commission CTA */}
      <section className="bg-charcoal text-ivory py-24">
        <div className="container-narrow text-center">
          <p className="label-sm text-gold mb-4">Bespoke Work</p>
          <h2 className="heading-lg text-ivory mb-6">
            {siteSettings?.ctaTitle || "Commission a Painting"}
          </h2>
          <p className="text-ivory/60 max-w-lg mx-auto mb-10 leading-relaxed">
            {siteSettings?.ctaDescription ||
              "Create something uniquely yours. I work closely with each client to bring their vision to life."}
          </p>
          <Link href="/commissions">
            <Button
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-charcoal"
            >
              Inquire Now
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
