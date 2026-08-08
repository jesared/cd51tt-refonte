import { CompetitionForm } from "@/components/admin/competition-form";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Nouvelle compétition",
  description: "Création d'une compétition sportive.",
  path: "/admin/competitions/nouveau",
});

export default function AdminNewCompetitionPage() {
  return <CompetitionForm />;
}
