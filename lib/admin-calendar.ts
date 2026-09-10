"use server";

import { CalendarEventType, Prisma, type CalendarEvent } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

import {
  requireAdministratorSession,
  requireEditorSession,
} from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const calendarEventFormSchema = z.object({
  id: z.string().optional(),
  competitionId: z.string().trim().min(1, "Choisissez une compétition."),
  title: z.string().trim().min(3, "Le libellé doit contenir au moins 3 caractères."),
  type: z.nativeEnum(CalendarEventType),
  date: z.string().trim().min(1, "La date est requise."),
  location: z.string().trim().min(2, "Le lieu est requis."),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().default(0),
});

function getStringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getBooleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function buildCalendarEventPath(eventId?: string) {
  return eventId
    ? `/admin/calendrier/${eventId}`
    : "/admin/calendrier/nouveau";
}

function toEventDate(rawDate: string) {
  const parsedDate = new Date(`${rawDate}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("La date n'est pas valide.");
  }

  return parsedDate;
}

function isCalendarEventTableMissingError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2021" || error.code === "P2022")
  );
}

function serializeErrorMessage(error: unknown) {
  if (isCalendarEventTableMissingError(error)) {
    return "Le schéma du calendrier n'est pas à jour. Lancez d'abord prisma db push.";
  }

  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Le formulaire contient des erreurs.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue.";
}

const hasCalendarEventTable = cache(async () => {
  try {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>(Prisma.sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'CalendarEvent'
      ) AS "exists"
    `);

    return rows[0]?.exists ?? false;
  } catch {
    return false;
  }
});

export async function getAdminCalendarEvents(): Promise<CalendarEvent[]> {
  if (!(await hasCalendarEventTable())) {
    return [];
  }

  try {
    return await prisma.calendarEvent.findMany({
      orderBy: [{ date: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch (error) {
    if (isCalendarEventTableMissingError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getAdminCalendarEventById(
  id: string,
): Promise<CalendarEvent | null> {
  if (!(await hasCalendarEventTable())) {
    return null;
  }

  try {
    return prisma.calendarEvent.findUnique({ where: { id } });
  } catch (error) {
    if (isCalendarEventTableMissingError(error)) {
      return null;
    }

    throw error;
  }
}

export async function getPublishedCalendarEvents(): Promise<CalendarEvent[] | null> {
  if (!(await hasCalendarEventTable())) {
    return null;
  }

  try {
    return await prisma.calendarEvent.findMany({
      where: { published: true },
      orderBy: [{ date: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return null;
  }
}

export async function saveCalendarEvent(formData: FormData) {
  const id = getStringValue(formData, "id") || undefined;
  const session = await requireEditorSession(buildCalendarEventPath(id));
  let redirectPath = "/admin/calendrier";

  try {
    const existingEvent = id
      ? await prisma.calendarEvent.findUnique({
          where: { id },
          select: { published: true },
        })
      : null;
    const values = calendarEventFormSchema.parse({
      id,
      competitionId: getStringValue(formData, "competitionId"),
      title: getStringValue(formData, "title"),
      type: getStringValue(formData, "type"),
      date: getStringValue(formData, "date"),
      location: getStringValue(formData, "location"),
      published:
        session.role === "ADMIN"
          ? getBooleanValue(formData, "published")
          : existingEvent?.published ?? false,
      sortOrder: getStringValue(formData, "sortOrder") || "0",
    });

    const competition = await prisma.competitionResource.findUnique({
      where: { id: values.competitionId },
      select: { id: true },
    });

    if (!competition) {
      throw new Error("Choisissez une compétition existante.");
    }

    const payload = {
      competitionId: values.competitionId,
      title: values.title,
      type: values.type,
      date: toEventDate(values.date),
      location: values.location,
      published: values.published,
      sortOrder: values.sortOrder,
    };

    const savedEvent = values.id
      ? await prisma.calendarEvent.update({
        where: { id: values.id },
        data: payload,
      })
      : await prisma.calendarEvent.create({ data: payload });

    revalidateCalendarPaths();
    redirectPath = `/admin/calendrier/${savedEvent.id}?saved=1`;
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`${buildCalendarEventPath(id)}?error=${message}`);
  }

  redirect(redirectPath);
}

export async function deleteCalendarEvent(formData: FormData) {
  await requireAdministratorSession("/admin/calendrier");

  const id = getStringValue(formData, "id");

  if (!id) {
    redirect("/admin/calendrier?error=missing-id");
  }

  try {
    await prisma.calendarEvent.delete({ where: { id } });
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`/admin/calendrier?error=${message}`);
  }

  revalidateCalendarPaths();
  redirect("/admin/calendrier?deleted=1");
}

export async function toggleCalendarEventPublication(formData: FormData) {
  await requireAdministratorSession("/admin/calendrier");

  const id = getStringValue(formData, "id");
  const published = getBooleanValue(formData, "published");

  if (!id) {
    redirect("/admin/calendrier?error=missing-id");
  }

  try {
    await prisma.calendarEvent.update({
      where: { id },
      data: { published },
    });
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`/admin/calendrier?error=${message}`);
  }

  revalidateCalendarPaths();
  redirect("/admin/calendrier?published=1");
}

function revalidateCalendarPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/calendrier");
  revalidatePath("/calendrier");
  revalidatePath("/competitions");
}
