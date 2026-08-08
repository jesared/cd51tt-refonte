import { notFound } from "next/navigation";

import { CalendarEventForm } from "@/components/admin/calendar-event-form";
import { getAdminCalendarEventById } from "@/lib/admin-calendar";
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
  };
};

export default async function EditCalendarEventPage({
  params,
  searchParams,
}: EditCalendarEventPageProps) {
  const event = await getAdminCalendarEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <CalendarEventForm
      mode="edit"
      event={event}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
