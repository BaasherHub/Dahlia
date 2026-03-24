"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { fetchSiteSettings, adminUpdateSiteSettings } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";

type ExhibitionEntry = { title: string; description?: string; date?: string; location?: string; imageUrl?: string };
type PublicationEntry = { title: string; description?: string; date?: string; location?: string; imageUrl?: string };

const schema = z.object({
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  featuredWorksTitle: z.string().optional(),
  printsTitle: z.string().optional(),
  ctaTitle: z.string().optional(),
  ctaDescription: z.string().optional(),
  newsletterTitle: z.string().optional(),
  newsletterSubtitle: z.string().optional(),
  aboutHeroSubtitle: z.string().optional(),
  aboutBio1: z.string().optional(),
  aboutBio2: z.string().optional(),
  aboutBio3: z.string().optional(),
  aboutStatement1: z.string().optional(),
  aboutStatement2: z.string().optional(),
  aboutStatement3: z.string().optional(),
  aboutArtistImage: z.string().optional(),
  galleryLabel: z.string().optional(),
  galleryTitle: z.string().optional(),
  gallerySubtitle: z.string().optional(),
  footerTagline: z.string().optional(),
  navLogoSubtext: z.string().optional(),
  commissionsSubtitle: z.string().optional(),
  commissionFormHelpText: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const SECTIONS = [
  {
    title: "Homepage",
    fields: [
      { name: "heroTitle" as const, label: "Hero Title", placeholder: "Dahlia Baasher" },
      { name: "heroSubtitle" as const, label: "Hero Subtitle", placeholder: "Contemporary Oil Paintings" },
      { name: "heroDescription" as const, label: "Hero Description", multiline: true, rows: 3 },
      { name: "featuredWorksTitle" as const, label: "Featured Works Title" },
      { name: "printsTitle" as const, label: "Prints Section Title" },
      { name: "ctaTitle" as const, label: "Commission CTA Title" },
      { name: "ctaDescription" as const, label: "Commission CTA Description", multiline: true, rows: 3 },
      { name: "newsletterTitle" as const, label: "Newsletter Title" },
      { name: "newsletterSubtitle" as const, label: "Newsletter Subtitle", multiline: true, rows: 2 },
    ],
  },
  {
    title: "About Page",
    fields: [
      { name: "aboutHeroSubtitle" as const, label: "About Page Subtitle" },
      { name: "aboutBio1" as const, label: "Bio Paragraph 1", multiline: true, rows: 4 },
      { name: "aboutBio2" as const, label: "Bio Paragraph 2", multiline: true, rows: 4 },
      { name: "aboutBio3" as const, label: "Bio Paragraph 3", multiline: true, rows: 4 },
      { name: "aboutStatement1" as const, label: "Artist Statement 1", multiline: true, rows: 4 },
      { name: "aboutStatement2" as const, label: "Artist Statement 2", multiline: true, rows: 4 },
      { name: "aboutStatement3" as const, label: "Artist Statement 3", multiline: true, rows: 4 },
    ],
  },
  {
    title: "Gallery Page",
    fields: [
      { name: "galleryLabel" as const, label: "Gallery Label", placeholder: "Portfolio" },
      { name: "galleryTitle" as const, label: "Gallery Title", placeholder: "Artworks" },
      { name: "gallerySubtitle" as const, label: "Gallery Subtitle" },
    ],
  },
  {
    title: "Commissions Page",
    fields: [
      { name: "commissionsSubtitle" as const, label: "Commissions Subtitle", multiline: true, rows: 3 },
      { name: "commissionFormHelpText" as const, label: "Form Help Text" },
    ],
  },
  {
    title: "Navigation & Footer",
    fields: [
      { name: "navLogoSubtext" as const, label: "Logo Subtext", placeholder: "Studio" },
      { name: "footerTagline" as const, label: "Footer Tagline" },
    ],
  },
];

const emptyExhibition: ExhibitionEntry = { title: "", description: "", date: "", location: "", imageUrl: "" };
const emptyPublication: PublicationEntry = { title: "", description: "", date: "", location: "", imageUrl: "" };

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [exhibitions, setExhibitions] = useState<ExhibitionEntry[]>([]);
  const [publications, setPublications] = useState<PublicationEntry[]>([]);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const loadSettings = useCallback(async () => {
    try {
      const s = await fetchSiteSettings();
      if (s) {
        form.reset({
          heroTitle: s.heroTitle || "",
          heroSubtitle: s.heroSubtitle || "",
          heroDescription: s.heroDescription || "",
          featuredWorksTitle: s.featuredWorksTitle || "",
          printsTitle: s.printsTitle || "",
          ctaTitle: s.ctaTitle || "",
          ctaDescription: s.ctaDescription || "",
          newsletterTitle: s.newsletterTitle || "",
          newsletterSubtitle: s.newsletterSubtitle || "",
          aboutHeroSubtitle: s.aboutHeroSubtitle || "",
          aboutArtistImage: s.aboutArtistImage || "",
          aboutBio1: s.aboutBio1 || "",
          aboutBio2: s.aboutBio2 || "",
          aboutBio3: s.aboutBio3 || "",
          aboutStatement1: s.aboutStatement1 || "",
          aboutStatement2: s.aboutStatement2 || "",
          aboutStatement3: s.aboutStatement3 || "",
          galleryLabel: s.galleryLabel || "",
          galleryTitle: s.galleryTitle || "",
          gallerySubtitle: s.gallerySubtitle || "",
          footerTagline: s.footerTagline || "",
          navLogoSubtext: s.navLogoSubtext || "",
          commissionsSubtitle: s.commissionsSubtitle || "",
          commissionFormHelpText: s.commissionFormHelpText || "",
        });
        setExhibitions(Array.isArray(s.exhibitions) && s.exhibitions.length > 0 ? s.exhibitions : []);
        setPublications(Array.isArray(s.publications) && s.publications.length > 0 ? s.publications : []);
      }
    } catch {
      toast.error("Could not load settings.");
    } finally {
      setFetching(false);
    }
  }, [form]);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const cleanExhibitions = exhibitions.filter((e) => e.title?.trim());
      const cleanPublications = publications.filter((p) => p.title?.trim());
      const payload = { ...values, exhibitions: cleanExhibitions, publications: cleanPublications };
      await adminUpdateSiteSettings(payload);
      toast.success("Settings saved.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save settings.";
      toast.error(msg);
      console.error("Site settings save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateExhibition = (i: number, field: keyof ExhibitionEntry, value: string) => {
    setExhibitions((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };
  const addExhibition = () => setExhibitions((prev) => [...prev, { ...emptyExhibition }]);
  const removeExhibition = (i: number) => setExhibitions((prev) => prev.filter((_, idx) => idx !== i));

  const updatePublication = (i: number, field: keyof PublicationEntry, value: string) => {
    setPublications((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };
  const addPublication = () => setPublications((prev) => [...prev, { ...emptyPublication }]);
  const removePublication = (i: number) => setPublications((prev) => prev.filter((_, idx) => idx !== i));

  if (fetching) return <p className="text-graphite py-8">Loading settings…</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="label-sm mb-1">Configure</p>
        <h1 className="font-display text-3xl font-semibold text-charcoal">Site Settings</h1>
        <p className="text-sm text-graphite mt-1">Edit all website text. Changes go live immediately after saving.</p>
      </div>
      <Separator />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 max-w-2xl">
        {SECTIONS.map((section) => (
          <div key={section.title} className="space-y-6">
            <h2 className="font-display text-xl font-semibold text-charcoal border-b border-gold/20 pb-3">{section.title}</h2>
            {section.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {"multiline" in field && field.multiline ? (
                  <Textarea
                    id={field.name}
                    disabled={loading}
                    placeholder={"placeholder" in field ? field.placeholder : undefined}
                    rows={field.rows || 3}
                    {...form.register(field.name)}
                  />
                ) : (
                  <Input
                    id={field.name}
                    disabled={loading}
                    placeholder={"placeholder" in field ? field.placeholder : undefined}
                    {...form.register(field.name)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="space-y-6">
          <h2 className="font-display text-xl font-semibold text-charcoal border-b border-gold/20 pb-3">Exhibitions</h2>
          <p className="text-sm text-graphite">List exhibitions to appear on the About page.</p>
          {exhibitions.map((ex, i) => (
            <div key={i} className="border border-gold/20 rounded-sm p-4 space-y-3 bg-cream/30">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-charcoal">Exhibition {i + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeExhibition(i)} className="text-graphite hover:text-charcoal">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input value={ex.title} onChange={(e) => updateExhibition(i, "title", e.target.value)} placeholder="Exhibition title" disabled={loading} />
                </div>
                <div className="space-y-1">
                  <Label>Date</Label>
                  <Input value={ex.date || ""} onChange={(e) => updateExhibition(i, "date", e.target.value)} placeholder="2024" disabled={loading} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label>Location</Label>
                  <Input value={ex.location || ""} onChange={(e) => updateExhibition(i, "location", e.target.value)} placeholder="Gallery name, city" disabled={loading} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label>Description</Label>
                  <Input value={ex.description || ""} onChange={(e) => updateExhibition(i, "description", e.target.value)} placeholder="One sentence" disabled={loading} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label>Image URL (optional)</Label>
                  <Input value={ex.imageUrl || ""} onChange={(e) => updateExhibition(i, "imageUrl", e.target.value)} placeholder="https://..." disabled={loading} />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addExhibition} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Exhibition
          </Button>
        </div>

        <div className="space-y-6">
          <h2 className="font-display text-xl font-semibold text-charcoal border-b border-gold/20 pb-3">Publications</h2>
          <p className="text-sm text-graphite">List publications to appear on the About page.</p>
          {publications.map((pub, i) => (
            <div key={i} className="border border-gold/20 rounded-sm p-4 space-y-3 bg-cream/30">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-charcoal">Publication {i + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removePublication(i)} className="text-graphite hover:text-charcoal">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Title</Label>
                  <Input value={pub.title} onChange={(e) => updatePublication(i, "title", e.target.value)} placeholder="Publication title" disabled={loading} />
                </div>
                <div className="space-y-1">
                  <Label>Date</Label>
                  <Input value={pub.date || ""} onChange={(e) => updatePublication(i, "date", e.target.value)} placeholder="2024" disabled={loading} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label>Location / Source</Label>
                  <Input value={pub.location || ""} onChange={(e) => updatePublication(i, "location", e.target.value)} placeholder="Magazine, website, etc." disabled={loading} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label>Description</Label>
                  <Input value={pub.description || ""} onChange={(e) => updatePublication(i, "description", e.target.value)} placeholder="One sentence" disabled={loading} />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label>Image URL (optional)</Label>
                  <Input value={pub.imageUrl || ""} onChange={(e) => updatePublication(i, "imageUrl", e.target.value)} placeholder="https://..." disabled={loading} />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addPublication} disabled={loading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Publication
          </Button>
        </div>

        <div className="pt-4 border-t border-gold/20">
          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Saving…" : "Save All Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
