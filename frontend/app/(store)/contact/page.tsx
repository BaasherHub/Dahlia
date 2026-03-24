import type { Metadata } from "next";
import { fetchSiteSettings } from "@/lib/api";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Dahlia Baasher.",
};

export default async function ContactPage() {
  const settings = await fetchSiteSettings();

  return (
    <div className="section-padding container-narrow">
      <div className="max-w-xl mx-auto">
        <p className="label-sm mb-4">Get in Touch</p>
        <h1 className="heading-xl mb-6">Contact</h1>
        <p className="text-graphite mb-10 leading-relaxed">
          {settings?.newsletterSubtitle ||
            "Have a question about artwork, shipping, or collaborations? Send a message and we'll get back to you soon."}
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
