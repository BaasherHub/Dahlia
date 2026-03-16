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

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        className="relative aspect-square overflow-hidden rounded-sm bg-cream cursor-zoom-in group"
        onClick={() => setPreviewOpen(true)}
      >
        <Image
          src={images[activeIndex]}
          alt={`${title} - image ${activeIndex + 1}`}
          fill
          className="object-cover transition-transform duration-600 group-hover:scale-[1.02]"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-3 right-3 p-2 bg-ivory/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-400">
          <ZoomIn className="h-4 w-4 text-charcoal" />
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-ivory/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-400 hover:bg-ivory"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 text-charcoal" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-ivory/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-400 hover:bg-ivory"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 text-charcoal" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-sm overflow-hidden transition-all duration-400 ${
                i === activeIndex
                  ? "ring-2 ring-gold ring-offset-2"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
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
