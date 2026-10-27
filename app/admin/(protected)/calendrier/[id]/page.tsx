import { notFound } from "next/navigation";

import { CalendarEventForm } from "@/components/admin/calendar-event-form";
import { requireEditorSession } from "@/lib/admin-auth";
import { getAdminCalendarEventById } from "@/lib/admin-calendar";
import { getAdminCompetitions } from "@/lib/admin-competitions";
import { getAdminClubs } from "@/lib/admin-clubs";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Modifier une échéance",
  description: "Modification d'une échéance sportive.",
  path: "/admin/calendrier",
});

type EditCalendarEventPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    error?: string;
    saved?: string;
  };
};

export default async function EditCalendarEventPage({
  params,
  searchParams,
}: EditCalendarEventPageProps) {
  const [event, competitionOptions, clubs, session] = await Promise.all([
    getAdminCalendarEventById(params.id),
    getAdminCompetitions(),
    getAdminClubs(),
    requireEditorSession("/admin/calendrier"),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <CalendarEventForm
      mode="edit"
      event={event}
      competitionOptions={competitionOptions}
      organizerClubOptions={clubs.filter((club) => club.active).map((club) => ({
        name: club.name,
        city: club.city,
        ffttId: club.ffttId,
      }))}
      canPublish={session.role === "ADMIN" || session.role === "EDITOR"}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
      saved={searchParams?.saved === "1"}
    />
  );
}
