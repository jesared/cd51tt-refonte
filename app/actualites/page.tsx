import { Newspaper } from "lucide-react";

import { ArticleList } from "@/components/actualites/article-list";
import { Badge } from "@/components/ui/badge";
import { getPublishedNewsArticleCards } from "@/lib/admin-news";
import { createPageMetadata } from "@/lib/metadata";
import { getPublicSiteSettings } from "@/lib/site-settings";
import type { ArticleCardItem } from "@/lib/news";

export const metadata = createPageMetadata({
  title: "Actualités",
  description:
    "Les dernières actualités du Comité Marne de tennis de table.",
  path: "/actualites",
});

export const dynamic = "force-dynamic";

export default async function ActualitesPage() {
  const [databaseArticles, settings] = await Promise.all([
    getPublishedNewsArticleCards(),
    getPublicSiteSettings(),
  ]);
  const articles: ArticleCardItem[] = databaseArticles ?? [];
  const facebookLink = settings.socialLinks.find(
    (link) => link.label === "Facebook",
  );
  const categories = Array.from(
    new Set(articles.map((article) => article.category)),
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Newspaper className="size-4" />
            Informations
          </div>
          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Actualités
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Les infos importantes du comité, des clubs et de la saison
              sportive.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {facebookLink ? (
            <a
              href={facebookLink.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-6 items-center rounded-md border border-border px-2.5 text-xs font-medium text-primary transition-colors hover:bg-accent hover:text-foreground"
            >
              Suivre sur Facebook
            </a>
          ) : null}
          <Badge variant="secondary">{articles.length} publications</Badge>
          {categories.slice(0, 4).map((category) => (
            <Badge key={category} variant="outline">
              {category}
            </Badge>
          ))}
        </div>
      </section>

      <ArticleList articles={articles} facebookUrl={facebookLink?.href} />
    </div>
  );
}
