import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Edit3,
  ExternalLink,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getAdminDocumentById } from "@/lib/admin-documents";
import { formatFrenchMonthYear } from "@/lib/documents";
import { createPageMetadata } from "@/lib/metadata";
import { competitions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "Prévisualisation document",
  description: "Aperçu d'un document avant publication.",
  path: "/admin/documents/[id]/preview",
});

type AdminDocumentPreviewPageProps = {
  params: {
    id: string;
  };
};

export default async function AdminDocumentPreviewPage({
  params,
}: AdminDocumentPreviewPageProps) {
  const document = await getAdminDocumentById(params.id);

  if (!document) {
    notFound();
  }

  const linkedCompetition = competitions.find(
    (competition) => competition.id === document.competitionId,
  );
  const isPublished = document.status === "PUBLISHED";

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-[1.5rem] border border-primary/20 bg-primary/10 p-4 text-sm text-primary lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-medium">Prévisualisation back-office</p>
          <p className="mt-1 text-primary/80">
            Vérifiez le titre, la catégorie, la description et le fichier avant
            publication.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isPublished ? (
            <Link
              href="/documents"
              target="_blank"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-background px-4 text-sm font-medium text-primary transition hover:bg-primary/10"
            >
              <ExternalLink className="size-4" />
              Voir sur le site
            </Link>
          ) : null}
          <Link
            href={`/admin/documents/${document.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-background px-4 text-sm font-medium text-primary transition hover:bg-primary/10"
          >
            <Edit3 className="size-4" />
            Modifier
          </Link>
        </div>
      </section>

      <article className="mx-auto max-w-3xl space-y-6">
        <Link
          href={`/admin/documents/${document.id}`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-3",
          )}
        >
          <ArrowLeft className="size-4" />
          Retour à l’édition
        </Link>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{document.category}</Badge>
                <Badge variant="outline">{document.format}</Badge>
                <Badge variant={isPublished ? "secondary" : "outline"}>
                  {isPublished ? "Publié" : "Brouillon"}
                </Badge>
                {linkedCompetition ? (
                  <Badge variant="outline">{linkedCompetition.title}</Badge>
                ) : null}
              </div>

              <div className="space-y-3">
                <div className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-muted text-primary">
                  <FileText className="size-5" />
                </div>
                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  {document.title}
                </h1>
                <p className="text-base leading-7 text-muted-foreground">
                  {document.description}
                </p>
              </div>

              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4" />
                Mis à jour {formatFrenchMonthYear(document.updatedAt)}
              </p>
            </div>

            <a
              href={document.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Download className="size-4" />
              Ouvrir le fichier
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}
