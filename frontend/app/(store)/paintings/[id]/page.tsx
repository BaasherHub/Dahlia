import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { fetchPainting } from "@/lib/api";
import { PaintingGallery } from "@/components/store/painting-gallery";
import { PaintingInfo } from "@/components/store/painting-info";
import { PaintingJsonLd } from "@/components/seo/painting-json-ld";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const painting = await fetchPainting(id);
    return buildPageMetadata({
      title: painting.title,
      description: painting.description,
      image: painting.images?.[0],
      path: `/paintings/${id}`,
      type: "article",
    });
  } catch {
    return { title: "Painting" };
  }
}

export default async function PaintingDetailPage({ params }: Props) {
  const { id } = await params;
  let painting;
  try {
    painting = await fetchPainting(id);
  } catch {
    notFound();
  }

  return (
    <>
      <PaintingJsonLd painting={painting} />
    <div className="section-padding container-wide">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-graphite mb-8" aria-label="Breadcrumb">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1 hover:text-charcoal transition-colors"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Gallery
        </Link>
        {painting.collection && (
          <>
            <span aria-hidden>/</span>
            <Link
              href={`/collections/${painting.collection.id}`}
              className="hover:text-charcoal transition-colors"
            >
              {painting.collection.name}
            </Link>
          </>
        )}
        <span aria-hidden>/</span>
        <span className="text-charcoal truncate max-w-[12rem]">{painting.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <PaintingGallery images={painting.images || []} title={painting.title} />
        <PaintingInfo painting={painting} />
      </div>
    </div>
    </>
  );
}
