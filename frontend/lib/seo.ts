import type { Metadata } from "next";
import { ARTIST_NAME, DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

type OgEntity = {
  title: string;
  description?: string | null;
  image?: string | null;
  path?: string;
};

function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export function buildPageMetadata({
  title,
  description,
  image,
  path = "",
  type = "website",
}: OgEntity & { type?: "website" | "article" }): Metadata {
  const desc = (description || DEFAULT_DESCRIPTION).slice(0, 160);
  const url = absoluteUrl(path);
  const images = image
    ? [{ url: image, width: 1200, height: 630, alt: title }]
    : undefined;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description: desc,
      images,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${title} | ${SITE_NAME}`,
      description: desc,
      images: image ? [image] : undefined,
    },
  };
}

export function paintingJsonLd(painting: {
  id: string;
  title: string;
  description?: string | null;
  images?: string[];
  originalPrice?: number | null;
  medium?: string;
  dimensions?: string;
  sold?: boolean;
  originalAvailable?: boolean;
}) {
  const image = painting.images?.[0];
  const inStock = !painting.sold && painting.originalAvailable;
  const price = painting.originalPrice;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: painting.title,
    description: painting.description || `${painting.title} by ${ARTIST_NAME}`,
    image: image ? [image] : undefined,
    brand: { "@type": "Brand", name: ARTIST_NAME },
    category: "Original Artwork",
    material: painting.medium,
    size: painting.dimensions,
    url: absoluteUrl(`/paintings/${painting.id}`),
    offers:
      price != null && inStock
        ? {
            "@type": "Offer",
            priceCurrency: "USD",
            price: price.toFixed(2),
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/paintings/${painting.id}`),
          }
        : {
            "@type": "Offer",
            availability: "https://schema.org/SoldOut",
            url: absoluteUrl(`/paintings/${painting.id}`),
          },
  };
}
