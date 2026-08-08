import type { CalendarEventType } from "@prisma/client";

import { competitions } from "@/lib/mock-data";

export function getCalendarEventTypeLabel(type: CalendarEventType) {
  const labels: Record<CalendarEventType, string> = {
    JOURNEE: "Journée",
    CONVOCATION: "Convocation",
    INSCRIPTION: "Inscription",
    RESULTAT: "Résultat",
  };

  return labels[type];
}

export function getCompetitionTitle(competitionId: string | null) {
  if (!competitionId) {
    return "Événement général";
  }

  return (
    competitions.find((competition) => competition.id === competitionId)?.title ??
    "Compétition inconnue"
  );
}
