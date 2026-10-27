export type ArticleCardItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  targetUrl?: string | null;
  imageUrl?: string | null;
  attachments?: NewsArticleAttachment[];
  date: string;
  readTime: string;
  featured?: boolean;
};

export type NewsArticleAttachment = {
  name: string;
  url: string;
};

export function parseNewsArticleAttachments(value: unknown): NewsArticleAttachment[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (attachment): attachment is NewsArticleAttachment =>
      typeof attachment === "object" &&
      attachment !== null &&
      "name" in attachment &&
      typeof attachment.name === "string" &&
      "url" in attachment &&
      typeof attachment.url === "string" &&
      Boolean(attachment.name.trim()) &&
      Boolean(attachment.url.trim()),
  );
}

export type ArticleDetailItem = ArticleCardItem & {
  content: string;
};

export function formatFrenchDate(date: Date | string | null | undefined) {
  if (!date) {
    return "A definir";
  }

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(parsedDate.getTime())) {
    return "A definir";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(parsedDate);
}

export function slugifyArticleTitle(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
