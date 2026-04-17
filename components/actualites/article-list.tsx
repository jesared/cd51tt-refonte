import { ArrowUpRight, Sparkles } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Article } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ArticleListProps = {
  articles: Article[];
};

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {articles.map((article) => (
        <SectionCard
          key={article.slug}
          title={article.title}
          description={article.excerpt}
          className={cn(
            "overflow-hidden",
            article.featured ? "lg:col-span-2" : undefined,
          )}
        >
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge variant={article.featured ? "default" : "secondary"}>
              {article.category}
            </Badge>
            <span>{article.date}</span>
            <span>{article.readTime}</span>
            {article.featured ? (
              <span className="flex items-center gap-1 text-primary">
                <Sparkles className="size-3.5" />
                À la une
              </span>
            ) : null}
          </div>
          <div className="mt-5">
            <a
              href="#"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Lire l&apos;article
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
