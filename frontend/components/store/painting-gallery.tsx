"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { PreviewModal } from "@/components/modals/preview-modal";

interface PaintingGalleryProps {
  images: string[];
  title: string;
}

export function PaintingGallery({ images, title }: PaintingGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!images.length) return null;

  const prev = () =>
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  const controlBtn =
    "absolute top-1/2 -translate-y-1/2 p-2.5 bg-ivory/90 rounded-sm shadow-sm text-charcoal hover:bg-ivory transition-colors md:opacity-0 md:group-hover:opacity-100 opacity-100";

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-[4/5] max-h-[min(80vh,720px)] overflow-hidden rounded-sm bg-cream cursor-zoom-in group"
        onClick={() => setPreviewOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setPreviewOpen(true);
          }
        }}
        aria-label={`View full size: ${title}`}
      >
        <Image
          src={images[activeIndex]}
          alt={`${title} — image ${activeIndex + 1} of ${images.length}`}
          fill
          className="object-contain transition-transform duration-600 md:group-hover:scale-[1.01]"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-3 right-3 p-2 bg-ivory/90 rounded-sm md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity">
          <ZoomIn className="h-4 w-4 text-charcoal" aria-hidden />
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className={`${controlBtn} left-3`}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className={`${controlBtn} right-3`}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <p className="absolute bottom-3 left-3 text-xs bg-ivory/90 text-charcoal px-2 py-1 rounded-sm">
              {activeIndex + 1} / {images.length}
            </p>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-sm overflow-hidden bg-cream transition-all duration-400 ${
                i === activeIndex
                  ? "ring-2 ring-gold ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === activeIndex}
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      <PreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        imageUrl={images[activeIndex]}
        title={title}
      />
    </div>
  );
}
