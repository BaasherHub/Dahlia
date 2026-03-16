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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertModal } from "@/components/modals/alert-modal";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  adminCreatePainting,
  adminUpdatePainting,
  adminDeletePainting,
} from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  medium: z.string().min(1, "Medium is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  year: z.string().optional(),
  category: z.string().default("original"),
  originalPrice: z.string().optional(),
  originalAvailable: z.boolean().default(true),
  printPrice: z.string().optional(),
  printAvailable: z.boolean().default(false),
  featured: z.boolean().default(false),
  heroImage: z.boolean().default(false),
  sold: z.boolean().default(false),
  collectionId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Collection {
  id: string;
  name: string;
}

interface PaintingFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    medium: string;
    dimensions: string;
    year?: number;
    category: string;
    originalPrice?: number;
    originalAvailable: boolean;
    printPrice?: number;
    printAvailable: boolean;
    featured: boolean;
    heroImage: boolean;
    sold: boolean;
    images: string[];
    collectionId?: string;
  } | null;
  collections: Collection[];
}

export function PaintingForm({ initialData, collections }: PaintingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const isEditing = !!initialData;
  const title = isEditing ? "Edit Painting" : "New Painting";
  const action = isEditing ? "Save Changes" : "Create Painting";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      medium: initialData?.medium || "",
      dimensions: initialData?.dimensions || "",
      year: initialData?.year?.toString() || "",
      category: initialData?.category || "original",
      originalPrice: initialData?.originalPrice?.toString() || "",
      originalAvailable: initialData?.originalAvailable ?? true,
      printPrice: initialData?.printPrice?.toString() || "",
      printAvailable: initialData?.printAvailable ?? false,
      featured: initialData?.featured ?? false,
      heroImage: initialData?.heroImage ?? false,
      sold: initialData?.sold ?? false,
      collectionId: initialData?.collectionId || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        images,
        year: values.year ? parseInt(values.year) : undefined,
        originalPrice: values.originalPrice
          ? parseFloat(values.originalPrice)
          : undefined,
        printPrice: values.printPrice
          ? parseFloat(values.printPrice)
          : undefined,
        collectionId: values.collectionId || undefined,
      };

      if (isEditing) {
        await adminUpdatePainting(initialData.id, data);
        toast.success("Painting updated.");
      } else {
        await adminCreatePainting(data);
        toast.success("Painting created.");
      }
      router.push("/admin/paintings");
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
      await adminDeletePainting(initialData!.id);
      toast.success("Painting deleted.");
      router.push("/admin/paintings");
      router.refresh();
    } catch {
      toast.error("Failed to delete painting.");
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
            {title}
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
          {/* Images */}
          <div className="space-y-2">
            <Label>Images</Label>
            <ImageUpload
              value={images}
              onChange={setImages}
              disabled={loading}
            />
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                disabled={loading}
                placeholder="Untitled"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="medium">Medium</Label>
              <Input
                id="medium"
                disabled={loading}
                placeholder="Oil on canvas"
                {...form.register("medium")}
              />
              {form.formState.errors.medium && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.medium.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                disabled={loading}
                placeholder='24" × 36"'
                {...form.register("dimensions")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                disabled={loading}
                placeholder="2024"
                {...form.register("year")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              disabled={loading}
              placeholder="About this painting…"
              rows={4}
              {...form.register("description")}
            />
          </div>

          {/* Category & Collection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                disabled={loading}
                onValueChange={(v) =>
                  form.setValue("category", v)
                }
                defaultValue={form.getValues("category")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original</SelectItem>
                  <SelectItem value="print">Print</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Collection</Label>
              <Select
                disabled={loading}
                onValueChange={(v) =>
                  form.setValue("collectionId", v === "none" ? "" : v)
                }
                defaultValue={form.getValues("collectionId") || "none"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {collections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price ($)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                disabled={loading}
                placeholder="1500"
                {...form.register("originalPrice")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="printPrice">Print Price ($)</Label>
              <Input
                id="printPrice"
                type="number"
                step="0.01"
                disabled={loading}
                placeholder="250"
                {...form.register("printPrice")}
              />
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-6">
            {(
              [
                { name: "originalAvailable", label: "Original Available" },
                { name: "printAvailable", label: "Prints Available" },
                { name: "featured", label: "Featured" },
                { name: "heroImage", label: "Hero Image" },
                { name: "sold", label: "Sold" },
              ] as const
            ).map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  disabled={loading}
                  {...form.register(name)}
                  className="accent-gold w-4 h-4"
                />
                <span className="text-sm text-graphite">{label}</span>
              </label>
            ))}
          </div>

          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Saving…" : action}
          </Button>
        </form>
      </div>
    </>
  );
}
