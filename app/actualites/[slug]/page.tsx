import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedNewsArticleBySlug } from "@/lib/admin-news";
import { createPageMetadata } from "@/lib/metadata";
import { newsArticles } from "@/lib/mock-data";
import type { ArticleDetailItem } from "@/lib/news";
import { cn } from "@/lib/utils";

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

function getMockArticleBySlug(slug: string): ArticleDetailItem | null {
  const article = newsArticles.find((item) => item.slug === slug);

  if (!article) {
    return null;
  }

  return {
    ...article,
    content: article.excerpt,
  };
}

async function getArticle(slug: string) {
  const databaseArticle = await getPublishedNewsArticleBySlug(slug);

  return databaseArticle ?? getMockArticleBySlug(slug);
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    return createPageMetadata({
      title: "Actualite introuvable",
      description: "Cette actualite n'est pas disponible.",
      path: `/actualites/${params.slug}`,
    });
  }

  return createPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/actualites/${article.slug}`,
  });
}

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const paragraphs = article.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <Link
        href="/actualites"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-3")}
      >
        <ArrowLeft className="size-4" />
        Retour aux actualites
      </Link>

      <header className="space-y-5 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge>{article.category}</Badge>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {article.date}
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
      </header>

      <div className="space-y-5 text-base leading-8 text-foreground">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
