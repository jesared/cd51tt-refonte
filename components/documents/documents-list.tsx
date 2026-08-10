"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, FileText, Mail, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { DocumentCardItem } from "@/lib/documents";
import { cn } from "@/lib/utils";

type DocumentsListProps = {
  documents: DocumentCardItem[];
};

const collator = new Intl.Collator("fr", {
  sensitivity: "base",
  numeric: true,
});

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function slugifyCategory(value: string) {
  return normalizeSearchValue(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function DocumentsList({ documents }: DocumentsListProps) {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("categorie");
  const categories = useMemo(
    () =>
      Array.from(new Set(documents.map((document) => document.category))).sort(
        (a, b) => collator.compare(a, b),
      ),
    [documents],
  );
  const initialCategory = useMemo(() => {
    if (!requestedCategory) {
      return "all";
    }

    return (
      categories.find(
        (category) => slugifyCategory(category) === requestedCategory,
      ) ?? "all"
    );
  }, [categories, requestedCategory]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const normalizedQuery = normalizeSearchValue(query);
  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const matchesCategory =
        categoryFilter === "all" || document.category === categoryFilter;
      const searchable = normalizeSearchValue(
        [
          document.title,
          document.category,
          document.format,
          document.updatedAt,
          document.description,
        ].join(" "),
      );
      const matchesQuery =
        normalizedQuery.length === 0 || searchable.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [categoryFilter, documents, normalizedQuery]);
  const hasActiveFilters = query.length > 0 || categoryFilter !== "all";

  if (documents.length === 0) {
    return (
      <section className="grid gap-5 rounded-lg border border-border bg-card p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Aucun document publié
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            La base documentaire est vide pour le moment. Vous pouvez contacter
            le comité pour demander un formulaire ou revenir plus tard.
          </p>
        </div>
        <a
          href="/contact"
          className={buttonVariants({ variant: "default", size: "lg" })}
        >
          Contacter le comité
          <Mail className="size-4" />
        </a>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-border bg-card p-3 lg:grid-cols-[minmax(260px,1fr)_minmax(14rem,0.35fr)_auto] lg:items-end">
        <label className="grid gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Recherche
          </span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Document, catégorie ou mot-clé"
              className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 pl-9 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
            />
          </span>
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Catégorie
          </span>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <div className="flex min-h-10 flex-wrap items-center gap-2 lg:justify-end">
          <span className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium">
            {filteredDocuments.length} sur {documents.length}
          </span>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategoryFilter("all");
              }}
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
          onClick={() => setCategoryFilter("all")}
          className={cn(
            "inline-flex h-8 items-center rounded-lg border px-3 text-sm font-medium transition-colors",
            categoryFilter === "all"
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
            onClick={() => setCategoryFilter(category)}
            className={cn(
              "inline-flex h-8 items-center rounded-lg border px-3 text-sm font-medium transition-colors",
              categoryFilter === category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-sm leading-6 text-muted-foreground">
          Aucun document ne correspond à cette recherche.
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {filteredDocuments.map((document) => (
            <article
              key={document.title}
              className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{document.category}</Badge>
                  <Badge variant="outline">{document.format}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Mis à jour : {document.updatedAt}
                  </span>
                </div>
                <div className="mt-4 flex items-start gap-3">
                  <div className="rounded-md border border-border bg-background p-2 text-primary">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">
                      {document.title}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {document.description}
                    </p>
                  </div>
                </div>
              </div>

              {document.href && document.href !== "#" ? (
                <a
                  href={document.href}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Télécharger
                  <Download className="size-4" />
                </a>
              ) : (
                <span className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm text-muted-foreground">
                  Fichier à ajouter
                </span>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
