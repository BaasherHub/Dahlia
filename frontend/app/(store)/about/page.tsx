import type { Metadata } from "next";
import Image from "next/image";
import { fetchSiteSettings } from "@/lib/api";

export const metadata: Metadata = {
  title: "About",
  description: "About the artist Dahlia Baasher.",
};

export default async function AboutPage() {
  const settings = await fetchSiteSettings();

  const bioParagraphs = [settings?.aboutBio1, settings?.aboutBio2, settings?.aboutBio3].filter(Boolean);
  const statementParagraphs = [settings?.aboutStatement1, settings?.aboutStatement2, settings?.aboutStatement3].filter(Boolean);

  const exhibitions: Array<{ title: string; description?: string; date?: string; location?: string; imageUrl?: string }> =
    Array.isArray(settings?.exhibitions) ? settings.exhibitions : [];
  const publications: Array<{ title: string; description?: string; date?: string; location?: string; imageUrl?: string }> =
    Array.isArray(settings?.publications) ? settings.publications : [];

  return (
    <div className="section-padding">
      <div className="container-narrow">
        <div className="max-w-3xl">
          <p className="label-sm mb-4">The Artist</p>
          <h1 className="heading-xl mb-10">About Dahlia</h1>

          {settings?.aboutArtistImage && (
            <div className="relative aspect-[4/3] max-w-md mb-10 rounded-sm overflow-hidden">
              <Image
                src={settings.aboutArtistImage}
                alt="Dahlia Baasher"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 28rem"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none space-y-6 text-graphite leading-relaxed">
            {bioParagraphs.length > 0 ? (
              bioParagraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <>
                <p>Dahlia Baasher is a contemporary painter whose work explores the intersection of light, memory, and the quiet moments that define our lives. Working primarily in oils and acrylics, she creates pieces that invite prolonged contemplation — canvases that reveal new details the longer you look.</p>
                <p>Her practice draws on a rich visual vocabulary built through years of observation and study. Each painting begins with an intimate relationship with its subject: hours of sketching, color studies, and careful attention before a single mark is made on the final canvas.</p>
                <p>Dahlia&apos;s work has been collected by private collectors across North America, Europe, and the Middle East. She accepts a limited number of commissions each year, working closely with each client to ensure the finished piece feels both personal and timeless.</p>
                <p>She currently works from her studio, where natural light floods the space from morning to evening — a constant presence that informs every canvas.</p>
              </>
            )}
          </div>

          {statementParagraphs.length > 0 && (
            <div className="mt-12 pt-12 border-t border-gold/20">
              <h2 className="heading-lg mb-6">Artist Statement</h2>
              <div className="prose prose-lg max-w-none space-y-6 text-graphite leading-relaxed">
                {statementParagraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          )}
        </div>

        {exhibitions.length > 0 && (
          <div className="mt-16 pt-16 border-t border-gold/20">
            <h2 className="heading-lg mb-8">Exhibitions</h2>
            <ul className="space-y-8">
              {exhibitions.map((ex, i) => (
                <li key={i} className="flex flex-col md:flex-row gap-4">
                  {ex.imageUrl && (
                    <div className="relative w-full md:w-48 h-32 shrink-0 rounded-sm overflow-hidden">
                      <Image src={ex.imageUrl} alt={ex.title} fill className="object-cover" sizes="12rem" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-charcoal">{ex.title}</h3>
                    {(ex.date || ex.location) && (
                      <p className="text-sm text-graphite mt-1">
                        {[ex.date, ex.location].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {ex.description && (
                      <p className="text-graphite mt-2">{ex.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {publications.length > 0 && (
          <div className="mt-16 pt-16 border-t border-gold/20">
            <h2 className="heading-lg mb-8">Publications</h2>
            <ul className="space-y-6">
              {publications.map((pub, i) => (
                <li key={i} className="flex flex-col md:flex-row gap-4">
                  {pub.imageUrl && (
                    <div className="relative w-full md:w-48 h-32 shrink-0 rounded-sm overflow-hidden">
                      <Image src={pub.imageUrl} alt={pub.title} fill className="object-cover" sizes="12rem" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-charcoal">{pub.title}</h3>
                    {(pub.date || pub.location) && (
                      <p className="text-sm text-graphite mt-1">
                        {[pub.date, pub.location].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {pub.description && (
                      <p className="text-graphite mt-2">{pub.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
