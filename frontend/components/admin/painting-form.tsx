"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Trash2, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertModal } from "@/components/modals/alert-modal";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  adminCreatePainting,
  adminUpdatePainting,
  adminDeletePainting,
  adminDuplicatePainting,
} from "@/lib/api";

const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().default(""),
    medium: z.string().min(1, "Medium is required"),
    dimensions: z.string().min(1, "Dimensions are required"),
    year: z.string().optional(),
    originalPrice: z.string().optional(),
    originalAvailable: z.boolean().default(true),
    featured: z.boolean().default(false),
    heroImage: z.boolean().default(false),
    sold: z.boolean().default(false),
    collectionId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.sold) return;
    if (data.originalAvailable) {
      const price = parseFloat(data.originalPrice || "");
      if (!data.originalPrice?.trim() || Number.isNaN(price) || price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a price greater than 0 when the work is available for purchase",
          path: ["originalPrice"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;
type TabId = "basic" | "pricing" | "visibility";

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
    originalPrice?: number;
    originalAvailable: boolean;
    featured: boolean;
    heroImage: boolean;
    sold: boolean;
    images: string[];
    collectionId?: string;
  } | null;
  collections: Collection[];
}

const FIELD_TAB: Partial<Record<keyof FormValues, TabId>> = {
  title: "basic",
  description: "basic",
  medium: "basic",
  dimensions: "basic",
  year: "basic",
  originalPrice: "pricing",
  originalAvailable: "pricing",
  collectionId: "visibility",
  featured: "visibility",
  heroImage: "visibility",
  sold: "visibility",
};

function tabForErrors(errors: Record<string, unknown>): TabId {
  const keys = Object.keys(errors) as (keyof FormValues)[];
  for (const key of keys) {
    const tab = FIELD_TAB[key];
    if (tab) return tab;
  }
  return "basic";
}

export function PaintingForm({ initialData, collections }: PaintingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const isEditing = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      medium: initialData?.medium || "",
      dimensions: initialData?.dimensions || "",
      year: initialData?.year?.toString() || "",
      originalPrice: initialData?.originalPrice?.toString() || "",
      originalAvailable: initialData?.originalAvailable ?? true,
      featured: initialData?.featured ?? false,
      heroImage: initialData?.heroImage ?? false,
      sold: initialData?.sold ?? false,
      collectionId: initialData?.collectionId || "",
    },
  });

  const sold = form.watch("sold");
  const isDirty = form.formState.isDirty;

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !loading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty, loading]);

  const onDuplicate = async () => {
    if (!initialData) return;
    setLoading(true);
    try {
      const copy = await adminDuplicatePainting(initialData.id);
      toast.success("Duplicate created.");
      router.push(`/admin/paintings/${copy.id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Duplicate failed.");
    } finally {
      setLoading(false);
    }
  };

  const onSoldChange = (checked: boolean) => {
    form.setValue("sold", checked);
    if (checked) {
      form.setValue("originalAvailable", false);
      form.setValue("featured", false);
      form.setValue("heroImage", false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      setActiveTab("basic");
      return;
    }

    setLoading(true);
    try {
      const soldFlag = values.sold;
      const available = soldFlag ? false : values.originalAvailable;

      const data = {
        ...values,
        images,
        sold: soldFlag,
        originalAvailable: available,
        printAvailable: false,
        printPrice: undefined,
        category: "original" as const,
        year: values.year ? parseInt(values.year, 10) : undefined,
        originalPrice:
          available && values.originalPrice
            ? parseFloat(values.originalPrice)
            : soldFlag
              ? values.originalPrice
                ? parseFloat(values.originalPrice)
                : undefined
              : values.originalPrice
                ? parseFloat(values.originalPrice)
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = () => {
    const tab = tabForErrors(form.formState.errors as Record<string, unknown>);
    setActiveTab(tab);
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      await adminDeletePainting(initialData!.id);
      toast.success("Painting deleted.");
      router.push("/admin/paintings");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete painting.");
    } finally {
      setLoading(false);
      setDeleteOpen(false);
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "basic", label: "Basic Info" },
    { id: "pricing", label: "Pricing" },
    { id: "visibility", label: "Visibility" },
  ];

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        title="Delete this painting?"
        description="This removes the artwork from your catalog. Orders that included this piece may show incomplete line items."
      />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label-sm mb-1">Admin</p>
            <h1 className="font-display text-3xl font-semibold text-charcoal">
              {isEditing ? "Edit Painting" : "New Painting"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isEditing && (
              <>
                <Link href={`/paintings/${initialData.id}`} target="_blank" rel="noopener noreferrer">
                  <Button type="button" variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View on site
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={loading}
                  onClick={onDuplicate}
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteOpen(true)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
        {isDirty && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-sm px-4 py-2">
            You have unsaved changes.
          </p>
        )}
        <Separator />

        <div className="flex gap-2 border-b border-charcoal/10 pb-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-gold/20 text-charcoal border-b-2 border-gold"
                  : "text-graphite hover:text-charcoal hover:bg-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-8 max-w-3xl"
        >
          <div className={activeTab !== "basic" ? "hidden" : "space-y-8"}>
            <div className="space-y-2">
              <Label>
                Images <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-graphite">
                First image is the main display. Use high-resolution files; storefront cards crop to a square.
              </p>
              <ImageUpload value={images} onChange={setImages} disabled={loading} />
            </div>
            <Separator />
            <div className="space-y-6">
              <h2 className="font-display text-lg font-semibold text-charcoal">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    disabled={loading}
                    placeholder="e.g. Morning Light on Canvas"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medium">
                    Medium <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="medium"
                    disabled={loading}
                    placeholder="Oil on linen canvas"
                    {...form.register("medium")}
                  />
                  {form.formState.errors.medium && (
                    <p className="text-xs text-red-500">{form.formState.errors.medium.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">
                    Dimensions <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dimensions"
                    disabled={loading}
                    placeholder='24" × 36" (61 × 91 cm)'
                    {...form.register("dimensions")}
                  />
                  {form.formState.errors.dimensions && (
                    <p className="text-xs text-red-500">{form.formState.errors.dimensions.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min={1900}
                    max={new Date().getFullYear()}
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
                  placeholder="Describe this painting…"
                  rows={5}
                  {...form.register("description")}
                />
              </div>
            </div>
          </div>

          <div className={activeTab !== "pricing" ? "hidden" : "space-y-8"}>
            <div className="space-y-6">
              <h2 className="font-display text-lg font-semibold text-charcoal">Pricing & Availability</h2>
              {sold && (
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-sm px-4 py-3">
                  This work is marked sold. It is hidden from the public gallery and cannot be purchased.
                </p>
              )}
              <div className="space-y-4 p-4 bg-cream rounded-sm border border-gold/20 max-w-md">
                <h3 className="text-sm font-semibold text-charcoal">Original</h3>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Price (USD)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    disabled={loading || sold}
                    placeholder="1500"
                    {...form.register("originalPrice")}
                  />
                  {form.formState.errors.originalPrice && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.originalPrice.message}
                    </p>
                  )}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={loading || sold}
                    checked={form.watch("originalAvailable")}
                    onChange={(e) => form.setValue("originalAvailable", e.target.checked)}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="text-sm text-graphite">Live in gallery (available to buy)</span>
                </label>
              </div>
            </div>
          </div>

          <div className={activeTab !== "visibility" ? "hidden" : "space-y-8"}>
            <div className="space-y-6">
              <h2 className="font-display text-lg font-semibold text-charcoal">Collection</h2>
              <div className="space-y-2">
                <Label>Collection</Label>
                <Select
                  disabled={loading}
                  onValueChange={(v) => form.setValue("collectionId", v === "none" ? "" : v)}
                  value={form.watch("collectionId") || "none"}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="No collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No collection</SelectItem>
                    {collections.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-charcoal">Visibility</h2>
              <label className="flex items-start gap-3 p-4 bg-cream rounded-sm border border-gold/20 cursor-pointer hover:border-gold transition-colors max-w-lg">
                <input
                  type="checkbox"
                  disabled={loading}
                  checked={sold}
                  onChange={(e) => onSoldChange(e.target.checked)}
                  className="accent-gold w-4 h-4 mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium text-charcoal">Sold</p>
                  <p className="text-xs text-graphite mt-0.5">
                    Removes from the public gallery and disables purchase. Also clears featured and hero.
                  </p>
                </div>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(
                  [
                    {
                      name: "featured" as const,
                      label: "Featured",
                      description: "Show on homepage featured section",
                    },
                    {
                      name: "heroImage" as const,
                      label: "Hero Image",
                      description: "Homepage hero (only one active at a time)",
                    },
                  ] as const
                ).map(({ name, label, description }) => (
                  <label
                    key={name}
                    className={`flex items-start gap-3 p-4 bg-cream rounded-sm border border-gold/20 transition-colors ${
                      sold ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gold"
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={loading || sold}
                      {...form.register(name)}
                      className="accent-gold w-4 h-4 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-charcoal">{label}</p>
                      <p className="text-xs text-graphite mt-0.5">{description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-charcoal/10">
            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Saving…" : isEditing ? "Save Changes" : "Create Painting"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => router.push("/admin/paintings")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
