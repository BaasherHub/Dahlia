import { adminFetchCollections } from "@/lib/api";
import { PaintingForm } from "@/components/admin/painting-form";

export default async function NewPaintingPage() {
  let collections: Array<{ id: string; name: string }> = [];
  try {
    const result = await adminFetchCollections();
    collections = Array.isArray(result) ? result : result?.collections || [];
  } catch {
    collections = [];
  }

  return <PaintingForm initialData={null} collections={collections} />;
}
