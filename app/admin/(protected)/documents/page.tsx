import Link from "next/link";
import { Download, Plus, Sparkles } from "lucide-react";

import { AdminRowActionsMenu } from "@/components/admin/admin-row-actions-menu";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import {
  deleteDocument,
  getAdminDocuments,
  seedMockDocuments,
} from "@/lib/admin-documents";
import { formatFrenchMonthYear } from "@/lib/documents";
import { createPageMetadata } from "@/lib/metadata";
import { competitions } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Admin documents",
  description: "Administration de la base documentaire du comité.",
  path: "/admin/documents",
});

type AdminDocumentsPageProps = {
  searchParams?: {
    saved?: string;
    deleted?: string;
    seeded?: string;
    error?: string;
  };
};

export default async function AdminDocumentsPage({
  searchParams,
}: AdminDocumentsPageProps) {
  const entries = await getAdminDocuments();
  const message =
    searchParams?.saved === "1"
      ? "Le document a été enregistré."
      : searchParams?.deleted === "1"
        ? "Le document a été supprimé."
        : searchParams?.seeded === "1"
          ? "Les documents mockés ont été importés."
          : searchParams?.seeded === "0"
            ? "Des documents existent déjà. Import mock ignoré."
            : searchParams?.error
              ? decodeURIComponent(searchParams.error)
              : null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Documents
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer la base documentaire du comité
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Regroupez les guides, règlements, formulaires et supports utiles au
            même endroit, puis choisissez ce qui doit apparaître sur le site.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {entries.length === 0 ? (
            <form action={seedMockDocuments}>
              <AdminSubmitButton
                icon={<Sparkles className="size-4" />}
                loadingLabel="Import en cours..."
                className="h-10 px-4"
              >
                Importer les mocks
              </AdminSubmitButton>
            </form>
          ) : null}

          <Link
            href="/admin/documents/nouveau"
            className="admin-action admin-action-primary"
          >
            <Plus className="size-4" />
            Nouveau document
          </Link>
        </div>
      </section>

      {message ? (
        <div className="admin-feedback">
          {message}
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-medium">Liste des documents</h3>
        </div>

        {entries.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun document n&apos;est encore en base. Vous pouvez importer les
            mocks ou créer votre première ressource manuellement.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="admin-list-row grid gap-3 px-6 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-medium">{entry.title}</h4>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      {entry.category}
                    </span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      {entry.format}
                    </span>
                    <span
                      className={
                        entry.status === "PUBLISHED"
                          ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300"
                          : "rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                      }
                    >
                      {entry.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                    </span>
                    {entry.competitionId ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {competitions.find(
                          (competition) =>
                            competition.id === entry.competitionId,
                        )?.title ?? "Compétition liée"}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatFrenchMonthYear(entry.updatedAt)}
                  </p>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <AdminRowActionsMenu
                    editHref={`/admin/documents/${entry.id}`}
                    deleteAction={deleteDocument}
                    deleteId={entry.id}
                    deleteMessage="Supprimer ce document ? Cette action est définitive."
                  >
                    <a
                      href={entry.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                    >
                      <Download className="size-4" />
                      Ouvrir
                    </a>
                  </AdminRowActionsMenu>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
