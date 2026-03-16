import { notFound } from "next/navigation";
import { fetchCollection } from "@/lib/api";
import { CollectionForm } from "@/components/admin/collection-form";

type Props = { params: { id: string } };

export default async function EditCollectionPage({ params }: Props) {
  let collection;
  try {
    collection = await fetchCollection(params.id);
  } catch {
    notFound();
  }

  return <CollectionForm initialData={collection} />;
}
