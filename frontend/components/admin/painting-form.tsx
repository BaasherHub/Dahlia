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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertModal } from "@/components/modals/alert-modal";
import { ImageUpload } from "@/components/admin/image-upload";
import { adminCreatePainting, adminUpdatePainting, adminDeletePainting } from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().default(""),
  medium: z.string().min(1, "Medium is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  year: z.string().optional(),
  category: z.enum(["original", "print", "both"]).default("original"),
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

interface Collection { id: string; name: string; }

interface PaintingFormProps {
  initialData?: {
    id: string; title: string; description: string; medium: string;
    dimensions: string; year?: number; category: string;
    originalPrice?: number; originalAvailable: boolean;
    printPrice?: number; printAvailable: boolean;
    featured: boolean; heroImage: boolean; sold: boolean;
    images: string[]; collectionId?: string;
  } | null;
  collections: Collection[];
}

export function PaintingForm({ initialData, collections }: PaintingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const isEditing = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      medium: initialData?.medium || "",
      dimensions: initialData?.dimensions || "",
      year: initialData?.year?.toString() || "",
      category: (initialData?.category as "original" | "print" | "both") || "original",
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
    if (images.length === 0) { toast.error("Please upload at least one image."); return; }
    setLoading(true);
    try {
      const data = {
        ...values, images,
        year: values.year ? parseInt(values.year) : undefined,
        originalPrice: values.originalPrice ? parseFloat(values.originalPrice) : undefined,
        printPrice: values.printPrice ? parseFloat(values.printPrice) : undefined,
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
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await adminDeletePainting(initialData!.id);
      toast.success("Painting deleted.");
      router.push("/admin/paintings");
      router.refresh();
    } catch { toast.error("Failed to delete painting."); }
    finally { setLoading(false); setDeleteOpen(false); }
  };

  return (
    <>
      <AlertModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={onDelete} loading={loading} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-sm mb-1">Admin</p>
            <h1 className="font-display text-3xl font-semibold text-charcoal">
              {isEditing ? "Edit Painting" : "New Painting"}
            </h1>
          </div>
          {isEditing && (
            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} disabled={loading}>
              <Trash2 className="h-4 w-4 mr-2" />Delete
            </Button>
          )}
        </div>
        <Separator />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
          <div className="space-y-2">
            <Label>Images <span className="text-red-500">*</span></Label>
            <p className="text-xs text-graphite">First image is the main display image.</p>
            <ImageUpload value={images} onChange={setImages} disabled={loading} />
          </div>
          <Separator />
          <div className="space-y-6">
            <h2 className="font-display text-lg font-semibold text-charcoal">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                <Input id="title" disabled={loading} placeholder="e.g. Morning Light on Canvas" {...form.register("title")} />
                {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium">Medium <span className="text-red-500">*</span></Label>
                <Input id="medium" disabled={loading} placeholder="Oil on linen canvas" {...form.register("medium")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions <span className="text-red-500">*</span></Label>
                <Input id="dimensions" disabled={loading} placeholder='24" × 36"' {...form.register("dimensions")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" disabled={loading} placeholder="2024" {...form.register("year")} />
              </div>
              <div className="space-y-2">
                <Label>Collection</Label>
                <Select disabled={loading} onValueChange={(v) => form.setValue("collectionId", v === "none" ? "" : v)} defaultValue={form.getValues("collectionId") || "none"}>
                  <SelectTrigger><SelectValue placeholder="No collection" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No collection</SelectItem>
                    {collections.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" disabled={loading} placeholder="Describe this painting…" rows={5} {...form.register("description")} />
            </div>
          </div>
          <Separator />
          <div className="space-y-6">
            <h2 className="font-display text-lg font-semibold text-charcoal">Pricing & Availability</h2>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select disabled={loading} onValueChange={(v) => form.setValue("category", v as "original" | "print" | "both")} defaultValue={form.getValues("category")}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original only</SelectItem>
                  <SelectItem value="print">Print only</SelectItem>
                  <SelectItem value="both">Original + Prints</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 bg-cream rounded-sm border border-gold/20">
                <h3 className="text-sm font-semibold text-charcoal">Original</h3>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Price (USD)</Label>
                  <Input id="originalPrice" type="number" step="0.01" min="0" disabled={loading} placeholder="1500" {...form.register("originalPrice")} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" disabled={loading} {...form.register("originalAvailable")} className="accent-gold w-4 h-4" />
                  <span className="text-sm text-graphite">Available for purchase</span>
                </label>
              </div>
              <div className="space-y-4 p-4 bg-cream rounded-sm border border-gold/20">
                <h3 className="text-sm font-semibold text-charcoal">Print</h3>
                <div className="space-y-2">
                  <Label htmlFor="printPrice">Price (USD)</Label>
                  <Input id="printPrice" type="number" step="0.01" min="0" disabled={loading} placeholder="250" {...form.register("printPrice")} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" disabled={loading} {...form.register("printAvailable")} className="accent-gold w-4 h-4" />
                  <span className="text-sm text-graphite">Prints available</span>
                </label>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-charcoal">Visibility</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { name: "featured" as const, label: "Featured", description: "Show on homepage featured section" },
                { name: "heroImage" as const, label: "Hero Image", description: "Use as homepage hero (one at a time)" },
                { name: "sold" as const, label: "Sold", description: "Removes from public gallery" },
              ]).map(({ name, label, description }) => (
                <label key={name} className="flex items-start gap-3 p-4 bg-cream rounded-sm border border-gold/20 cursor-pointer hover:border-gold transition-colors">
                  <input type="checkbox" disabled={loading} {...form.register(name)} className="accent-gold w-4 h-4 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">{label}</p>
                    <p className="text-xs text-graphite mt-0.5">{description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Saving…" : isEditing ? "Save Changes" : "Create Painting"}
            </Button>
            <Button type="button" variant="outline" disabled={loading} onClick={() => router.push("/admin/paintings")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
