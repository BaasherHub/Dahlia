import { notFound } from "next/navigation";
import { fetchPainting, fetchCollections } from "@/lib/api";
import { PaintingForm } from "@/components/admin/painting-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditPaintingPage({ params }: Props) {
  const { id } = await params;
  let painting;
  let collections: Array<{ id: string; name: string }> = [];

  try {
    [painting, collections] = await Promise.all([
      fetchPainting(id),
      fetchCollections().then((r) => {
        const list = Array.isArray(r) ? r : r?.collections || [];
        return list.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }));
      }),
    ]);
  } catch {
    notFound();
  }

  return <PaintingForm initialData={painting} collections={collections} />;
}
