import { notFound } from "next/navigation";

import { CalendarEventForm } from "@/components/admin/calendar-event-form";
import { getAdminCalendarEventById } from "@/lib/admin-calendar";
import { getAdminCompetitions } from "@/lib/admin-competitions";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Modifier une échéance",
  description: "Modification d'une échéance du calendrier sportif.",
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
  const [event, competitionOptions] = await Promise.all([
    getAdminCalendarEventById(params.id),
    getAdminCompetitions(),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <CalendarEventForm
      mode="edit"
      event={event}
      competitionOptions={competitionOptions}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
      saved={searchParams?.saved === "1"}
    />
  );
}
