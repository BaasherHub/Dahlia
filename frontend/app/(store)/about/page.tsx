import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About the artist Dahlia Baasher.",
};

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-narrow">
        <div className="max-w-3xl">
          <p className="label-sm mb-4">The Artist</p>
          <h1 className="heading-xl mb-10">About Dahlia</h1>

          <div className="prose prose-lg max-w-none space-y-6 text-graphite leading-relaxed">
            <p>
              Dahlia Baasher is a contemporary painter whose work explores the
              intersection of light, memory, and the quiet moments that define
              our lives. Working primarily in oils and acrylics, she creates
              pieces that invite prolonged contemplation — canvases that reveal
              new details the longer you look.
            </p>
            <p>
              Her practice draws on a rich visual vocabulary built through years
              of observation and study. Each painting begins with an intimate
              relationship with its subject: hours of sketching, color studies,
              and careful attention before a single mark is made on the final
              canvas.
            </p>
            <p>
              Dahlia's work has been collected by private collectors across
              North America, Europe, and the Middle East. She accepts a limited
              number of commissions each year, working closely with each client
              to ensure the finished piece feels both personal and timeless.
            </p>
            <p>
              She currently works from her studio, where natural light floods
              the space from morning to evening — a constant presence that
              informs every canvas.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-16 border-t border-gold/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { label: "Medium", value: "Oils, Acrylics, Mixed Media" },
              { label: "Based in", value: "Studio Practice" },
              {
                label: "Commissions",
                value: "Available — limited per year",
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="label-sm mb-2">{item.label}</p>
                <p className="text-charcoal font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
