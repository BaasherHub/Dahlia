import { paintingJsonLd } from "@/lib/seo";

type Props = {
  painting: Parameters<typeof paintingJsonLd>[0];
};

export function PaintingJsonLd({ painting }: Props) {
  const data = paintingJsonLd(painting);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
