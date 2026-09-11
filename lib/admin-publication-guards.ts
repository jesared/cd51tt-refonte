import type {
  CalendarEvent,
  CompetitionResource,
  DocumentResource,
  NewsArticle,
  Prisma,
} from "@prisma/client";

import type { CompetitionAction } from "@/lib/mock-data";

type PublishableNewsArticle = Pick<
  NewsArticle,
  "title" | "excerpt" | "content" | "imageUrl" | "publishedAt"
>;

type PublishableCompetition = Pick<
  CompetitionResource,
  | "title"
  | "summary"
  | "imageUrl"
  | "period"
  | "format"
  | "registrationDeadline"
  | "location"
  | "manager"
  | "actions"
>;

type PublishableDocument = Pick<
  DocumentResource,
  "title" | "description" | "fileUrl" | "format"
>;

type PublishableCalendarEvent = Pick<
  CalendarEvent,
  "title" | "competitionId" | "date" | "location"
>;

function hasText(value: string | null | undefined, minLength = 1) {
  return Boolean(value?.trim() && value.trim().length >= minLength);
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

function buildPublicationError(contentLabel: string, issues: string[]) {
  if (issues.length === 0) {
    return;
  }

  throw new Error(
    `Publication bloquée pour ${contentLabel}. À corriger : ${issues.join("; ")}.`,
  );
}

export function assertNewsArticleCanBePublished(article: PublishableNewsArticle) {
  const issues = [
    !hasText(article.imageUrl) ? "ajouter une image" : null,
    article.imageUrl && !isValidLink(article.imageUrl)
      ? "corriger le lien de l’image"
      : null,
    !article.publishedAt ? "indiquer une date de publication" : null,
    !hasText(article.excerpt, 40) ? "rédiger un extrait plus complet" : null,
    !hasText(article.content, 120) ? "rédiger un contenu plus complet" : null,
  ].filter(Boolean) as string[];

  buildPublicationError(`l’actualité "${article.title}"`, issues);
}

export function assertCompetitionCanBePublished(
  competition: PublishableCompetition,
  linkedEventsCount: number,
) {
  const invalidActions = getCompetitionActions(competition.actions).filter(
    (action) => action.href && !isValidLink(action.href),
  );
  const issues = [
    !hasText(competition.imageUrl) ? "ajouter une image" : null,
    competition.imageUrl && !isValidLink(competition.imageUrl)
      ? "corriger le lien de l’image"
      : null,
    linkedEventsCount <= 0 ? "ajouter une échéance liée" : null,
    !hasText(competition.registrationDeadline)
      ? "indiquer la date limite d’inscription"
      : null,
    !hasText(competition.summary)
      ? "renseigner une information courte ou laisser le texte par défaut"
      : null,
    !hasText(competition.period) ? "indiquer la période" : null,
    !hasText(competition.format) ? "indiquer le format" : null,
    !hasText(competition.location) ? "indiquer le lieu" : null,
    !hasText(competition.manager) ? "indiquer le responsable" : null,
    invalidActions.length > 0 ? "corriger les liens d’action invalides" : null,
  ].filter(Boolean) as string[];

  buildPublicationError(`la compétition "${competition.title}"`, issues);
}

export function assertDocumentCanBePublished(document: PublishableDocument) {
  const issues = [
    !hasText(document.fileUrl) ? "ajouter un fichier ou un lien" : null,
    document.fileUrl && !isValidLink(document.fileUrl)
      ? "corriger le lien du document"
      : null,
    !hasText(document.description, 40)
      ? "rédiger une description plus complète"
      : null,
    !hasText(document.format) ? "indiquer le format" : null,
  ].filter(Boolean) as string[];

  buildPublicationError(`le document "${document.title}"`, issues);
}

export function assertCalendarEventCanBePublished(
  event: PublishableCalendarEvent,
  competitionExists: boolean,
) {
  const issues = [
    !event.date ? "indiquer une date" : null,
    !hasText(event.competitionId) ? "lier une compétition" : null,
    event.competitionId && !competitionExists
      ? "choisir une compétition existante"
      : null,
    !hasText(event.title, 3) ? "renseigner le libellé" : null,
    !hasText(event.location, 2) ? "indiquer le lieu" : null,
  ].filter(Boolean) as string[];

  buildPublicationError(`l’échéance "${event.title}"`, issues);
}
