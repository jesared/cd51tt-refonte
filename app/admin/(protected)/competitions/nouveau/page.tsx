import { CompetitionForm } from "@/components/admin/competition-form";
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

export default function AdminNewCompetitionPage({
  searchParams,
}: AdminNewCompetitionPageProps) {
  return (
    <CompetitionForm
      mode="create"
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
