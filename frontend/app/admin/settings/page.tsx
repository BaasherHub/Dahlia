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

const schema = z.object({
  siteName: z.string().optional(),
  tagline: z.string().optional(),
  artistBio: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  instagramUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      siteName: "",
      tagline: "",
      artistBio: "",
      contactEmail: "",
      instagramUrl: "",
    },
  });

  const loadSettings = useCallback(async () => {
    try {
      const settings = await fetchSiteSettings();
      if (settings) {
        form.reset({
          siteName: settings.siteName || "",
          tagline: settings.tagline || "",
          artistBio: settings.artistBio || "",
          contactEmail: settings.contactEmail || "",
          instagramUrl: settings.instagramUrl || "",
        });
      }
    } catch {
      // settings may not exist yet
    } finally {
      setFetching(false);
    }
  }, [form]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await adminUpdateSiteSettings(values);
      toast.success("Settings saved.");
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="text-graphite py-8">Loading settings…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="label-sm mb-1">Configure</p>
        <h1 className="font-display text-3xl font-semibold text-charcoal">
          Site Settings
        </h1>
      </div>

      <Separator />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl"
      >
        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            disabled={loading}
            {...form.register("siteName")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            disabled={loading}
            placeholder="Fine art for the discerning collector"
            {...form.register("tagline")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="artistBio">Artist Bio</Label>
          <Textarea
            id="artistBio"
            disabled={loading}
            rows={6}
            {...form.register("artistBio")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            disabled={loading}
            {...form.register("contactEmail")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            disabled={loading}
            placeholder="https://instagram.com/…"
            {...form.register("instagramUrl")}
          />
        </div>

        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Saving…" : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
