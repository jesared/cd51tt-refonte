import { ClubForm } from "@/components/admin/club-form";
import { requireAdministratorSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Nouveau club",
  description: "Ajout d'un club dans l'annuaire.",
  path: "/admin/clubs/nouveau",
});

type AdminNewClubPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function AdminNewClubPage({
  searchParams,
}: AdminNewClubPageProps) {
  await requireAdministratorSession("/admin");

  return (
    <ClubForm
      mode="create"
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
