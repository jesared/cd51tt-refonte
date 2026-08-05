"use server";

import {
  DocumentResourceStatus,
  Prisma,
  type DocumentResource,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { uploadFileToCloudinary } from "@/lib/cloudinary";
import { formatFrenchMonthYear, type DocumentCardItem } from "@/lib/documents";
import { documents } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

const documentFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(6, "Le titre doit contenir au moins 6 caracteres."),
  category: z.string().trim().min(2, "La categorie est requise."),
  format: z.string().trim().min(2, "Le format est requis."),
  description: z
    .string()
    .trim()
    .min(20, "La description doit contenir au moins 20 caracteres."),
  fileUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || value.startsWith("/") || URL.canParse(value),
      "Indiquez une URL valide ou un chemin interne commençant par /.",
    ),
  status: z.nativeEnum(DocumentResourceStatus),
  updatedAt: z.string().trim().optional(),
});

function buildDocumentPath(documentId?: string) {
  return documentId
    ? `/admin/documents/${documentId}`
    : "/admin/documents/nouveau";
}

function getStringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getBooleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function toUpdatedDate(rawDate: string) {
  if (!rawDate) {
    return new Date();
  }

  const parsedDate = new Date(`${rawDate}T12:00:00`);

  return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
}

function isDocumentsTableMissingError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  );
}

function serializeErrorMessage(error: unknown) {
  if (isDocumentsTableMissingError(error)) {
    return "La table des documents n'existe pas encore. Lancez d'abord prisma db push.";
  }

  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Le formulaire contient des erreurs.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue.";
}

const hasDocumentResourceTable = cache(async () => {
  try {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>(Prisma.sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'DocumentResource'
      ) AS "exists"
    `);

    return rows[0]?.exists ?? false;
  } catch {
    return false;
  }
});

function toDocumentCard(document: DocumentResource): DocumentCardItem {
  return {
    title: document.title,
    category: document.category,
    format: document.format,
    updatedAt: formatFrenchMonthYear(document.updatedAt),
    description: document.description,
    href: document.fileUrl,
  };
}

export async function getAdminDocuments() {
  if (!(await hasDocumentResourceTable())) {
    return [];
  }

  try {
    return await prisma.documentResource.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    if (isDocumentsTableMissingError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getAdminDocumentById(id: string) {
  if (!(await hasDocumentResourceTable())) {
    return null;
  }

  try {
    return await prisma.documentResource.findUnique({
      where: { id },
    });
  } catch (error) {
    if (isDocumentsTableMissingError(error)) {
      return null;
    }

    throw error;
  }
}

export async function getPublishedDocumentCards() {
  if (!(await hasDocumentResourceTable())) {
    return null;
  }

  try {
    const entries = await prisma.documentResource.findMany({
      where: { status: DocumentResourceStatus.PUBLISHED },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    });

    if (entries.length === 0) {
      return null;
    }

    return entries.map(toDocumentCard);
  } catch {
    return null;
  }
}

export async function saveDocument(formData: FormData) {
  await requireAdminSession();

  const id = getStringValue(formData, "id") || undefined;
  const status = getBooleanValue(formData, "published")
    ? DocumentResourceStatus.PUBLISHED
    : DocumentResourceStatus.DRAFT;

  try {
    const uploadedFileUrl = await uploadFileToCloudinary(
      formData.get("fileUpload") as File | null,
      "document",
    );
    const fileUrl = uploadedFileUrl ?? getStringValue(formData, "fileUrl");

    const values = documentFormSchema.parse({
      id,
      title: getStringValue(formData, "title"),
      category: getStringValue(formData, "category"),
      format: getStringValue(formData, "format"),
      description: getStringValue(formData, "description"),
      fileUrl,
      status,
      updatedAt: getStringValue(formData, "updatedAt"),
    });

    if (!values.fileUrl) {
      throw new Error("Ajoutez un fichier ou indiquez un lien.");
    }

    const payload = {
      title: values.title,
      category: values.category,
      format: values.format,
      description: values.description,
      fileUrl: values.fileUrl,
      status: values.status,
      updatedAt: toUpdatedDate(values.updatedAt ?? ""),
    };

    if (values.id) {
      await prisma.documentResource.update({
        where: { id: values.id },
        data: payload,
      });
    } else {
      await prisma.documentResource.create({
        data: payload,
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/documents");
    revalidatePath("/documents");
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`${buildDocumentPath(id)}?error=${message}`);
  }

  redirect("/admin/documents?saved=1");
}

export async function deleteDocument(formData: FormData) {
  await requireAdminSession();

  const id = getStringValue(formData, "id");

  if (!id) {
    redirect("/admin/documents?error=missing-id");
  }

  try {
    await prisma.documentResource.delete({
      where: { id },
    });
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`/admin/documents?error=${message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/documents");
  revalidatePath("/documents");

  redirect("/admin/documents?deleted=1");
}

export async function seedMockDocuments() {
  await requireAdminSession();

  if (!(await hasDocumentResourceTable())) {
    redirect(
      "/admin/documents?error=La table des documents n'existe pas encore. Lancez d'abord prisma db push.",
    );
  }

  if ((await prisma.documentResource.count()) > 0) {
    redirect("/admin/documents?seeded=0");
  }

  await prisma.documentResource.createMany({
    data: documents.map((document) => ({
      title: document.title,
      category: document.category,
      format: document.format,
      description: document.description,
      fileUrl: document.href ?? "#",
      status: DocumentResourceStatus.PUBLISHED,
    })),
    skipDuplicates: false,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/documents");
  revalidatePath("/documents");

  redirect("/admin/documents?seeded=1");
}
