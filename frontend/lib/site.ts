/** Canonical public site URL (no trailing slash). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.dahliabaasher.com";

export const SITE_NAME = "Dahlia Fine Art";
export const ARTIST_NAME = "Dahlia Baasher";

export const DEFAULT_DESCRIPTION =
  "Original oil paintings and fine art by Dahlia Baasher. Explore the gallery, browse collections, and commission a custom piece.";
