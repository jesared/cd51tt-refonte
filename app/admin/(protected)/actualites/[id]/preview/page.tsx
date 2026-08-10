import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Edit3, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getAdminNewsArticleById } from "@/lib/admin-news";
import { createPageMetadata } from "@/lib/metadata";
import { formatFrenchDate } from "@/lib/news";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "Prévisualisation actualité",
  description: "Aperçu d'une actualité avant publication.",
  path: "/admin/actualites/[id]/preview",
});

type AdminArticlePreviewPageProps = {
  params: {
    id: string;
  };
};

export default async function AdminArticlePreviewPage({
  params,
}: AdminArticlePreviewPageProps) {
  const article = await getAdminNewsArticleById(params.id);

  if (!article) {
    notFound();
  }

  const paragraphs = article.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const publicHref =
    article.status === "PUBLISHED" ? `/actualites/${article.slug}` : null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-[1.5rem] border border-primary/20 bg-primary/10 p-4 text-sm text-primary lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-medium">Prévisualisation back-office</p>
          <p className="mt-1 text-primary/80">
            Cet aperçu reste accessible à l’administration, même si l’actualité
            est encore en brouillon.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {publicHref ? (
            <Link
              href={publicHref}
              target="_blank"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-background px-4 text-sm font-medium text-primary transition hover:bg-primary/10"
            >
              <ExternalLink className="size-4" />
              Voir sur le site
            </Link>
          ) : null}
          <Link
            href={`/admin/actualites/${article.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-background px-4 text-sm font-medium text-primary transition hover:bg-primary/10"
          >
            <Edit3 className="size-4" />
            Modifier
          </Link>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-8">
        <Link
          href={`/admin/actualites/${article.id}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-3",
          )}
        >
          <ArrowLeft className="size-4" />
          Retour à l’édition
        </Link>

        <header className="space-y-5 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge>{article.category}</Badge>
            <Badge variant={article.status === "PUBLISHED" ? "secondary" : "outline"}>
              {article.status === "PUBLISHED" ? "Publié" : "Brouillon"}
            </Badge>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatFrenchDate(article.publishedAt ?? article.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" />
              {article.readTime}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {article.title}
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              {article.excerpt}
            </p>
          </div>

          {article.imageUrl ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
              <Image
                src={article.imageUrl}
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 48rem, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </header>

        <div className="space-y-5 text-base leading-8 text-foreground">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
