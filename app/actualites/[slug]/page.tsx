import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedNewsArticleBySlug } from "@/lib/admin-news";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";
import { getFacebookShareUrl } from "@/lib/social";
import { cn } from "@/lib/utils";

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

async function getArticle(slug: string) {
  return getPublishedNewsArticleBySlug(slug);
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
  const articleUrl = new URL(`/actualites/${article.slug}`, siteConfig.url).toString();

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
          <a
            href={getFacebookShareUrl(articleUrl)}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Share2 className="size-4" />
            Partager
          </a>
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
  );
}
