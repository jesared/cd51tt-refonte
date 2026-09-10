"use server";

import { Prisma, type ClubResource } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

import { requireAdministratorSession } from "@/lib/admin-auth";
import { recordAdminActivity } from "@/lib/admin-activity";
import { ffttApiReadiness, ffttClient } from "@/lib/fftt/client";
import { clubs, type Club } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

const clubFormSchema = z.object({
  id: z.string().optional(),
  ffttId: z.string().trim().optional(),
  name: z.string().trim().min(2, "Le nom est requis."),
  city: z.string().trim().min(2, "La ville est requise."),
  venue: z.string().trim().min(2, "La salle est requise."),
  audience: z.string().trim().min(2, "Le public est requis."),
  tables: z.coerce.number().int().min(0, "Le nombre de tables est invalide."),
  contact: z.string().trim().min(2, "Le contact est requis."),
  active: z.boolean(),
});

function getStringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getBooleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function buildClubPath(id?: string) {
  return id ? `/admin/clubs/${id}` : "/admin/clubs/nouveau";
}

function isClubTableMissingError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  );
}

function serializeErrorMessage(error: unknown) {
  if (isClubTableMissingError(error)) {
    return "La table des clubs n'existe pas encore. Lancez prisma db push.";
  }

  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Le formulaire contient des erreurs.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue.";
}

const hasClubTable = cache(async () => {
  try {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>(Prisma.sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'ClubResource'
      ) AS "exists"
    `);

    return rows[0]?.exists ?? false;
  } catch {
    return false;
  }
});

function toClub(resource: ClubResource): Club {
  return {
    name: resource.name,
    city: resource.city,
    venue: resource.venue,
    audience: resource.audience,
    tables: resource.tables,
    contact: resource.contact,
  };
}

export async function getAdminClubs(): Promise<ClubResource[]> {
  if (!(await hasClubTable())) {
    return [];
  }

  try {
    return await prisma.clubResource.findMany({
      orderBy: [{ city: "asc" }, { name: "asc" }],
    });
  } catch (error) {
    if (isClubTableMissingError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getAdminClubById(id: string): Promise<ClubResource | null> {
  if (!(await hasClubTable())) {
    return null;
  }

  return prisma.clubResource.findUnique({ where: { id } });
}

export async function getPublicClubs(): Promise<Club[] | null> {
  if (!(await hasClubTable())) {
    return null;
  }

  try {
    const entries = await prisma.clubResource.findMany({
      where: { active: true },
      orderBy: [{ city: "asc" }, { name: "asc" }],
    });

    return entries.map(toClub);
  } catch {
    return null;
  }
}

export async function saveClub(formData: FormData) {
  const session = await requireAdministratorSession("/admin/clubs");

  const id = getStringValue(formData, "id") || undefined;
  let redirectPath = "/admin/clubs";

  try {
    const values = clubFormSchema.parse({
      id,
      ffttId: getStringValue(formData, "ffttId") || undefined,
      name: getStringValue(formData, "name"),
      city: getStringValue(formData, "city"),
      venue: getStringValue(formData, "venue"),
      audience: getStringValue(formData, "audience"),
      tables: getStringValue(formData, "tables") || "0",
      contact: getStringValue(formData, "contact"),
      active: getBooleanValue(formData, "active"),
    });

    const payload = {
      ffttId: values.ffttId || null,
      name: values.name,
      city: values.city,
      venue: values.venue,
      audience: values.audience,
      tables: values.tables,
      contact: values.contact,
      active: values.active,
    };

    const savedClub = values.id
      ? await prisma.clubResource.update({
        where: { id: values.id },
        data: payload,
      })
      : await prisma.clubResource.create({ data: payload });

    await recordAdminActivity({
      session,
      action: values.id ? "update" : "create",
      entityType: "club",
      entityId: savedClub.id,
      entityLabel: savedClub.name,
      message: `${session.name} a ${
        values.id ? "modifié" : "créé"
      } le club ${savedClub.name}.`,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/clubs");
    revalidatePath("/clubs");
    revalidatePath("/");
    redirectPath = `/admin/clubs/${savedClub.id}?saved=1`;
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`${buildClubPath(id)}?error=${message}`);
  }

  redirect(redirectPath);
}

export async function deleteClub(formData: FormData) {
  const session = await requireAdministratorSession("/admin/clubs");

  const id = getStringValue(formData, "id");

  if (!id) {
    redirect("/admin/clubs?error=Identifiant%20manquant.");
  }

  try {
    const deletedClub = await prisma.clubResource.delete({ where: { id } });

    await recordAdminActivity({
      session,
      action: "delete",
      entityType: "club",
      entityId: deletedClub.id,
      entityLabel: deletedClub.name,
      message: `${session.name} a supprimé le club ${deletedClub.name}.`,
    });
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`/admin/clubs?error=${message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/clubs");
  revalidatePath("/clubs");
  revalidatePath("/");

  redirect("/admin/clubs?deleted=1");
}

export async function syncFfttClubs() {
  const session = await requireAdministratorSession("/admin/clubs");

  if (!(await hasClubTable())) {
    redirect(
      "/admin/clubs?error=La%20table%20des%20clubs%20n'existe%20pas%20encore.%20Lancez%20prisma%20db%20push.",
    );
  }

  let syncedCount = 0;
  let source = ffttApiReadiness.hasAppCredentials ? "fftt" : "mock";

  try {
    const records = await ffttClient.getClubs();
    syncedCount = records.length;
    source = records.every((record) => record.id.startsWith("mock-club-"))
      ? "mock"
      : "fftt";

    for (let index = 0; index < records.length; index += 1) {
      const record = records[index];
      const fallback = clubs[index];
      const payload = {
        ffttId: record.id,
        name: record.name,
        city: record.city,
        venue: record.venue ?? fallback?.venue ?? "Salle à compléter",
        audience: record.audience ?? fallback?.audience ?? "Tout public",
        tables: record.tables ?? fallback?.tables ?? 0,
        contact: record.contact ?? fallback?.contact ?? "contact@cd51tt.fr",
        active: true,
      };

      await prisma.clubResource.upsert({
        where: { ffttId: record.id },
        update: payload,
        create: payload,
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/clubs");
    revalidatePath("/clubs");
    revalidatePath("/");

    await recordAdminActivity({
      session,
      action: "update",
      entityType: "club",
      entityLabel: "Synchronisation FFTT clubs",
      message: `${session.name} a synchronisé ${syncedCount} clubs depuis ${
        source === "fftt" ? "la FFTT" : "la source locale"
      }.`,
    });
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`/admin/clubs?error=${message}`);
  }

  redirect(`/admin/clubs?fftt=${syncedCount}&source=${source}`);
}
