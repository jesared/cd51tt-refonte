"use server";

import {
  Prisma,
  type CommitteeMemberResource,
  type TechnicalStaffMemberResource,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import {
  actualCommitteeMembers,
  technicalStaffMembers,
  type CommitteeMember,
  type TechnicalStaffMember,
} from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

type PeopleKind = "committee" | "technical";

const peopleFormSchema = z.object({
  id: z.string().optional(),
  kind: z.enum(["committee", "technical"]),
  name: z.string().trim().min(2, "Le nom est requis."),
  role: z.string().trim().optional(),
  initials: z.string().trim().min(1, "Les initiales sont requises."),
  mission: z.string().trim().optional(),
  area: z.string().trim().optional(),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || value.startsWith("/") || URL.canParse(value),
      "Indiquez une URL d'image valide ou un chemin interne commençant par /.",
    ),
  sortOrder: z.coerce.number().int().min(0).default(0),
  active: z.boolean(),
});

function getStringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getBooleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function buildPeoplePath(kind: PeopleKind, id?: string) {
  const base =
    kind === "committee" ? "/admin/comite" : "/admin/cadres-techniques";

  return id ? `${base}/${id}` : `${base}/nouveau`;
}

function getListPath(kind: PeopleKind) {
  return kind === "committee" ? "/admin/comite" : "/admin/cadres-techniques";
}

function isTableMissingError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  );
}

function serializeErrorMessage(error: unknown, label: string) {
  if (isTableMissingError(error)) {
    return `La table ${label} n'existe pas encore. Lancez prisma db push.`;
  }

  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Le formulaire contient des erreurs.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue.";
}

async function hasTable(tableName: string) {
  try {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>(Prisma.sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = ${tableName}
      ) AS "exists"
    `);

    return rows[0]?.exists ?? false;
  } catch {
    return false;
  }
}

const hasCommitteeMemberTable = cache(() =>
  hasTable("CommitteeMemberResource"),
);

const hasTechnicalStaffTable = cache(() =>
  hasTable("TechnicalStaffMemberResource"),
);

function toCommitteeMember(
  member: CommitteeMemberResource,
): CommitteeMember {
  return {
    name: member.name,
    role: member.role,
    initials: member.initials,
    mission: member.mission,
    area: member.area,
    imageUrl: member.imageUrl,
  };
}

function toTechnicalStaffMember(
  member: TechnicalStaffMemberResource,
): TechnicalStaffMember {
  return {
    name: member.name,
    role: member.role ?? undefined,
    initials: member.initials,
    mission: member.mission ?? undefined,
    area: member.area ?? undefined,
    imageUrl: member.imageUrl,
  };
}

export async function getAdminCommitteeMembers(): Promise<
  CommitteeMemberResource[]
> {
  if (!(await hasCommitteeMemberTable())) {
    return [];
  }

  try {
    return await prisma.committeeMemberResource.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch (error) {
    if (isTableMissingError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getAdminTechnicalStaffMembers(): Promise<
  TechnicalStaffMemberResource[]
> {
  if (!(await hasTechnicalStaffTable())) {
    return [];
  }

  try {
    return await prisma.technicalStaffMemberResource.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  } catch (error) {
    if (isTableMissingError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getAdminCommitteeMemberById(
  id: string,
): Promise<CommitteeMemberResource | null> {
  if (!(await hasCommitteeMemberTable())) {
    return null;
  }

  return prisma.committeeMemberResource.findUnique({ where: { id } });
}

export async function getAdminTechnicalStaffMemberById(
  id: string,
): Promise<TechnicalStaffMemberResource | null> {
  if (!(await hasTechnicalStaffTable())) {
    return null;
  }

  return prisma.technicalStaffMemberResource.findUnique({ where: { id } });
}

export async function getPublicCommitteeMembers(): Promise<
  CommitteeMember[] | null
> {
  if (!(await hasCommitteeMemberTable())) {
    return null;
  }

  try {
    const members = await prisma.committeeMemberResource.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return members.length ? members.map(toCommitteeMember) : null;
  } catch {
    return null;
  }
}

export async function getPublicTechnicalStaffMembers(): Promise<
  TechnicalStaffMember[] | null
> {
  if (!(await hasTechnicalStaffTable())) {
    return null;
  }

  try {
    const members = await prisma.technicalStaffMemberResource.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return members.length ? members.map(toTechnicalStaffMember) : null;
  } catch {
    return null;
  }
}

export async function savePeopleMember(formData: FormData) {
  await requireAdminSession();

  const rawKind = getStringValue(formData, "kind") as PeopleKind;
  const id = getStringValue(formData, "id") || undefined;
  const kind: PeopleKind = rawKind === "technical" ? "technical" : "committee";
  let redirectPath = getListPath(kind);

  try {
    const uploadedImageUrl = await uploadFileToCloudinary(
      formData.get("imageUpload") as File | null,
      "image",
    );
    const imageUrl = uploadedImageUrl ?? getStringValue(formData, "imageUrl");

    const values = peopleFormSchema.parse({
      id,
      kind,
      name: getStringValue(formData, "name"),
      role: getStringValue(formData, "role") || undefined,
      initials: getStringValue(formData, "initials"),
      mission: getStringValue(formData, "mission") || undefined,
      area: getStringValue(formData, "area") || undefined,
      imageUrl: imageUrl || undefined,
      sortOrder: getStringValue(formData, "sortOrder") || "0",
      active: getBooleanValue(formData, "active"),
    });

    if (values.kind === "committee") {
      const payload = {
        name: values.name,
        role: values.role ?? "Membre du comité",
        initials: values.initials,
        mission: values.mission ?? "",
        area: values.area ?? "Comité",
        imageUrl: values.imageUrl || null,
        sortOrder: values.sortOrder,
        active: values.active,
      };

      const savedMember = values.id
        ? await prisma.committeeMemberResource.update({
          where: { id: values.id },
          data: payload,
        })
        : await prisma.committeeMemberResource.create({ data: payload });
      redirectPath = `${buildPeoplePath(values.kind, savedMember.id)}?saved=1`;
    } else {
      const payload = {
        name: values.name,
        role: values.role || null,
        initials: values.initials,
        mission: values.mission || null,
        area: values.area || null,
        imageUrl: values.imageUrl || null,
        sortOrder: values.sortOrder,
        active: values.active,
      };

      const savedMember = values.id
        ? await prisma.technicalStaffMemberResource.update({
          where: { id: values.id },
          data: payload,
        })
        : await prisma.technicalStaffMemberResource.create({ data: payload });
      redirectPath = `${buildPeoplePath(values.kind, savedMember.id)}?saved=1`;
    }

    revalidatePath("/admin");
    revalidatePath(getListPath(values.kind));
    revalidatePath("/comite");
    revalidatePath("/cadres-techniques");
  } catch (error) {
    const label =
      kind === "committee"
        ? "des membres du comité"
        : "des cadres techniques";
    const message = encodeURIComponent(serializeErrorMessage(error, label));
    redirect(`${buildPeoplePath(kind, id)}?error=${message}`);
  }

  redirect(redirectPath);
}

export async function deletePeopleMember(formData: FormData) {
  await requireAdminSession();

  const kind = getStringValue(formData, "kind") as PeopleKind;
  const id = getStringValue(formData, "id");
  const safeKind: PeopleKind = kind === "technical" ? "technical" : "committee";

  if (!id) {
    redirect(`${getListPath(safeKind)}?error=Identifiant%20manquant.`);
  }

  try {
    if (safeKind === "committee") {
      await prisma.committeeMemberResource.delete({ where: { id } });
    } else {
      await prisma.technicalStaffMemberResource.delete({ where: { id } });
    }
  } catch (error) {
    const label =
      safeKind === "committee"
        ? "des membres du comité"
        : "des cadres techniques";
    const message = encodeURIComponent(serializeErrorMessage(error, label));
    redirect(`${getListPath(safeKind)}?error=${message}`);
  }

  revalidatePath("/admin");
  revalidatePath(getListPath(safeKind));
  revalidatePath("/comite");
  revalidatePath("/cadres-techniques");

  redirect(`${getListPath(safeKind)}?deleted=1`);
}

export async function seedCommitteeMembers() {
  await requireAdminSession();

  if (!(await hasCommitteeMemberTable())) {
    redirect(
      "/admin/comite?error=La%20table%20des%20membres%20n'existe%20pas%20encore.%20Lancez%20prisma%20db%20push.",
    );
  }

  if ((await prisma.committeeMemberResource.count()) > 0) {
    redirect("/admin/comite?seeded=0");
  }

  await prisma.committeeMemberResource.createMany({
    data: actualCommitteeMembers.map((member, index) => ({
      name: member.name,
      role: member.role,
      initials: member.initials,
      mission: member.mission,
      area: member.area,
      imageUrl: member.imageUrl ?? null,
      sortOrder: index + 1,
      active: true,
    })),
  });

  revalidatePath("/admin/comite");
  revalidatePath("/comite");

  redirect("/admin/comite?seeded=1");
}

export async function seedTechnicalStaffMembers() {
  await requireAdminSession();

  if (!(await hasTechnicalStaffTable())) {
    redirect(
      "/admin/cadres-techniques?error=La%20table%20des%20cadres%20n'existe%20pas%20encore.%20Lancez%20prisma%20db%20push.",
    );
  }

  if ((await prisma.technicalStaffMemberResource.count()) > 0) {
    redirect("/admin/cadres-techniques?seeded=0");
  }

  await prisma.technicalStaffMemberResource.createMany({
    data: technicalStaffMembers.map((member, index) => ({
      name: member.name,
      role: member.role ?? null,
      initials: member.initials,
      mission: member.mission ?? null,
      area: member.area ?? null,
      imageUrl: member.imageUrl ?? null,
      sortOrder: index + 1,
      active: true,
    })),
  });

  revalidatePath("/admin/cadres-techniques");
  revalidatePath("/cadres-techniques");

  redirect("/admin/cadres-techniques?seeded=1");
}
