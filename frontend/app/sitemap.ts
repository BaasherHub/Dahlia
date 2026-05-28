import type { MetadataRoute } from "next";
import { getApiBaseUrl } from "@/lib/api-base";
import { SITE_URL } from "@/lib/site";

type SitemapEntry = { id: string; updatedAt?: string };

async function fetchSitemapData(): Promise<{
  paintings: SitemapEntry[];
  collections: SitemapEntry[];
}> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/paintings/sitemap`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { paintings: [], collections: [] };
    return res.json();
  } catch {
    return { paintings: [], collections: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { paintings, collections } = await fetchSitemapData();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/commissions`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const paintingRoutes: MetadataRoute.Sitemap = paintings.map((p) => ({
    url: `${SITE_URL}/paintings/${p.id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE_URL}/collections/${c.id}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...collectionRoutes, ...paintingRoutes];
}
