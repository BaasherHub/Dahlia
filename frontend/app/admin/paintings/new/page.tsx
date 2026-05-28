import { fetchCollections } from "@/lib/api";
import { PaintingForm } from "@/components/admin/painting-form";

export default async function NewPaintingPage() {
  let collections: Array<{ id: string; name: string }> = [];
  try {
    const result = await fetchCollections();
    const list = Array.isArray(result) ? result : result?.collections || [];
    collections = list.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }));
  } catch {
    collections = [];
  }

  return <PaintingForm initialData={null} collections={collections} />;
}
