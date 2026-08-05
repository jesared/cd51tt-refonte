"use server";

import { NewsArticleStatus, Prisma, type NewsArticle } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { formatFrenchDate, slugifyArticleTitle, type ArticleCardItem } from "@/lib/news";
import { newsArticles } from "@/lib/mock-data";

const articleFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(6, "Le titre doit contenir au moins 6 caracteres."),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().min(20, "L'extrait doit contenir au moins 20 caracteres."),
  content: z.string().trim().min(40, "Le contenu doit contenir au moins 40 caracteres."),
  category: z.string().trim().min(2, "La categorie est requise."),
  status: z.nativeEnum(NewsArticleStatus),
  featured: z.boolean(),
  publishedAt: z.string().trim().optional(),
});

function buildArticlePath(articleId?: string) {
  return articleId ? `/admin/actualites/${articleId}` : "/admin/actualites/nouveau";
}

function getStringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getBooleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function toPublishedDate(rawDate: string, status: NewsArticleStatus) {
  if (!rawDate && status === NewsArticleStatus.PUBLISHED) {
    return new Date();
  }

  if (!rawDate) {
    return null;
  }

  const parsedDate = new Date(rawDate);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));

  return `${minutes} min`;
}

function parseMockFrenchDate(rawDate: string) {
  const normalizedDate = rawDate
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const match = normalizedDate.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);

  if (!match) {
    return new Date();
  }

  const [, day, monthName, year] = match;
  const monthIndex = [
    "janvier",
    "fevrier",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "aout",
    "septembre",
    "octobre",
    "novembre",
    "decembre",
  ].indexOf(monthName);

  if (monthIndex === -1) {
    return new Date();
  }

  return new Date(Number(year), monthIndex, Number(day), 9, 0, 0);
}

function serializeErrorMessage(error: unknown) {
  if (isNewsTableMissingError(error)) {
    return "La table des actualites n'existe pas encore. Lancez d'abord prisma db push.";
  }

  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Le formulaire contient des erreurs.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue.";
}

function isNewsTableMissingError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021"
  );
}

const hasNewsArticleTable = cache(async () => {
  try {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>(Prisma.sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'NewsArticle'
      ) AS "exists"
    `);

    return rows[0]?.exists ?? false;
  } catch {
    return false;
  }
});

function toArticleCard(article: NewsArticle): ArticleCardItem {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    date: formatFrenchDate(article.publishedAt ?? article.createdAt),
    readTime: article.readTime,
    featured: article.featured,
  };
}

export async function getAdminNewsArticles(): Promise<NewsArticle[]> {
  if (!(await hasNewsArticleTable())) {
    return [];
  }

  try {
    return await prisma.newsArticle.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    if (isNewsTableMissingError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getAdminNewsArticleById(
  id: string,
): Promise<NewsArticle | null> {
  if (!(await hasNewsArticleTable())) {
    return null;
  }

  try {
    return await prisma.newsArticle.findUnique({
      where: { id },
    });
  } catch (error) {
    if (isNewsTableMissingError(error)) {
      return null;
    }

    throw error;
  }
}

export async function getPublishedNewsArticleCards(
  limit?: number,
): Promise<ArticleCardItem[] | null> {
  if (!(await hasNewsArticleTable())) {
    return null;
  }

  try {
    const articles = await prisma.newsArticle.findMany({
      where: {
        status: NewsArticleStatus.PUBLISHED,
      },
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
    });

    if (articles.length === 0) {
      return null;
    }

    return articles.map(toArticleCard);
  } catch {
    return null;
  }
}

export async function saveNewsArticle(formData: FormData) {
  await requireAdminSession();

  const id = getStringValue(formData, "id") || undefined;
  const status = getBooleanValue(formData, "published")
    ? NewsArticleStatus.PUBLISHED
    : NewsArticleStatus.DRAFT;

  try {
    const values = articleFormSchema.parse({
      id,
      title: getStringValue(formData, "title"),
      slug: getStringValue(formData, "slug") || undefined,
      excerpt: getStringValue(formData, "excerpt"),
      content: getStringValue(formData, "content"),
      category: getStringValue(formData, "category"),
      status,
      featured: getBooleanValue(formData, "featured"),
      publishedAt: getStringValue(formData, "publishedAt") || undefined,
    });

    const normalizedSlug = values.slug
      ? slugifyArticleTitle(values.slug)
      : slugifyArticleTitle(values.title);

    if (!normalizedSlug) {
      throw new Error("Le slug genere est vide. Ajustez le titre ou le slug.");
    }

    const payload = {
      title: values.title,
      slug: normalizedSlug,
      excerpt: values.excerpt,
      content: values.content,
      category: values.category,
      readTime: estimateReadTime(values.content),
      status: values.status,
      featured: values.featured,
      publishedAt: toPublishedDate(values.publishedAt ?? "", values.status),
    };

    if (values.id) {
      await prisma.newsArticle.update({
        where: { id: values.id },
        data: payload,
      });
    } else {
      await prisma.newsArticle.create({
        data: payload,
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/actualites");
    revalidatePath("/actualites");
    revalidatePath("/");
  } catch (error) {
    const message = encodeURIComponent(serializeErrorMessage(error));
    redirect(`${buildArticlePath(id)}?error=${message}`);
  }

  redirect("/admin/actualites?saved=1");
}

export async function deleteNewsArticle(formData: FormData) {
  await requireAdminSession();

  const id = getStringValue(formData, "id");

  if (!id) {
    redirect("/admin/actualites?error=missing-id");
  }

  await prisma.newsArticle.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
  revalidatePath("/");

  redirect("/admin/actualites?deleted=1");
}

export async function toggleNewsArticlePublication(formData: FormData) {
  await requireAdminSession();

  const id = getStringValue(formData, "id");
  const nextStatus = getStringValue(formData, "status") as NewsArticleStatus;

  if (!id || !Object.values(NewsArticleStatus).includes(nextStatus)) {
    redirect("/admin/actualites?error=Action%20de%20publication%20invalide.");
  }

  await prisma.newsArticle.update({
    where: { id },
    data: {
      status: nextStatus,
      publishedAt: nextStatus === NewsArticleStatus.PUBLISHED ? new Date() : null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
  revalidatePath("/");

  redirect(
    nextStatus === NewsArticleStatus.PUBLISHED
      ? "/admin/actualites?published=1"
      : "/admin/actualites?unpublished=1",
  );
}

export async function seedMockNewsArticles() {
  await requireAdminSession();

  if ((await prisma.newsArticle.count()) > 0) {
    redirect("/admin/actualites?seeded=0");
  }

  await prisma.newsArticle.createMany({
    data: newsArticles.map((article) => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: `${article.excerpt}\n\nContenu de démonstration à enrichir dans l'administration.`,
      category: article.category,
      readTime: article.readTime,
      featured: Boolean(article.featured),
      status: NewsArticleStatus.PUBLISHED,
      publishedAt: article.date ? parseMockFrenchDate(article.date) : new Date(),
    })),
    skipDuplicates: true,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
  revalidatePath("/");

  redirect("/admin/actualites?seeded=1");
}
