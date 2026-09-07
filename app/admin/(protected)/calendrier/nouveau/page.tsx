import { CalendarEventForm } from "@/components/admin/calendar-event-form";
import { getAdminCompetitions } from "@/lib/admin-competitions";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Nouvelle échéance",
  description: "Création d'une échéance du calendrier sportif.",
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
  const competitionOptions = await getAdminCompetitions();

  return (
    <CalendarEventForm
      mode="create"
      competitionOptions={competitionOptions}
      defaultCompetitionId={searchParams?.competition}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
