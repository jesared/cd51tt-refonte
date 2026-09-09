import type {
  CalendarEvent,
  CompetitionResource,
} from "@prisma/client";
import { CompetitionResourceStatus } from "@prisma/client";

import { getAdminCalendarEvents } from "@/lib/admin-calendar";
import { getAdminCompetitions } from "@/lib/admin-competitions";
import { getAdminDocuments } from "@/lib/admin-documents";

export type AdminCheckSeverity = "warning" | "info";

export type AdminCheckItem = {
  id: string;
  title: string;
  detail: string;
  href: string;
  severity: AdminCheckSeverity;
};

export type AdminCheckGroup = {
  id: string;
  title: string;
  description: string;
  emptyLabel: string;
  items: AdminCheckItem[];
};

function hasImage(competition: CompetitionResource) {
  return Boolean(competition.imageUrl?.trim());
}

function hasLinkedPublishedEvent(
  competition: CompetitionResource,
  calendarEvents: CalendarEvent[],
) {
  return calendarEvents.some(
    (event) => event.competitionId === competition.id && event.published,
  );
}

function getCompetitionTitleMap(competitions: CompetitionResource[]) {
  return new Map(
    competitions.map((competition) => [competition.id, competition.title]),
  );
}

export async function getAdminQualityCheckGroups(): Promise<AdminCheckGroup[]> {
  const [competitions, calendarEvents, documents] = await Promise.all([
    getAdminCompetitions(),
    getAdminCalendarEvents(),
    getAdminDocuments(),
  ]);
  const competitionTitles = getCompetitionTitleMap(competitions);

  const competitionsWithoutImage = competitions
    .filter((competition) => !hasImage(competition))
    .map((competition) => ({
      id: competition.id,
      title: competition.title,
      detail: "Ajoutez une image pour améliorer la carte publique.",
      href: `/admin/competitions/${competition.id}`,
      severity: "warning" as const,
    }));

  const publishedCompetitionsWithoutEvent = competitions
    .filter(
      (competition) =>
        competition.status === CompetitionResourceStatus.PUBLISHED &&
        !hasLinkedPublishedEvent(competition, calendarEvents),
    )
    .map((competition) => ({
      id: competition.id,
      title: competition.title,
      detail: "Aucune échéance publiée n’est liée à cette compétition.",
      href: `/admin/competitions/${competition.id}`,
      severity: "warning" as const,
    }));

  const draftCalendarEvents = calendarEvents
    .filter((event) => !event.published)
    .map((event) => ({
      id: event.id,
      title: event.title,
      detail: event.competitionId
        ? `Liée à ${competitionTitles.get(event.competitionId) ?? "Compétition inconnue"}.`
        : "Aucune compétition liée.",
      href: `/admin/calendrier/${event.id}`,
      severity: "info" as const,
    }));

  const documentsWithoutCompetition = documents
    .filter((document) => !document.competitionId)
    .map((document) => ({
      id: document.id,
      title: document.title,
      detail: "Ce document n’est lié à aucune compétition.",
      href: `/admin/documents/${document.id}`,
      severity: "info" as const,
    }));

  const unknownCompetitionReferences = [
    ...calendarEvents
      .filter(
        (event) =>
          event.competitionId && !competitionTitles.has(event.competitionId),
      )
      .map((event) => ({
        id: `calendar-${event.id}`,
        title: event.title,
        detail: "Cette échéance pointe vers une compétition introuvable.",
        href: `/admin/calendrier/${event.id}`,
        severity: "warning" as const,
      })),
    ...documents
      .filter(
        (document) =>
          document.competitionId &&
          !competitionTitles.has(document.competitionId),
      )
      .map((document) => ({
        id: `document-${document.id}`,
        title: document.title,
        detail: "Ce document pointe vers une compétition introuvable.",
        href: `/admin/documents/${document.id}`,
        severity: "warning" as const,
      })),
  ];

  return [
    {
      id: "competitions-without-image",
      title: "Compétitions sans image",
      description: "À compléter pour éviter des cartes publiques trop vides.",
      emptyLabel: "Toutes les compétitions ont une image.",
      items: competitionsWithoutImage,
    },
    {
      id: "published-competitions-without-event",
      title: "Compétitions publiées sans échéance",
      description: "À vérifier pour que la prochaine date publique soit utile.",
      emptyLabel: "Toutes les compétitions publiées ont une échéance publiée.",
      items: publishedCompetitionsWithoutEvent,
    },
    {
      id: "draft-calendar-events",
      title: "Échéances brouillon",
      description: "À publier quand la date est validée.",
      emptyLabel: "Aucune échéance en brouillon.",
      items: draftCalendarEvents,
    },
    {
      id: "documents-without-competition",
      title: "Documents non liés à une compétition",
      description: "À rattacher si le document concerne une épreuve précise.",
      emptyLabel: "Tous les documents sont liés quand c’est nécessaire.",
      items: documentsWithoutCompetition,
    },
    {
      id: "unknown-competition-references",
      title: "Références à une compétition inconnue",
      description: "À corriger après suppression ou migration de données.",
      emptyLabel: "Aucune ancienne référence incohérente.",
      items: unknownCompetitionReferences,
    },
  ];
}
