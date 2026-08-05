import { Download, FileText, FolderKanban } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedDocumentCards } from "@/lib/admin-documents";
import { createPageMetadata } from "@/lib/metadata";
import { documents } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Documents",
  description:
    "Guides, règlements et formulaires du Comité Marne de tennis de table.",
  path: "/documents",
});

export default async function DocumentsPage() {
  const publishedDocuments = await getPublishedDocumentCards();
  const library = publishedDocuments ?? documents;
  const categories = Array.from(
    new Set(library.map((document) => document.category)),
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <FolderKanban className="size-4" />
            Ressources
          </div>
          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Documents
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Formulaires, règlements et supports utiles pour les clubs.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge variant="secondary">{library.length} documents</Badge>
          {categories.slice(0, 4).map((category) => (
            <Badge key={category} variant="outline">
              {category}
            </Badge>
          ))}
        </div>
      </section>

      <section className="divide-y divide-border rounded-lg border border-border bg-card">
        {library.map((document) => (
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

            <a
              href={document.href ?? "#"}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Télécharger
              <Download className="size-4" />
            </a>
          </article>
        ))}
      </section>
    </div>
  );
}
