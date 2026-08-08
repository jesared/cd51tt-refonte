import Link from "next/link";
import { CalendarDays, Plus, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { createPageMetadata } from "@/lib/metadata";
import { competitions } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Admin calendrier",
  description: "Pilotage des échéances sportives du comité.",
  path: "/admin/calendrier",
});

export default function AdminCalendrierPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Sportif
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer le calendrier
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Centralisez les journées, tours, finales et limites d’inscription
            pour alimenter automatiquement les prochaines échéances publiques.
          </p>
        </div>

        <button type="button" className="admin-action admin-action-primary" disabled>
          <Plus className="size-4" />
          Nouvelle échéance
        </button>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-medium">Échéances à structurer</h3>
          <Badge variant="outline">Depuis les compétitions</Badge>
        </div>

        <div className="divide-y divide-border">
          {competitions.map((competition) => (
            <article
              key={competition.title}
              className="admin-list-row grid gap-4 px-6 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
            >
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-medium">{competition.nextDate}</h4>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    {competition.title}
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    {competition.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {competition.location} · Responsable : {competition.manager}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href="/admin/competitions" className="admin-action">
                  <Trophy className="size-4" />
                  Compétition
                </Link>
                <Link href="/competitions" className="admin-action">
                  <CalendarDays className="size-4" />
                  Voir public
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
