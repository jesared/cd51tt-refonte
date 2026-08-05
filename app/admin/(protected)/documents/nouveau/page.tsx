import { DocumentResourceForm } from "@/components/admin/document-resource-form";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Nouveau document",
  description: "Creation d'une ressource documentaire dans l'administration.",
  path: "/admin/documents/nouveau",
});

type AdminNewDocumentPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function AdminNewDocumentPage({
  searchParams,
}: AdminNewDocumentPageProps) {
  return (
    <DocumentResourceForm
      mode="create"
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}

