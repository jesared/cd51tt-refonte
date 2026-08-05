import { notFound } from "next/navigation";

import { DocumentResourceForm } from "@/components/admin/document-resource-form";
import { getAdminDocumentById } from "@/lib/admin-documents";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Modifier un document",
  description: "Édition d'une ressource documentaire du comité.",
  path: "/admin/documents",
});

type AdminEditDocumentPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    error?: string;
  };
};

export default async function AdminEditDocumentPage({
  params,
  searchParams,
}: AdminEditDocumentPageProps) {
  const document = await getAdminDocumentById(params.id);

  if (!document) {
    notFound();
  }

  return (
    <DocumentResourceForm
      mode="edit"
      document={document}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
