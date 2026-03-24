"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onRemove = (url: string) => {
    onChange(value.filter((v) => v !== url));
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "dahlia";

    if (!cloudName) {
      toast.error(
        "Cloudinary not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to Railway env. (Note: VITE_ prefix does not work with Next.js — use NEXT_PUBLIC_ instead.)"
      );
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        let fileToUpload = file;
        if (file.size > 2 * 1024 * 1024) {
          try {
            fileToUpload = await imageCompression(file, {
              maxSizeMB: 5,
              maxWidthOrHeight: 2400,
              useWebWorker: true,
              fileType: file.type,
            });
          } catch {
            toast.error("Could not compress image. Try a smaller file.");
            continue;
          }
        }
        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", "dahlia-paintings");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error?.message || "Upload failed");
        }

        const data = await res.json();
        newUrls.push(data.secure_url);
      }

      onChange([...value, ...newUrls]);
      toast.success(newUrls.length === 1 ? "Image uploaded." : `${newUrls.length} images uploaded.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((url, idx) => (
            <div key={url} className="relative w-28 h-28 rounded-sm overflow-hidden border border-gold/20 group">
              <Image src={url} alt={`Painting image ${idx + 1}`} fill className="object-cover" sizes="112px" />
              {idx === 0 && (
                <div className="absolute top-1 left-1 bg-gold text-charcoal text-[10px] font-semibold px-1.5 py-0.5 rounded-sm">
                  Main
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemove(url)}
                disabled={disabled || uploading}
                className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-ivory"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <div className="border-2 border-dashed border-gold/30 rounded-sm p-8 text-center bg-cream/50">
          <ImagePlus className="h-8 w-8 text-gold/50 mx-auto mb-2" />
          <p className="text-sm text-graphite">No images yet. Upload at least one.</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-charcoal/20 text-sm font-medium text-charcoal bg-ivory hover:bg-cream transition-colors cursor-pointer ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
          <ImagePlus className="h-4 w-4" />
          {uploading ? "Uploading…" : "Upload Image(s)"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onFileChange}
            disabled={disabled || uploading}
            className="hidden"
          />
        </label>
        {value.length > 0 && (
          <p className="text-xs text-graphite">
            {value.length} image{value.length !== 1 ? "s" : ""}. First image is the main display image.
          </p>
        )}
      </div>
    </div>
  );
}
