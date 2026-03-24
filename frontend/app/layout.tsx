import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/providers/toast-provider";

export const metadata: Metadata = {
  title: {
    default: "Dahlia | Fine Art",
    template: "%s | Dahlia",
  },
  description:
    "Original paintings and fine art prints by Dahlia Baasher. Explore the gallery, browse collections, and commission your own piece.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.dahliabaasher.com",
    siteName: "Dahlia Fine Art",
  },
};

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
