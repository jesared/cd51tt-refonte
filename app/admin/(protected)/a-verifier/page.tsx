import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  FileQuestion,
  ImageIcon,
  Link2Off,
  ListChecks,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  getAdminQualityCheckGroups,
  type AdminCheckGroup,
} from "@/lib/admin-quality-checks";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Admin à vérifier",
  description: "Points de contrôle des contenus administrables du site.",
  path: "/admin/a-verifier",
});

export const dynamic = "force-dynamic";

const groupIcons = {
  "competitions-without-image": ImageIcon,
  "published-competitions-without-event": CalendarClock,
  "draft-calendar-events": AlertTriangle,
  "documents-without-competition": FileQuestion,
  "unknown-competition-references": Link2Off,
};

function getGroupIcon(group: AdminCheckGroup) {
  return groupIcons[group.id as keyof typeof groupIcons] ?? ListChecks;
}

export default async function AdminReviewPage() {
  const groups = await getAdminQualityCheckGroups();
  const totalIssues = groups.reduce(
    (count, group) => count + group.items.length,
    0,
  );
  const warningIssues = groups.reduce(
    (count, group) =>
      count + group.items.filter((item) => item.severity === "warning").length,
    0,
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-6 rounded-[1.5rem] border border-border bg-background p-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-center gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Pilotage
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            À vérifier
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Un contrôle rapide des contenus qui risquent de gêner la personne
            qui mettra le site à jour : éléments incomplets, brouillons et liens
            devenus incohérents.
          </p>
        </div>

        <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Points à traiter</p>
            <p className="mt-2 text-3xl font-semibold">{totalIssues}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Prioritaires</p>
            <p className="mt-2 text-3xl font-semibold">{warningIssues}</p>
          </div>
        </div>
      </section>

      {totalIssues === 0 ? (
        <section className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/10 p-6 text-emerald-800 dark:text-emerald-200">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <div>
              <h3 className="font-semibold">Tout est propre</h3>
              <p className="mt-1 text-sm leading-6">
                Aucun point de vigilance n’a été trouvé dans les contenus
                administrables.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-2">
        {groups.map((group) => {
          const Icon = getGroupIcon(group);

          return (
            <div
              key={group.id}
              className="rounded-[1.5rem] border border-border bg-background"
            >
              <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{group.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      {group.description}
                    </p>
                  </div>
                </div>
                <Badge variant={group.items.length > 0 ? "secondary" : "outline"}>
                  {group.items.length}
                </Badge>
              </div>

              {group.items.length > 0 ? (
                <div className="divide-y divide-border">
                  {group.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="group grid gap-3 px-5 py-4 transition-colors hover:bg-accent sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{item.title}</p>
                          <Badge
                            variant="outline"
                            className={
                              item.severity === "warning"
                                ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                : "text-muted-foreground"
                            }
                          >
                            {item.severity === "warning"
                              ? "À corriger"
                              : "À contrôler"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        Ouvrir
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex gap-3 px-5 py-5 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <p>{group.emptyLabel}</p>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
