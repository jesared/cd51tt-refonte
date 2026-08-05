import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Building2,
  Clock3,
  MapPinned,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";

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

function formatNumber(value: number | null) {
  return value === null ? "-" : new Intl.NumberFormat("fr-FR").format(value);
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Jamais synchronisé";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function toPercent(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.max(4, Math.round((value / max) * 100));
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
  const maxClubCount = topClubs[0]?.licenseeCount ?? 0;
  const cityBreakdown = Array.from(
    successfulLicenseeStats.reduce((cities, stat) => {
      cities.set(stat.city, (cities.get(stat.city) ?? 0) + stat.licenseeCount);
      return cities;
    }, new Map<string, number>()),
    ([city, licenseeCount]) => ({ city, licenseeCount }),
  )
    .sort((first, second) => second.licenseeCount - first.licenseeCount)
    .slice(0, 6);
  const maxCityCount = cityBreakdown[0]?.licenseeCount ?? 0;
  const averageLicensees =
    successfulLicenseeStats.length > 0 && stats.licenseeTotal !== null
      ? Math.round(stats.licenseeTotal / successfulLicenseeStats.length)
      : null;
  const message = searchParams?.error
    ? decodeURIComponent(searchParams.error)
    : searchParams?.synced
      ? `${searchParams.synced} clubs synchronisés, ${searchParams.failed ?? "0"} erreur(s).`
      : null;

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
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
              disabled={!stats.tableReady || stats.ffttClubCount === 0}
            >
              <RefreshCw className="size-4" />
              Synchroniser les licenciés
            </button>
          </form>
        </div>
      </section>

      {message ? (
        <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
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

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Licenciés FFTT</p>
            <Users className="size-4 text-primary" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {formatNumber(stats.licenseeTotal)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Total issu de la dernière synchro
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Moyenne par club</p>
            <ArrowUpRight className="size-4 text-primary" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {formatNumber(averageLicensees)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sur les clubs synchronisés sans erreur
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Clubs actifs</p>
            <Building2 className="size-4 text-primary" />
          </div>
          <p className="mt-3 text-3xl font-semibold">
            {formatNumber(stats.activeClubCount)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.ffttClubCount} avec identifiant FFTT
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Dernière synchro</p>
            <Clock3 className="size-4 text-primary" />
          </div>
          <p className="mt-3 text-sm font-medium">
            {formatDate(stats.lastSyncedAt)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.failedClubCount} erreur(s) détectée(s)
          </p>
        </div>
      </section>

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

          {topClubs.length === 0 ? (
            <div className="px-5 py-8 text-sm text-muted-foreground">
              Aucune donnée disponible pour le moment.
            </div>
          ) : (
            <div className="space-y-4 p-5">
              {topClubs.map((club, index) => (
                <div key={club.clubFfttId} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{club.clubName}</p>
                        <p className="text-xs text-muted-foreground">
                          {club.city}
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 font-medium">
                      {formatNumber(club.licenseeCount)}
                    </p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${toPercent(club.licenseeCount, maxClubCount)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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

          {cityBreakdown.length === 0 ? (
            <div className="px-5 py-8 text-sm text-muted-foreground">
              Aucune ville synchronisée pour le moment.
            </div>
          ) : (
            <div className="space-y-4 p-5">
              {cityBreakdown.map((city) => (
                <div key={city.city} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="truncate font-medium">{city.city}</span>
                    <span className="text-muted-foreground">
                      {formatNumber(city.licenseeCount)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground"
                      style={{
                        width: `${toPercent(city.licenseeCount, maxCityCount)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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
                className="grid gap-4 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_9rem_14rem]"
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
