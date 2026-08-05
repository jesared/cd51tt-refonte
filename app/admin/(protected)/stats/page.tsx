import {
  AlertCircle,
  BarChart3,
  Building2,
  MapPinned,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";

import {
  AnimatedBarList,
  AnimatedKpiGrid,
} from "@/components/admin/animated-stats";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { Badge } from "@/components/ui/badge";
import { getAdminStats, syncFfttLicenseeStats } from "@/lib/admin-stats";
import { ffttApiReadiness } from "@/lib/fftt/client";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Admin statistiques",
  description: "Statistiques FFTT du Comité Marne de tennis de table.",
  path: "/admin/stats",
});

export const dynamic = "force-dynamic";

type AdminStatsPageProps = {
  searchParams?: {
    synced?: string;
    failed?: string;
    error?: string;
  };
};

function formatDate(value: Date | null) {
  if (!value) {
    return "Jamais synchronisé";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminStatsPage({
  searchParams,
}: AdminStatsPageProps) {
  const stats = await getAdminStats();
  const successfulLicenseeStats = stats.licenseeStats.filter(
    (stat) => !stat.syncError,
  );
  const rankedClubs = [...successfulLicenseeStats].sort(
    (first, second) => second.licenseeCount - first.licenseeCount,
  );
  const topClubs = rankedClubs.slice(0, 8);
  const cityBreakdown = Array.from(
    successfulLicenseeStats.reduce((cities, stat) => {
      cities.set(stat.city, (cities.get(stat.city) ?? 0) + stat.licenseeCount);
      return cities;
    }, new Map<string, number>()),
    ([city, licenseeCount]) => ({ city, licenseeCount }),
  )
    .sort((first, second) => second.licenseeCount - first.licenseeCount)
    .slice(0, 6);
  const averageLicensees =
    successfulLicenseeStats.length > 0 && stats.licenseeTotal !== null
      ? Math.round(stats.licenseeTotal / successfulLicenseeStats.length)
      : null;
  const message = searchParams?.error
    ? decodeURIComponent(searchParams.error)
    : searchParams?.synced
      ? `${searchParams.synced} clubs synchronisés, ${searchParams.failed ?? "0"} erreur(s).`
      : null;
  const kpiItems = [
    {
      label: "Licenciés FFTT",
      value: stats.licenseeTotal,
      description: "Total issu de la dernière synchro",
      tone: "licensees" as const,
    },
    {
      label: "Moyenne par club",
      value: averageLicensees,
      description: "Sur les clubs synchronisés sans erreur",
      tone: "average" as const,
    },
    {
      label: "Clubs actifs",
      value: stats.activeClubCount,
      description: `${stats.ffttClubCount} avec identifiant FFTT`,
      tone: "clubs" as const,
    },
    {
      label: "Dernière synchro",
      value: null,
      textValue: formatDate(stats.lastSyncedAt),
      description: `${stats.failedClubCount} erreur(s) détectée(s)`,
      tone: "sync" as const,
    },
  ];
  const topClubRows = topClubs.map((club, index) => ({
    id: club.clubFfttId,
    label: club.clubName,
    caption: club.city,
    value: club.licenseeCount,
    prefix: String(index + 1),
  }));
  const cityRows = cityBreakdown.map((city) => ({
    id: city.city,
    label: city.city,
    value: city.licenseeCount,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-lg border border-border bg-background">
        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <BarChart3 className="size-4" />
              Observatoire FFTT
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Statistiques du comité
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Vue synthétique des clubs, villes et licenciés synchronisés
                depuis la FFTT.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                API FFTT{" "}
                {ffttApiReadiness.hasAppCredentials
                  ? `configurée, dép. ${ffttApiReadiness.department}`
                  : "non configurée"}
              </Badge>
              <Badge variant={stats.tableReady ? "secondary" : "outline"}>
                {stats.tableReady ? "Table prête" : "Table à créer"}
              </Badge>
              <Badge variant="outline">
                {stats.syncedClubCount} clubs synchronisés
              </Badge>
            </div>
          </div>

          <form action={syncFfttLicenseeStats}>
            <AdminSubmitButton
              variant="default"
              icon={<RefreshCw className="size-4" />}
              loadingLabel="Synchronisation..."
              disabled={!stats.tableReady || stats.ffttClubCount === 0}
            >
              Synchroniser les licenciés
            </AdminSubmitButton>
          </form>
        </div>
      </section>

      {message ? (
        <div className="admin-feedback">
          {message}
        </div>
      ) : null}

      {!stats.tableReady ? (
        <div className="flex gap-3 rounded-lg border border-amber-500/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-900 dark:text-amber-200">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>
            La table des statistiques n&apos;existe pas encore dans la base.
            Lancez `npm run prisma:push`, puis revenez synchroniser les
            licenciés.
          </p>
        </div>
      ) : null}

      <AnimatedKpiGrid items={kpiItems} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
        <div className="rounded-lg border border-border bg-background">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">
                  Clubs les plus représentés
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Classement par nombre de licenciés.
                </p>
              </div>
              <Trophy className="size-4 text-primary" />
            </div>
          </div>

          <AnimatedBarList
            rows={topClubRows}
            emptyLabel="Aucune donnée disponible pour le moment."
          />
        </div>

        <div className="rounded-lg border border-border bg-background">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">Répartition par ville</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Top villes par volume de licenciés.
                </p>
              </div>
              <MapPinned className="size-4 text-primary" />
            </div>
          </div>

          <AnimatedBarList
            rows={cityRows}
            emptyLabel="Aucune ville synchronisée pour le moment."
            barTone="foreground"
          />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-background">
        <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Détail par club</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Données complètes de la dernière synchronisation.
            </p>
          </div>
          <Badge variant="outline">{stats.ffttClubCount} clubs FFTT</Badge>
        </div>

        {stats.licenseeStats.length === 0 ? (
          <div className="px-5 py-8 text-sm text-muted-foreground">
            Aucune statistique synchronisée pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {rankedClubs.map((stat) => (
              <article
                key={stat.clubFfttId}
                className="admin-list-row grid gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_9rem_14rem]"
              >
                <div className="flex min-w-0 gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-primary">
                    <Building2 className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium">
                      {stat.clubName}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {stat.city}
                    </p>
                    {stat.syncError ? (
                      <p className="mt-2 text-sm text-destructive">
                        {stat.syncError}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="size-4 text-primary" />
                  <span className="font-medium">{stat.licenseeCount}</span>
                  <span className="text-muted-foreground">licenciés</span>
                </div>

                <p className="text-sm text-muted-foreground lg:text-right">
                  {formatDate(stat.syncedAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
