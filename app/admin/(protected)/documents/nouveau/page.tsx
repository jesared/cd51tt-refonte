import { DocumentResourceForm } from "@/components/admin/document-resource-form";
import { requireEditorSession } from "@/lib/admin-auth";
import { getAdminCompetitions } from "@/lib/admin-competitions";
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
  const [session, competitions] = await Promise.all([
    requireEditorSession("/admin/documents"),
    getAdminCompetitions(),
  ]);

  return (
    <DocumentResourceForm
      mode="create"
      competitions={competitions}
      canPublish={session.role === "ADMIN" || session.role === "EDITOR"}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
