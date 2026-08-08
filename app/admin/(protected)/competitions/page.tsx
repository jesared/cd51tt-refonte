import Link from "next/link";
import { CalendarDays, FileText, Plus } from "lucide-react";

import { CompetitionActionsMenu } from "@/components/admin/competition-actions-menu";
import { Badge } from "@/components/ui/badge";
import { createPageMetadata } from "@/lib/metadata";
import { competitions } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Admin compétitions",
  description: "Pilotage des compétitions sportives publiées sur le site.",
  path: "/admin/competitions",
});

function getSportStatusTone(status: string) {
  if (status === "En cours") {
    return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
  }

  if (status === "À venir") {
    return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }

  if (status === "Terminé") {
    return "border border-border text-muted-foreground";
  }

  return "border border-border text-muted-foreground";
}

export default function AdminCompetitionsPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Sportif
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer les compétitions
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Suivez les compétitions publiées sur le site : statut, formats,
            prochaine échéance, responsable et documents liés.
          </p>
        </div>

        <Link
          href="/admin/competitions/nouveau"
          className="admin-action admin-action-primary"
        >
          <Plus className="size-4" />
          Nouvelle compétition
        </Link>
      </section>

      <div className="admin-feedback">
        Le CRUD compétitions n&apos;est pas encore branché : les actions sont
        affichées pour cadrer l&apos;interface, puis seront activées avec le
        modèle Prisma.
      </div>

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium">Liste des compétitions</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {competitions.length} compétitions préparées
            </p>
          </div>
          <Badge variant="outline">Données de démonstration</Badge>
        </div>

        <div className="hidden border-b border-border px-6 py-3 text-xs font-medium uppercase text-muted-foreground xl:grid xl:grid-cols-[minmax(220px,1.4fr)_160px_170px_220px_150px_130px_44px] xl:gap-4">
          <span>Titre</span>
          <span>Statut</span>
          <span>Format</span>
          <span>Prochaine échéance</span>
          <span>Responsable</span>
          <span>Documents</span>
          <span className="sr-only">Actions</span>
        </div>

        <div className="divide-y divide-border">
          {competitions.map((competition) => (
            <article
              key={competition.title}
              className="admin-list-row grid gap-4 px-6 py-4 xl:grid-cols-[minmax(220px,1.4fr)_160px_170px_220px_150px_130px_44px] xl:items-center"
            >
              <div className="min-w-0">
                <h4 className="font-medium">{competition.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground xl:hidden">
                  {competition.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                  Publié
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${getSportStatusTone(
                    competition.status,
                  )}`}
                >
                  {competition.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {competition.tags.map((tag) => (
                  <span
                    key={`${competition.title}-${tag}`}
                    className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex min-w-0 items-start gap-2 text-sm text-muted-foreground">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="min-w-0 text-foreground">
                  {competition.nextDate}
                </span>
              </div>

              <p className="text-sm text-foreground">{competition.manager}</p>

              <Link
                href="/admin/documents"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <FileText className="size-3.5" />
                {competition.documents.length} liés
              </Link>

              <div className="flex justify-start xl:justify-end">
                <CompetitionActionsMenu />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
