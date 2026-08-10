"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Sparkles, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { ArticleCardItem } from "@/lib/news";
import { cn } from "@/lib/utils";

type ArticleListProps = {
  articles: ArticleCardItem[];
};

const ALL_CATEGORIES = "all";

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function ArticleRow({ article }: { article: ArticleCardItem }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className={cn(
        "group grid gap-4 p-5 transition-colors hover:bg-accent sm:items-center",
        article.imageUrl
          ? "sm:grid-cols-[8rem_minmax(0,1fr)_auto]"
          : "sm:grid-cols-[minmax(0,1fr)_auto]",
        article.featured ? "bg-accent/50" : undefined,
      )}
    >
      {article.imageUrl ? (
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
          <Image
            src={article.imageUrl}
            alt=""
            fill
            sizes="(min-width: 640px) 8rem, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : null}

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary">{article.category}</Badge>
          <span>{article.date}</span>
          <span>{article.readTime}</span>
          {article.featured ? (
            <span className="flex items-center gap-1 text-primary">
              <Sparkles className="size-3.5" />
              À la une
            </span>
          ) : null}
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
  );
}

export function ArticleList({ articles }: ArticleListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);

  const categories = useMemo(
    () => Array.from(new Set(articles.map((article) => article.category))).sort(),
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(searchQuery.trim());

    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === ALL_CATEGORIES ||
        article.category === selectedCategory;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        normalizeSearchValue(
          `${article.title} ${article.excerpt} ${article.category} ${article.date}`,
        ).includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [articles, searchQuery, selectedCategory]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedCategory !== ALL_CATEGORIES;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(ALL_CATEGORIES);
  };

  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-sm text-muted-foreground">
        Aucune actualité publiée pour le moment.
      </div>
    );
  }

  const featuredArticle = filteredArticles.find((article) => article.featured);
  const otherArticles = featuredArticle
    ? filteredArticles.filter((article) => article.slug !== featuredArticle.slug)
    : filteredArticles;

  return (
    <div className="space-y-5">
      <section className="space-y-4">
        <div className="grid gap-3 rounded-lg border border-border bg-card p-3 lg:grid-cols-[minmax(260px,1fr)_minmax(14rem,0.35fr)_auto] lg:items-end">
          <label className="grid gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Recherche
            </span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Titre, catégorie ou contenu"
                className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 pl-9 pr-9 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Effacer la recherche"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </span>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Catégorie
            </span>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50"
            >
              <option value={ALL_CATEGORIES}>Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <div className="flex min-h-10 flex-wrap items-center gap-2 lg:justify-end">
            <span className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium">
              {filteredArticles.length} sur {articles.length}
            </span>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className={cn(buttonVariants({ variant: "ghost" }), "h-10")}
              >
                Réinitialiser
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory(ALL_CATEGORIES)}
            className={cn(
              "inline-flex h-8 items-center rounded-lg border px-3 text-sm font-medium transition-colors",
              selectedCategory === ALL_CATEGORIES
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            Toutes
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "inline-flex h-8 items-center rounded-lg border px-3 text-sm font-medium transition-colors",
                selectedCategory === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {filteredArticles.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-sm text-muted-foreground">
          Aucune actualité ne correspond à cette recherche.
          <button
            type="button"
            onClick={resetFilters}
            className="ml-2 font-medium text-primary underline-offset-4 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : null}

      {featuredArticle ? (
        <Link
          href={`/actualites/${featuredArticle.slug}`}
          className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/45 hover:bg-accent"
        >
          {featuredArticle.imageUrl ? (
            <div className="relative aspect-[16/9] bg-muted">
              <Image
                src={featuredArticle.imageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 56rem, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          ) : null}

          <div className="p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge>{featuredArticle.category}</Badge>
              <span>{featuredArticle.date}</span>
              <span>{featuredArticle.readTime}</span>
              <span className="flex items-center gap-1 text-primary">
                <Sparkles className="size-3.5" />
                À la une
              </span>
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
          </div>
        </Link>
      ) : null}

      {otherArticles.length > 0 ? (
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {otherArticles.map((article) => (
            <ArticleRow key={article.slug} article={article} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
