import { Newspaper } from "lucide-react";

import { ArticleList } from "@/components/actualites/article-list";
import { Badge } from "@/components/ui/badge";
import { getPublishedNewsArticleCards } from "@/lib/admin-news";
import { createPageMetadata } from "@/lib/metadata";
import { newsArticles } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Actualités",
  description:
    "Les dernières actualités du Comité Marne de tennis de table.",
  path: "/actualites",
});

export default async function ActualitesPage() {
  const publishedArticles = await getPublishedNewsArticleCards();
  const articles = publishedArticles ?? newsArticles;
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
          <Badge variant="secondary">{articles.length} publications</Badge>
          {categories.slice(0, 4).map((category) => (
            <Badge key={category} variant="outline">
              {category}
            </Badge>
          ))}
        </div>
      </section>

      <ArticleList articles={articles} />
    </div>
  );
}
