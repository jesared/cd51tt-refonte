import type { CalendarEvent, CalendarEventType } from "@prisma/client";

export function getCalendarEventTypeLabel(type: CalendarEventType) {
  const labels: Record<CalendarEventType, string> = {
    JOURNEE: "Journée",
    CONVOCATION: "Convocation",
    INSCRIPTION: "Inscription",
    RESULTAT: "Résultat",
  };

  return labels[type];
}

export function getCompetitionTitle(
  competitionId: string | null,
  competitionTitles?: ReadonlyMap<string, string>,
) {
  if (!competitionId) {
    return "Événement général";
  }

  return competitionTitles?.get(competitionId) ?? "Compétition inconnue";
}

export function formatCalendarEventDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getNextCompetitionEvent(
  events: CalendarEvent[],
  competitionId: string,
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events
    .filter(
      (event) =>
        event.competitionId === competitionId && event.date.getTime() >= today.getTime(),
    )
    .sort(
      (first, second) =>
        first.date.getTime() - second.date.getTime() ||
        first.sortOrder - second.sortOrder,
    )[0];
}

export function getCompetitionNextDateLabel(
  events: CalendarEvent[],
  competitionId: string,
) {
  const nextEvent = getNextCompetitionEvent(events, competitionId);

  return nextEvent
    ? `${nextEvent.title} - ${formatCalendarEventDate(nextEvent.date)}`
    : "Aucune échéance planifiée";
}
