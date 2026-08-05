import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ArticleCardItem } from "@/lib/news";
import { cn } from "@/lib/utils";

type ArticleListProps = {
  articles: ArticleCardItem[];
};

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-sm text-muted-foreground">
        Aucune actualité publiée pour le moment.
      </div>
    );
  }

  const [featuredArticle, ...otherArticles] = articles;

  return (
    <div className="space-y-4">
      <Link
        href="/actualites"
        className="group block rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/45 hover:bg-accent sm:p-7"
      >
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant={featuredArticle.featured ? "default" : "secondary"}>
            {featuredArticle.category}
          </Badge>
          <span>{featuredArticle.date}</span>
          <span>{featuredArticle.readTime}</span>
          {featuredArticle.featured ? (
            <span className="flex items-center gap-1 text-primary">
              <Sparkles className="size-3.5" />
              À la une
            </span>
          ) : null}
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h2 className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
              {featuredArticle.title}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
              {featuredArticle.excerpt}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            Lire
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>

      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {otherArticles.map((article) => (
          <Link
            key={article.slug}
            href="/actualites"
            className={cn(
              "group grid gap-4 p-5 transition-colors hover:bg-accent sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
              article.featured ? "bg-accent/50" : undefined,
            )}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="secondary">{article.category}</Badge>
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-7">
                {article.title}
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {article.excerpt}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              Lire
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
