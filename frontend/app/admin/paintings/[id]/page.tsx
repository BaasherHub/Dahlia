import { notFound } from "next/navigation";
import { fetchPainting, adminFetchCollections } from "@/lib/api";
import { PaintingForm } from "@/components/admin/painting-form";

type Props = { params: { id: string } };

export default async function EditPaintingPage({ params }: Props) {
  let painting;
  let collections: Array<{ id: string; name: string }> = [];

  try {
    [painting, collections] = await Promise.all([
      fetchPainting(params.id),
      adminFetchCollections().then((r) =>
        Array.isArray(r) ? r : r?.collections || []
      ),
    ]);
  } catch {
    notFound();
  }

  return <PaintingForm initialData={painting} collections={collections} />;
}
