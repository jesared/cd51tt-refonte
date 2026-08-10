import Link from "next/link";
import { AlertCircle, CalendarDays, FileText, UserRound } from "lucide-react";

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
      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Sportif
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Compétitions
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Consultez les compétitions préparées pour cadrer la page publique :
            statut, prochaine échéance, responsable et documents liés.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline">Lecture seule</Badge>
            <Badge variant="secondary">Module en préparation</Badge>
          </div>
        </div>
      </section>

      <div className="flex gap-3 rounded-lg border border-amber-500/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-900 dark:text-amber-200">
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <p>
          La gestion des compétitions n&apos;est pas encore branchée en base.
          Cette page affiche des données de démonstration en lecture seule. La
          création, la modification, la publication et la suppression seront
          ajoutées avec le modèle Prisma dédié.
        </p>
      </div>

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium">Liste des compétitions</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {competitions.length} compétitions préparées
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Données de démonstration</Badge>
            <Badge variant="secondary">Aucune action disponible</Badge>
          </div>
        </div>

        <div className="divide-y divide-border">
          {competitions.map((competition) => {
            const visibleTags = competition.tags.slice(0, 2);
            const hiddenTagCount = competition.tags.length - visibleTags.length;

            return (
              <article
                key={competition.title}
                className="admin-list-row grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.75fr)] lg:items-center"
              >
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-medium">
                      {competition.title}
                    </h4>
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

                  <p className="line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {competition.summary}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {visibleTags.map((tag) => (
                      <span
                        key={`${competition.title}-${tag}`}
                        className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    {hiddenTagCount > 0 ? (
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        +{hiddenTagCount}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3 lg:grid-cols-1">
                  <div className="flex min-w-0 items-start gap-2">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="min-w-0 text-foreground">
                      {competition.nextDate}
                    </span>
                  </div>
                  <div className="flex min-w-0 items-start gap-2">
                    <UserRound className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="min-w-0 text-foreground">
                      {competition.manager}
                    </span>
                  </div>
                  <Link
                    href="/admin/documents"
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <FileText className="size-3.5" />
                    {competition.documents.length} documents
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
