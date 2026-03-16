import { notFound } from "next/navigation";
import { fetchCollection } from "@/lib/api";
import { CollectionForm } from "@/components/admin/collection-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditCollectionPage({ params }: Props) {
  const { id } = await params;
  let collection;
  try {
    collection = await fetchCollection(id);
  } catch {
    notFound();
  }

  return <CollectionForm initialData={collection} />;
}
