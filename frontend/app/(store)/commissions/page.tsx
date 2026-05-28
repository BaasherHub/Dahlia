"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { submitCommission } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(1, "Subject is required"),
  vision: z.string().min(20, "Please describe your commission in detail (at least 20 characters)"),
  size: z.string().min(1, "Please enter desired size or write \"To be discussed\""),
  budget: z.string().min(1, "Please enter a budget range or write \"To be discussed\""),
});

type FormValues = z.infer<typeof schema>;

export default function CommissionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      vision: "",
      size: "",
      budget: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const vision = values.subject.trim()
        ? `${values.subject.trim()}\n\n${values.vision.trim()}`
        : values.vision.trim();

      await submitCommission({
        name: values.name,
        email: values.email,
        vision,
        size: values.size.trim(),
        budget: values.budget.trim(),
      });
      setSubmitted(true);
      toast.success("Inquiry submitted!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="section-padding container-narrow text-center">
        <div className="max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-gold-dark text-xl">✓</span>
          </div>
          <h1 className="heading-lg mb-4">Thank You</h1>
          <p className="text-graphite leading-relaxed">
            Your commission inquiry has been received. I&apos;ll be in touch
            within 2–3 business days to discuss your vision.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding container-narrow">
      <div className="max-w-2xl">
        <p className="label-sm mb-4">Bespoke Work</p>
        <h1 className="heading-xl mb-4">Commission a Painting</h1>
        <p className="text-graphite leading-relaxed mb-10">
          Each commission is a collaboration. I work with you from concept to
          completion — ensuring the finished piece feels personal, meaningful,
          and lasting.
        </p>

        <Separator className="mb-10" />

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                disabled={loading}
                placeholder="Jane Smith"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                disabled={loading}
                placeholder="jane@example.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject / Commission Type</Label>
            <Input
              id="subject"
              disabled={loading}
              placeholder="Portrait, landscape, abstract…"
              {...form.register("subject")}
            />
            {form.formState.errors.subject && (
              <p className="text-xs text-red-500">{form.formState.errors.subject.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="size">Desired Size</Label>
              <Input
                id="size"
                disabled={loading}
                placeholder='24" × 36" or "To be discussed"'
                {...form.register("size")}
              />
              {form.formState.errors.size && (
                <p className="text-xs text-red-500">{form.formState.errors.size.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Input
                id="budget"
                disabled={loading}
                placeholder="$500 – $2,000 or To be discussed"
                {...form.register("budget")}
              />
              {form.formState.errors.budget && (
                <p className="text-xs text-red-500">{form.formState.errors.budget.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vision">Tell Me About Your Vision</Label>
            <Textarea
              id="vision"
              disabled={loading}
              placeholder="Describe the subject, mood, colors, setting, and any references…"
              rows={6}
              {...form.register("vision")}
            />
            {form.formState.errors.vision && (
              <p className="text-xs text-red-500">{form.formState.errors.vision.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading} size="lg">
            {loading ? "Sending…" : "Submit Inquiry"}
          </Button>
        </form>
      </div>
    </div>
  );
}
