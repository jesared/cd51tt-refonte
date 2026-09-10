import { CalendarEventForm } from "@/components/admin/calendar-event-form";
import { requireEditorSession } from "@/lib/admin-auth";
import { getAdminCompetitions } from "@/lib/admin-competitions";
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
  const [competitionOptions, session] = await Promise.all([
    getAdminCompetitions(),
    requireEditorSession("/admin/calendrier"),
  ]);

  return (
    <CalendarEventForm
      mode="create"
      competitionOptions={competitionOptions}
      defaultCompetitionId={searchParams?.competition}
      canPublish={session.role === "ADMIN" || session.role === "EDITOR"}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
