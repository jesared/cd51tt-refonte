import { DocumentResourceForm } from "@/components/admin/document-resource-form";
import { requireEditorSession } from "@/lib/admin-auth";
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

export default async function AdminNewDocumentPage({
  searchParams,
}: AdminNewDocumentPageProps) {
  const session = await requireEditorSession("/admin/documents");

  return (
    <DocumentResourceForm
      mode="create"
      canPublish={session.role === "ADMIN"}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
