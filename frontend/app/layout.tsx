import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/providers/toast-provider";
import { fetchHeroPainting } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import { ARTIST_NAME, DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  let ogImage: string | undefined;
  try {
    const hero = await fetchHeroPainting();
    ogImage = hero?.images?.[0];
  } catch {
    /* use defaults */
  }

  const og = buildPageMetadata({
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    image: ogImage,
    path: "/",
  });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} | ${ARTIST_NAME}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    authors: [{ name: ARTIST_NAME }],
    creator: ARTIST_NAME,
    alternates: og.alternates,
    openGraph: og.openGraph,
    twitter: og.twitter,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ivory text-charcoal antialiased">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
