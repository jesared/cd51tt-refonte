import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  CircleDashed,
  FileText,
  Landmark,
  Newspaper,
  Settings2,
  UserRoundCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getAdminClubs } from "@/lib/admin-clubs";
import { getAdminStats } from "@/lib/admin-stats";
import { createPageMetadata } from "@/lib/metadata";
import {
  actualCommitteeMembers,
  clubs,
  documents,
  newsArticles,
  technicalStaffMembers,
} from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Administration",
  description:
    "Tableau de bord de l'administration du Comité Marne de tennis de table.",
  path: "/admin",
});

function getModules(clubCount: number, licenseeCount: number | null) {
  return [
  {
    href: "/admin/actualites",
    title: "Actualités",
    description: "Publier et modifier les annonces du site.",
    count: newsArticles.length,
    unit: "articles",
    state: "Pret",
    icon: Newspaper,
  },
  {
    href: "/admin/documents",
    title: "Documents",
    description: "Centraliser les formulaires et ressources.",
    count: documents.length,
    unit: "documents",
    state: "Pret",
    icon: FileText,
  },
  {
    href: "/admin/clubs",
    title: "Clubs",
    description: "Maintenir l'annuaire departemental.",
    count: clubCount,
    unit: "clubs",
    state: "Structure",
    icon: Building2,
  },
  {
    href: "/admin/stats",
    title: "Stats",
    description: "Synchroniser et suivre les chiffres FFTT.",
    count: licenseeCount ?? 0,
    unit: "licenciés",
    state: "FFTT",
    icon: BarChart3,
  },
  {
    href: "/admin/comite",
    title: "Comité",
    description: "Mettre a jour les membres et fonctions.",
    count: actualCommitteeMembers.length,
    unit: "membres",
    state: "Structure",
    icon: Landmark,
  },
  {
    href: "/admin/cadres-techniques",
    title: "Cadres techniques",
    description: "Compléter les fiches des encadrants.",
    count: technicalStaffMembers.length,
    unit: "cadres",
    state: "Structure",
    icon: UserRoundCheck,
  },
  {
    href: "/admin/site",
    title: "Paramètres",
    description: "Regler les informations generales du site.",
    count: 1,
    unit: "configuration",
    state: "Pret",
    icon: Settings2,
  },
];
}

const checks = [
  {
    label: "Connexion admin",
    detail: "Email, mot de passe et session active.",
    done: true,
  },
  {
    label: "Actualités et documents",
    detail: "Premier socle d'édition branché.",
    done: true,
  },
  {
    label: "Clubs, comité, cadres",
    detail: "Pages préparées avant édition complète.",
    done: false,
  },
  {
    label: "Backoffice complet",
    detail: "CRUD, validation, media et droits fins.",
    done: false,
  },
];

export default async function AdminDashboardPage() {
  const adminClubs = await getAdminClubs();
  const stats = await getAdminStats();
  const clubCount = adminClubs.length || clubs.length;
  const modules = getModules(clubCount, stats.licenseeTotal);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="border-b border-border pb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-md bg-foreground text-background hover:bg-foreground">
              Back-office
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Tableau de bord
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Une console simple pour piloter les contenus du site, suivre les
              modules disponibles et preparer les prochaines fonctions admin.
            </p>
          </div>
          <Link
            href="/admin/actualites/nouveau"
            className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-3 text-sm font-medium text-background transition-colors hover:opacity-85"
          >
            Nouvelle actualite
          </Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Modules</p>
          <p className="mt-2 text-2xl font-semibold">{modules.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Contenus publics</p>
          <p className="mt-2 text-2xl font-semibold">
            {newsArticles.length + documents.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Donnees structurees</p>
          <p className="mt-2 text-2xl font-semibold">
            {clubCount +
              actualCommitteeMembers.length +
              technicalStaffMembers.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Statut</p>
          <p className="mt-2 text-2xl font-semibold">Local</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-lg border border-border bg-background">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold">Modules admin</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Accès directs aux zones de gestion.
            </p>
          </div>

          <div className="divide-y divide-border">
            {modules.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group grid gap-3 px-5 py-4 transition-colors hover:bg-accent sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <Badge
                          variant="outline"
                          className="rounded-md text-muted-foreground"
                        >
                          {item.state}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium">{item.count}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.unit}
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-background">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold">Avancement</h2>
            </div>
            <div className="divide-y divide-border">
              {checks.map((item) => (
                <div key={item.label} className="flex gap-3 px-5 py-4">
                  {item.done ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  ) : (
                    <CircleDashed className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-5">
            <h2 className="text-base font-semibold">Prochaine priorite</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Stabiliser les formulaires de gestion pour que les contenus ne
              dependent plus du code.
            </p>
            <Link
              href="/admin/site"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Paramètres du site
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
