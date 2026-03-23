"use client";

import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const onUpload = (result: { info: { secure_url: string } }) => {
    onChange([...value, result.info.secure_url]);
  };

  const onRemove = (url: string) => {
    onChange(value.filter((v) => v !== url));
  };

  return (
    <div className="space-y-4">
      {/* Existing images */}
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-24 h-24 rounded-sm overflow-hidden border border-gold/20 group"
          >
            <Image
              src={url}
              alt="Painting image"
              fill
              className="object-cover"
              sizes="96px"
            />
            <button
              type="button"
              onClick={() => onRemove(url)}
              disabled={disabled}
              className="absolute inset-0 bg-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center text-ivory"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Upload button */}
      <CldUploadWidget
        uploadPreset={
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "dahlia"
        }
        onSuccess={(result) => {
          if (result.info && typeof result.info === "object") {
            onUpload(result as { info: { secure_url: string } });
          }
        }}
      >
        {({ open }) => (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => open()}
            className="gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            Upload Image
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}
