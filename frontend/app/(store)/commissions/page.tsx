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
  message: z.string().min(20, "Please describe your commission in detail"),
  budget: z.string().optional(),
  dimensions: z.string().optional(),
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
      message: "",
      budget: "",
      dimensions: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await submitCommission(values);
      setSubmitted(true);
      toast.success("Inquiry submitted!");
    } catch {
      toast.error("Failed to send. Please try again.");
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
                <p className="text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
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
                <p className="text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dimensions">Desired Size (optional)</Label>
              <Input
                id="dimensions"
                disabled={loading}
                placeholder='24" × 36"'
                {...form.register("dimensions")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range (optional)</Label>
              <Input
                id="budget"
                disabled={loading}
                placeholder="$500 – $2,000"
                {...form.register("budget")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Tell Me About Your Vision</Label>
            <Textarea
              id="message"
              disabled={loading}
              placeholder="Describe the subject, mood, colors, setting, and any references…"
              rows={6}
              {...form.register("message")}
            />
            {form.formState.errors.message && (
              <p className="text-xs text-red-500">
                {form.formState.errors.message.message}
              </p>
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
