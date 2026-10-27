import { CalendarEventForm } from "@/components/admin/calendar-event-form";
import { requireEditorSession } from "@/lib/admin-auth";
import { getAdminCompetitions } from "@/lib/admin-competitions";
import { getAdminClubs } from "@/lib/admin-clubs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Nouvelle échéance",
  description: "Création d'une échéance sportive.",
  path: "/admin/calendrier/nouveau",
});

type NewCalendarEventPageProps = {
  searchParams?: {
    competition?: string;
    error?: string;
  };
};

export default async function NewCalendarEventPage({
  searchParams,
}: NewCalendarEventPageProps) {
  const [competitionOptions, clubs, session] = await Promise.all([
    getAdminCompetitions(),
    getAdminClubs(),
    requireEditorSession("/admin/calendrier"),
  ]);

  return (
    <CalendarEventForm
      mode="create"
      competitionOptions={competitionOptions}
      organizerClubOptions={clubs.filter((club) => club.active).map((club) => ({
        name: club.name,
        city: club.city,
        ffttId: club.ffttId,
      }))}
      defaultCompetitionId={searchParams?.competition}
      canPublish={session.role === "ADMIN" || session.role === "EDITOR"}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
