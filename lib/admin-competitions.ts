import {
  AdminUserRole,
  CompetitionResourceStatus,
  Prisma,
  type CompetitionResource,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

import {
  requireAdministratorSession,
  requireEditorSession,
} from "@/lib/admin-auth";
import { recordAdminActivity } from "@/lib/admin-activity";
import { assertCompetitionCanBePublished } from "@/lib/admin-publication-guards";
import type {
  Competition,
  CompetitionAction,
  CompetitionDocument,
  CompetitionTag,
} from "@/lib/mock-data";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import { getCompetitionNextDateLabel } from "@/lib/calendar";
import { prisma } from "@/lib/prisma";

export const COMPETITION_TAG_OPTIONS: CompetitionTag[] = [
  "Équipes",
  "Individuel",
  "Jeunes",
  "Seniors",
];

export const COMPETITION_SPORT_STATUS_OPTIONS = [
  "Ouvert",
  "À venir",
  "En cours",
  "Terminé",
] as const;

export const COMPETITION_ACTION_TYPES = [
  "calendar",
  "results",
  "convocation",
  "rules",
  "registration",
] as const satisfies CompetitionAction["type"][];

const actionFormSchema = z.object({
  label: z.string().trim().optional(),
  href: z.string().trim().optional(),
  type: z.enum(COMPETITION_ACTION_TYPES),
  primary: z.boolean(),
});

const IMAGE_UPLOAD_ERROR_MESSAGE =
  "L’image n’a pas pu être envoyée. Vérifiez que le fichier est une image et qu’il fait moins de 15 Mo.";
const DEFAULT_COMPETITION_SUMMARY =
  "Consulter le règlement pour les modalités complètes.";

const competitionFormSchema = z.object({
  id: z.string().trim().optional(),
  title: z.string().trim().min(3, "Le titre doit contenir au moins 3 caracteres."),
  summary: z.string().trim().optional(),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || value.startsWith("/") || URL.canParse(value),
      "Le lien de l’image n’est pas valide. Utilisez une URL complète ou un chemin interne commençant par /.",
    ),
  period: z.string().trim().min(2, "La periode est requise."),
  sportStatus: z.enum(COMPETITION_SPORT_STATUS_OPTIONS),
  statusDetail: z.string().trim().optional(),
  format: z.string().trim().min(2, "Le format est requis."),
  nextDate: z.string().trim().optional(),
  registrationDeadline: z
    .string()
    .trim()
    .min(2, "La limite d'inscription est requise."),
  location: z.string().trim().min(2, "Le lieu est requis."),
  manager: z.string().trim().min(2, "Le responsable est requis."),
  tags: z
    .array(z.enum(COMPETITION_TAG_OPTIONS))
    .min(1, "Choisissez au moins un tag."),
  actions: z.array(actionFormSchema),
  status: z.nativeEnum(CompetitionResourceStatus),
  sortOrder: z.coerce.number().int().default(0),
});

function getStringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getBooleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getStringValues(formData: FormData, key: string) {
  return formData.getAll(key).map((value) => String(value).trim());
}

function formatDateInputValue(rawDate: string) {
  const parsedDate = new Date(`${rawDate}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("La date limite d'inscription n'est pas valide.");
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function isValidActionHref(href: string) {
  return href.startsWith("/") || URL.canParse(href);
}

function isImageUpload(file: File | null) {
  if (!file || file.size <= 0 || !file.name) {
    return true;
  }

  return file.type.startsWith("image/");
}

function getUploadedCompetitionImageUrl(file: File | null) {
  if (!isImageUpload(file)) {
    throw new Error(IMAGE_UPLOAD_ERROR_MESSAGE);
  }

  return uploadFileToCloudinary(file, "image").catch(() => {
    throw new Error(IMAGE_UPLOAD_ERROR_MESSAGE);
  });
}

function buildCompetitionPath(competitionId?: string) {
  return competitionId
    ? `/admin/competitions/${competitionId}`
    : "/admin/competitions/nouveau";
}

function isCompetitionTableMissingError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022")
  );
}

function serializeErrorMessage(error: unknown) {
  if (isCompetitionTableMissingError(error)) {
    return "Le schema des competitions n'est pas a jour. Lancez d'abord prisma db push.";
  }

  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Le formulaire contient des erreurs.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue.";
}

const hasCompetitionResourceTable = cache(async () => {
  try {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>(Prisma.sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'CompetitionResource'
      ) AS "exists"
    `);

    return rows[0]?.exists ?? false;
  } catch {
    return false;
  }
});

function normalizeJsonArray<T>(value: Prisma.JsonValue, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

export function toCompetitionItem(
  competition: CompetitionResource,
  documents: CompetitionDocument[] = [],
): Competition {
  return {
    id: competition.id,
    title: competition.title,
    summary: competition.summary,
    imageUrl: competition.imageUrl ?? "",
    period: competition.period,
    status: competition.sportStatus as Competition["status"],
    statusDetail: competition.statusDetail,
    format: competition.format,
    nextDate: competition.nextDate,
    registrationDeadline: competition.registrationDeadline,
    location: competition.location,
    manager: competition.manager,
    tags: normalizeJsonArray<CompetitionTag>(competition.tags, []),
    actions: normalizeJsonArray<CompetitionAction>(competition.actions, []),
    documents,
  };
}

function getCompetitionActions(formData: FormData) {
  return COMPETITION_ACTION_TYPES.map((type, index) => ({
    label: getStringValue(formData, `action-${index}-label`),
    href: getStringValue(formData, `action-${index}-href`),
    type,
    primary: getStringValue(formData, "primaryAction") === type,
  })).filter((action) => action.label || action.href);
}

function revalidateCompetitionPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/competitions");
  revalidatePath("/competitions");
  revalidatePath("/competitions/[id]", "page");
  revalidatePath("/");
}

export async function getAdminCompetitions(): Promise<CompetitionResource[]> {
  if (!(await hasCompetitionResourceTable())) {
    return [];
  }

  try {
    return await prisma.competitionResource.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch (error) {
    if (isCompetitionTableMissingError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getAdminCompetitionById(
  id: string,
): Promise<CompetitionResource | null> {
  if (!(await hasCompetitionResourceTable())) {
    return null;
  }

  try {
    return await prisma.competitionResource.findUnique({ where: { id } });
  } catch (error) {
    if (isCompetitionTableMissingError(error)) {
      return null;
    }

    throw error;
  }
}

export async function getPublishedCompetitionItems(): Promise<
  Competition[] | null
> {
  if (!(await hasCompetitionResourceTable())) {
    return null;
  }

  try {
    const entries = await prisma.competitionResource.findMany({
      where: { status: CompetitionResourceStatus.PUBLISHED },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    const events = await prisma.calendarEvent.findMany({
      where: {
        published: true,
        competitionId: { in: entries.map((entry) => entry.id) },
      },
      orderBy: [{ date: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return entries.map((competition) => ({
      ...toCompetitionItem(competition),
      nextDate: getCompetitionNextDateLabel(events, competition.id),
    }));
  } catch {
    return null;
  }
}

export async function getPublishedCompetitionItemById(
  id: string,
): Promise<Competition | null> {
  if (!(await hasCompetitionResourceTable())) {
    return null;
  }

  try {
    const competition = await prisma.competitionResource.findFirst({
      where: { id, status: CompetitionResourceStatus.PUBLISHED },
    });
    const events = competition
      ? await prisma.calendarEvent.findMany({
          where: {
            published: true,
            competitionId: competition.id,
          },
          orderBy: [{ date: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        })
      : [];

    return competition
      ? {
          ...toCompetitionItem(competition),
          nextDate: getCompetitionNextDateLabel(events, competition.id),
        }
      : null;
  } catch {
    return null;
  }
}

export async function saveCompetition(formData: FormData) {
  "use server";

  const id = getStringValue(formData, "id") || undefined;
  const session = await requireEditorSession(buildCompetitionPath(id));
  const requestedStatus = getBooleanValue(formData, "published")
    ? CompetitionResourceStatus.PUBLISHED
    : CompetitionResourceStatus.DRAFT;
  const removeImage = getBooleanValue(formData, "removeImage");
  let redirectPath = "/admin/competitions";

  try {
    const existingCompetition = id
      ? await prisma.competitionResource.findUnique({
          where: { id },
          select: { imageUrl: true, status: true },
        })
      : null;
    const status =
      session.role !== AdminUserRole.USER
        ? requestedStatus
        : existingCompetition?.status ?? CompetitionResourceStatus.DRAFT;

    const uploadedImageUrl = await getUploadedCompetitionImageUrl(
      formData.get("imageUpload") as File | null,
    );
    const imageUrl =
      uploadedImageUrl ?? (removeImage ? "" : getStringValue(formData, "imageUrl"));

    const values = competitionFormSchema.parse({
      id,
      title: getStringValue(formData, "title"),
      summary: getStringValue(formData, "summary"),
      imageUrl,
      period: getStringValue(formData, "period"),
      sportStatus: getStringValue(formData, "sportStatus"),
      statusDetail: getStringValue(formData, "statusDetail"),
      format: getStringValue(formData, "format"),
      nextDate: getStringValue(formData, "nextDate"),
      registrationDeadline: getStringValue(formData, "registrationDeadline"),
      location: getStringValue(formData, "location"),
      manager: getStringValue(formData, "manager"),
      tags: getStringValues(formData, "tags"),
      actions: getCompetitionActions(formData),
      status,
      sortOrder: getStringValue(formData, "sortOrder") || "0",
    });

    const incompleteAction = values.actions.find(
      (action) => (action.label && !action.href) || (!action.label && action.href),
    );

    if (incompleteAction) {
      throw new Error(
        "Chaque lien d’action doit avoir un libellé et une URL.",
      );
    }

    const invalidAction = values.actions.find(
      (action) => action.href && !isValidActionHref(action.href),
    );

    if (invalidAction) {
      throw new Error(
        "Le lien d’action n’est pas valide. Utilisez une URL complète ou un lien interne commençant par /.",
      );
    }

    const primaryAction = values.actions.find((action) => action.primary);
    const actions = values.actions
      .filter((action) => action.label && action.href)
      .map((action, index) => ({
        label: action.label,
        href: action.href,
        type: action.type,
        primary: primaryAction ? action.primary : index === 0,
      }));

    const payload = {
      title: values.title,
      summary: values.summary || DEFAULT_COMPETITION_SUMMARY,
      imageUrl: values.imageUrl || null,
      period: values.period,
      sportStatus: values.sportStatus,
      statusDetail: values.statusDetail ?? "",
      format: values.format,
      nextDate: values.nextDate || "Aucune échéance planifiée",
      registrationDeadline: formatDateInputValue(values.registrationDeadline),
      location: values.location,
      manager: values.manager,
      tags: values.tags,
      actions,
      status: values.status,
      sortOrder: values.sortOrder,
    };

    if (payload.status === CompetitionResourceStatus.PUBLISHED) {
      const linkedEventsCount = values.id
        ? await prisma.calendarEvent.count({
            where: { competitionId: values.id },
          })
        : 0;

      assertCompetitionCanBePublished(payload, linkedEventsCount);
    }

    const savedCompetition = values.id
      ? await prisma.competitionResource.update({
          where: { id: values.id },
          data: payload,
        })
      : await prisma.competitionResource.create({ data: payload });

    await recordAdminActivity({
      session,
      action: values.id ? "update" : "create",
      entityType: "competition",
      entityId: savedCompetition.id,
      entityLabel: savedCompetition.title,
      message: `${session.name} a ${
        values.id ? "modifié" : "créé"
      } la compétition ${savedCompetition.title}.`,
    });

    if (
      values.id &&
      (uploadedImageUrl ||
        (removeImage && existingCompetition?.imageUrl))
    ) {
      await recordAdminActivity({
        session,
        action: "replace_image",
        entityType: "competition",
        entityId: savedCompetition.id,
        entityLabel: savedCompetition.title,
        message: `${session.name} a ${
          removeImage ? "retiré" : "remplacé"
        } l'image de la compétition ${savedCompetition.title}.`,
      });
    }

    revalidateCompetitionPaths();
    redirectPath = `/admin/competitions/${savedCompetition.id}?saved=1`;
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`${buildCompetitionPath(id)}?error=${message}`);
  }

  redirect(redirectPath);
}

export async function deleteCompetition(formData: FormData) {
  "use server";

  const session = await requireEditorSession("/admin/competitions");

  const id = getStringValue(formData, "id");

  if (!id) {
    redirect("/admin/competitions?error=missing-id");
  }

  try {
    const deletedCompetition = await prisma.competitionResource.delete({
      where: { id },
    });

    await recordAdminActivity({
      session,
      action: "delete",
      entityType: "competition",
      entityId: deletedCompetition.id,
      entityLabel: deletedCompetition.title,
      message: `${session.name} a supprimé la compétition ${deletedCompetition.title}.`,
    });
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`/admin/competitions?error=${message}`);
  }

  revalidateCompetitionPaths();
  redirect("/admin/competitions?deleted=1");
}

export async function toggleCompetitionPublication(formData: FormData) {
  "use server";

  const session = await requireAdministratorSession("/admin/competitions");

  const id = getStringValue(formData, "id");
  const status = getBooleanValue(formData, "published")
    ? CompetitionResourceStatus.PUBLISHED
    : CompetitionResourceStatus.DRAFT;

  if (!id) {
    redirect("/admin/competitions?error=missing-id");
  }

  try {
    if (status === CompetitionResourceStatus.PUBLISHED) {
      const competition = await prisma.competitionResource.findUnique({
        where: { id },
      });

      if (!competition) {
        throw new Error("Compétition introuvable.");
      }

      const linkedEventsCount = await prisma.calendarEvent.count({
        where: { competitionId: id },
      });

      assertCompetitionCanBePublished(competition, linkedEventsCount);
    }

    const updatedCompetition = await prisma.competitionResource.update({
      where: { id },
      data: { status },
    });

    await recordAdminActivity({
      session,
      action:
        status === CompetitionResourceStatus.PUBLISHED
          ? "publish"
          : "unpublish",
      entityType: "competition",
      entityId: updatedCompetition.id,
      entityLabel: updatedCompetition.title,
      message: `${session.name} a ${
        status === CompetitionResourceStatus.PUBLISHED ? "publié" : "dépublié"
      } la compétition ${updatedCompetition.title}.`,
    });
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`/admin/competitions?error=${message}`);
  }

  revalidateCompetitionPaths();
  redirect(
    status === CompetitionResourceStatus.PUBLISHED
      ? "/admin/competitions?published=1"
      : "/admin/competitions?unpublished=1",
  );
}
