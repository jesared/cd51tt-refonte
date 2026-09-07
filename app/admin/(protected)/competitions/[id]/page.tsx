import { notFound } from "next/navigation";

import { CompetitionForm } from "@/components/admin/competition-form";
import { getAdminCompetitionById } from "@/lib/admin-competitions";
import { getAdminCalendarEvents } from "@/lib/admin-calendar";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Modifier une compétition",
  description: "Modification d'une compétition sportive du comité.",
  path: "/admin/competitions",
});

type AdminEditCompetitionPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    error?: string;
    saved?: string;
  };
};

export default async function AdminEditCompetitionPage({
  params,
  searchParams,
}: AdminEditCompetitionPageProps) {
  const [competition, calendarEvents] = await Promise.all([
    getAdminCompetitionById(params.id),
    getAdminCalendarEvents(),
  ]);

  if (!competition) {
    notFound();
  }

  const linkedCalendarEvents = calendarEvents.filter(
    (event) => event.competitionId === competition.id,
  );

  return (
    <CompetitionForm
      mode="edit"
      competition={competition}
      linkedCalendarEvents={linkedCalendarEvents}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
      saved={searchParams?.saved === "1"}
    />
  );
}
