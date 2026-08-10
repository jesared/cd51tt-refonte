import { FolderKanban } from "lucide-react";

import { DocumentsList } from "@/components/documents/documents-list";
import { Badge } from "@/components/ui/badge";
import { getPublishedDocumentCards } from "@/lib/admin-documents";
import type { DocumentCardItem } from "@/lib/documents";
import { createPageMetadata } from "@/lib/metadata";
import { documents } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Documents",
  description:
    "Guides, règlements et formulaires du Comité Marne de tennis de table.",
  path: "/documents",
});

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const databaseDocuments = await getPublishedDocumentCards();
  const fallbackDocuments: DocumentCardItem[] = documents.map((document) => ({
    ...document,
    href: document.href ?? "#",
  }));
  const library: DocumentCardItem[] = databaseDocuments ?? fallbackDocuments;
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

      <DocumentsList documents={library} />
    </div>
  );
}
