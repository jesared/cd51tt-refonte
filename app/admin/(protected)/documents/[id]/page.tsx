import { notFound } from "next/navigation";

import { DocumentResourceForm } from "@/components/admin/document-resource-form";
import { requireEditorSession } from "@/lib/admin-auth";
import { getAdminCompetitions } from "@/lib/admin-competitions";
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
    saved?: string;
  };
};

export default async function AdminEditDocumentPage({
  params,
  searchParams,
}: AdminEditDocumentPageProps) {
  const [document, session, competitions] = await Promise.all([
    getAdminDocumentById(params.id),
    requireEditorSession("/admin/documents"),
    getAdminCompetitions(),
  ]);

  if (!document) {
    notFound();
  }

  return (
    <DocumentResourceForm
      mode="edit"
      document={document}
      competitions={competitions}
      canPublish={session.role === "ADMIN" || session.role === "EDITOR"}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
      saved={searchParams?.saved === "1"}
    />
  );
}
