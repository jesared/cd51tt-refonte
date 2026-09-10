import { CompetitionForm } from "@/components/admin/competition-form";
import { requireEditorSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Nouvelle compétition",
  description: "Création d'une compétition dans l'administration.",
  path: "/admin/competitions/nouveau",
});

type AdminNewCompetitionPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function AdminNewCompetitionPage({
  searchParams,
}: AdminNewCompetitionPageProps) {
  const session = await requireEditorSession("/admin/competitions");

  return (
    <CompetitionForm
      mode="create"
      canPublish={session.role === "ADMIN"}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
