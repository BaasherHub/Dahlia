"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  adminCreateCollection,
  adminUpdateCollection,
  adminDeleteCollection,
} from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  order: z.string().default("0"),
});

type FormValues = z.infer<typeof formSchema>;

interface CollectionFormProps {
  initialData?: {
    id: string;
    name: string;
    description?: string;
    coverImage?: string;
    coverImages?: string[];
    order: number;
  } | null;
}

export function CollectionForm({ initialData }: CollectionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [coverImages, setCoverImages] = useState<string[]>(() => {
    if (initialData?.coverImages?.length) return [...initialData.coverImages];
    if (initialData?.coverImage) return [initialData.coverImage];
    return [];
  });

  const isEditing = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      order: initialData?.order?.toString() || "0",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        coverImages: coverImages.length > 0 ? coverImages : [],
        coverImage: coverImages[0] || undefined,
        order: parseInt(values.order),
      };

      if (isEditing) {
        await adminUpdateCollection(initialData.id, data);
        toast.success("Collection updated.");
      } else {
        await adminCreateCollection(data);
        toast.success("Collection created.");
      }
      router.push("/admin/collections");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await adminDeleteCollection(initialData!.id);
      toast.success("Collection deleted.");
      router.push("/admin/collections");
      router.refresh();
    } catch {
      toast.error("Failed to delete collection.");
    } finally {
      setLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-charcoal">
            {isEditing ? "Edit Collection" : "New Collection"}
          </h1>
          {isEditing && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>

        <Separator />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Cover image */}
          <div className="space-y-2">
            <Label>Cover images</Label>
            <p className="text-xs text-graphite">Add one or more images; the first is the main thumbnail.</p>
            <ImageUpload
              value={coverImages}
              onChange={(urls) => setCoverImages(urls)}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                disabled={loading}
                placeholder="Collection name"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                disabled={loading}
                placeholder="0"
                {...form.register("order")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              disabled={loading}
              placeholder="About this collection…"
              rows={3}
              {...form.register("description")}
            />
          </div>

          <Button type="submit" disabled={loading} size="lg">
            {loading
              ? "Saving…"
              : isEditing
              ? "Save Changes"
              : "Create Collection"}
          </Button>
        </form>
      </div>
    </>
  );
}
