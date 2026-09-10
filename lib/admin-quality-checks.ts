import type {
  CalendarEvent,
  CompetitionResource,
  DocumentResource,
  Prisma,
} from "@prisma/client";

import { getAdminCalendarEvents } from "@/lib/admin-calendar";
import { getAdminCompetitions } from "@/lib/admin-competitions";
import { getAdminDocuments } from "@/lib/admin-documents";
import type { CompetitionAction } from "@/lib/mock-data";

export type AdminCheckSeverity = "warning" | "info";

export type AdminCheckItem = {
  id: string;
  title: string;
  detail: string;
  href: string;
  severity: AdminCheckSeverity;
  contentType: string;
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

function hasLinkedEvent(
  competition: CompetitionResource,
  calendarEvents: CalendarEvent[],
) {
  return calendarEvents.some((event) => event.competitionId === competition.id);
}

function getCompetitionTitleMap(competitions: CompetitionResource[]) {
  return new Map(
    competitions.map((competition) => [competition.id, competition.title]),
  );
}

function isValidLink(value: string | null | undefined) {
  const link = value?.trim();

  if (!link || link === "#") {
    return false;
  }

  return link.startsWith("/") || URL.canParse(link);
}

function getCompetitionActions(value: Prisma.JsonValue): CompetitionAction[] {
  return Array.isArray(value) ? (value as CompetitionAction[]) : [];
}

function getInvalidCompetitionLinks(competition: CompetitionResource) {
  const links = [
    competition.imageUrl
      ? {
          id: `${competition.id}-image`,
          label: "image",
          value: competition.imageUrl,
        }
      : null,
    ...getCompetitionActions(competition.actions)
      .filter((action) => action.href)
      .map((action) => ({
        id: `${competition.id}-action-${action.type}`,
        label: `lien d'action "${action.label || action.type}"`,
        value: action.href,
      })),
  ].filter(Boolean) as Array<{ id: string; label: string; value: string }>;

  return links.filter((link) => !isValidLink(link.value));
}

function getInvalidDocumentLink(document: DocumentResource) {
  if (!document.fileUrl?.trim()) {
    return null;
  }

  return isValidLink(document.fileUrl) ? null : document.fileUrl;
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
      contentType: "Compétition",
    }));

  const competitionsWithoutEvent = competitions
    .filter((competition) => !hasLinkedEvent(competition, calendarEvents))
    .map((competition) => ({
      id: competition.id,
      title: competition.title,
      detail: "Ajoutez au moins une échéance liée à cette compétition.",
      href: `/admin/competitions/${competition.id}`,
      severity: "warning" as const,
      contentType: "Compétition",
    }));

  const documentsWithoutLink = documents
    .filter((document) => !document.fileUrl?.trim())
    .map((document) => ({
      id: document.id,
      title: document.title,
      detail: "Ajoutez un fichier ou une URL pour que le document soit utilisable.",
      href: `/admin/documents/${document.id}`,
      severity: "warning" as const,
      contentType: "Document",
    }));

  const calendarEventsWithoutCompetition = calendarEvents
    .filter(
      (event) =>
        !event.competitionId ||
        (event.competitionId && !competitionTitles.has(event.competitionId)),
    )
    .map((event) => ({
      id: event.id,
      title: event.title,
      detail: event.competitionId
        ? "Cette échéance pointe vers une compétition introuvable."
        : "Choisissez la compétition concernée par cette échéance.",
      href: `/admin/calendrier/${event.id}`,
      severity: "warning" as const,
      contentType: "Échéance",
    }));

  const invalidLinks = [
    ...documents
      .map((document) => ({
        document,
        invalidLink: getInvalidDocumentLink(document),
      }))
      .filter(({ invalidLink }) => invalidLink !== null)
      .map(({ document, invalidLink }) => ({
        id: `document-${document.id}-file`,
        title: document.title,
        detail: invalidLink?.trim()
          ? `Le lien du document n’est pas valide : ${invalidLink}.`
          : "Le lien du document est vide.",
        href: `/admin/documents/${document.id}`,
        severity: "warning" as const,
        contentType: "Document",
      })),
    ...competitions.flatMap((competition) =>
      getInvalidCompetitionLinks(competition).map((link) => ({
        id: `competition-${link.id}`,
        title: competition.title,
        detail: `Le ${link.label} n’est pas valide : ${link.value}.`,
        href: `/admin/competitions/${competition.id}`,
        severity: "warning" as const,
        contentType: "Compétition",
      })),
    ),
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
      id: "competitions-without-event",
      title: "Compétitions sans échéance",
      description: "À corriger pour que chaque compétition ait au moins une date liée.",
      emptyLabel: "Toutes les compétitions ont une échéance liée.",
      items: competitionsWithoutEvent,
    },
    {
      id: "documents-without-link",
      title: "Documents sans lien",
      description: "À corriger pour éviter les documents impossibles à ouvrir.",
      emptyLabel: "Tous les documents ont un lien ou un fichier.",
      items: documentsWithoutLink,
    },
    {
      id: "calendar-events-without-competition",
      title: "Échéances sans compétition",
      description: "À rattacher pour que le calendrier et les compétitions restent cohérents.",
      emptyLabel: "Toutes les échéances sont liées à une compétition.",
      items: calendarEventsWithoutCompetition,
    },
    {
      id: "invalid-links",
      title: "Liens invalides",
      description: "À réparer pour éviter les boutons, images ou documents cassés.",
      emptyLabel: "Aucun lien invalide détecté.",
      items: invalidLinks,
    },
  ];
}
