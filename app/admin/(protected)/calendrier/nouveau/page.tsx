import { CalendarEventForm } from "@/components/admin/calendar-event-form";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Nouvelle échéance",
  description: "Création d'une échéance du calendrier sportif.",
  path: "/admin/calendrier/nouveau",
});

type NewCalendarEventPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function NewCalendarEventPage({
  searchParams,
}: NewCalendarEventPageProps) {
  return (
    <CalendarEventForm
      mode="create"
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
