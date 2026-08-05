import { notFound } from "next/navigation";

import { ClubForm } from "@/components/admin/club-form";
import { getAdminClubById } from "@/lib/admin-clubs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Modifier un club",
  description: "Édition d'un club dans l'annuaire.",
  path: "/admin/clubs",
});

type AdminEditClubPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    error?: string;
  };
};

export default async function AdminEditClubPage({
  params,
  searchParams,
}: AdminEditClubPageProps) {
  const club = await getAdminClubById(params.id);

  if (!club) {
    notFound();
  }

  return (
    <ClubForm
      mode="edit"
      club={club}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
