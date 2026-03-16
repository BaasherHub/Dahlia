import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPainting } from "@/lib/api";
import { PaintingGallery } from "@/components/store/painting-gallery";
import { PaintingInfo } from "@/components/store/painting-info";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const painting = await fetchPainting(params.id);
    return {
      title: painting.title,
      description: painting.description?.slice(0, 160),
    };
  } catch {
    return { title: "Painting" };
  }
}

export default async function PaintingDetailPage({ params }: Props) {
  let painting;
  try {
    painting = await fetchPainting(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="section-padding container-wide">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <PaintingGallery images={painting.images || []} title={painting.title} />
        <PaintingInfo painting={painting} />
      </div>
    </div>
  );
}
