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
import { AdminUserRole } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import {
  getAdminQualityCheckGroups,
  type AdminCheckGroup,
} from "@/lib/admin-quality-checks";
import { requireAdminSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Admin à vérifier",
  description: "Points de contrôle des contenus administrables du site.",
  path: "/admin/a-verifier",
});

export const dynamic = "force-dynamic";

const groupIcons = {
  "competitions-without-image": ImageIcon,
  "competitions-without-event": CalendarClock,
  "documents-without-link": FileQuestion,
  "calendar-events-without-competition": AlertTriangle,
  "invalid-links": Link2Off,
};

function getGroupIcon(group: AdminCheckGroup) {
  return groupIcons[group.id as keyof typeof groupIcons] ?? ListChecks;
}

export default async function AdminReviewPage() {
  const session = await requireAdminSession();
  const canEditContent = session.role !== AdminUserRole.USER;

  const groups = await getAdminQualityCheckGroups();
  const issues = groups.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      groupId: group.id,
      problem: group.title,
    })),
  );
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
            Un tableau de contrôle pour repérer les contenus à corriger :
            compétitions incomplètes, documents inutilisables, échéances non
            rattachées et liens invalides.
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

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {groups.map((group) => {
          const Icon = getGroupIcon(group);

          return (
            <div
              key={group.id}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <Badge variant={group.items.length > 0 ? "secondary" : "outline"}>
                  {group.items.length}
                </Badge>
              </div>
              <h3 className="mt-4 text-sm font-semibold">{group.title}</h3>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {group.items.length > 0 ? group.description : group.emptyLabel}
              </p>
            </div>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-border bg-background">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="font-semibold">Tableau des corrections</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Chaque ligne indique le contenu concerné, le problème détecté et
              l’endroit où le corriger.
            </p>
          </div>
          <Badge variant={totalIssues > 0 ? "secondary" : "outline"}>
            {totalIssues} point{totalIssues > 1 ? "s" : ""}
          </Badge>
        </div>

        {issues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Contenu</th>
                  <th className="px-5 py-3 font-medium">Problème</th>
                  <th className="px-5 py-3 font-medium">Détail</th>
                  <th className="px-5 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {issues.map((issue) => {
                  const Icon = getGroupIcon({
                    id: issue.groupId,
                    title: issue.problem,
                    description: "",
                    emptyLabel: "",
                    items: [],
                  });
                  const statusBadge = (
                    <Badge
                      variant="outline"
                      className={
                        issue.severity === "warning"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          : "text-muted-foreground"
                      }
                    >
                      {issue.severity === "warning"
                        ? "À corriger"
                        : "À contrôler"}
                    </Badge>
                  );

                  return (
                    <tr key={`${issue.groupId}-${issue.id}`}>
                      <td className="px-5 py-4 align-top">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                            <Icon className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium">{issue.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {issue.contentType}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-2">
                          <p className="font-medium">{issue.problem}</p>
                          {statusBadge}
                        </div>
                      </td>
                      <td className="max-w-md px-5 py-4 align-top text-muted-foreground">
                        {issue.detail}
                      </td>
                      <td className="px-5 py-4 text-right align-top">
                        {canEditContent ? (
                          <Link
                            href={issue.href}
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 font-medium transition-colors hover:bg-accent"
                          >
                            Corriger
                            <ArrowRight className="size-4" />
                          </Link>
                        ) : (
                          <span className="inline-flex rounded-full border border-border px-3 py-1.5 text-muted-foreground">
                            Lecture seule
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex gap-3 px-5 py-5 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <p>Aucun contenu à corriger pour le moment.</p>
          </div>
        )}
      </section>
    </div>
  );
}
