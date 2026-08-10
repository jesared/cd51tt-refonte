import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  FileText,
  Landmark,
  Newspaper,
  Settings2,
  Trophy,
  UserRoundCheck,
} from "lucide-react";
import {
  DocumentResourceStatus,
  NewsArticleStatus,
  type CalendarEvent,
  type ClubResource,
  type CommitteeMemberResource,
  type DocumentResource,
  type NewsArticle,
  type TechnicalStaffMemberResource,
} from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { getAdminCalendarEvents } from "@/lib/admin-calendar";
import { getAdminClubs } from "@/lib/admin-clubs";
import { getAdminDocuments } from "@/lib/admin-documents";
import { getAdminNewsArticles } from "@/lib/admin-news";
import {
  getAdminCommitteeMembers,
  getAdminTechnicalStaffMembers,
} from "@/lib/admin-people";
import { getAdminStats } from "@/lib/admin-stats";
import { createPageMetadata } from "@/lib/metadata";
import { competitions } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Administration",
  description:
    "Tableau de bord de l'administration du Comité Marne de tennis de table.",
  path: "/admin",
});

type DashboardData = {
  articles: NewsArticle[];
  documents: DocumentResource[];
  clubs: ClubResource[];
  calendarEvents: CalendarEvent[];
  committeeMembers: CommitteeMemberResource[];
  technicalStaffMembers: TechnicalStaffMemberResource[];
  licenseeCount: number | null;
};

function getModules(data: DashboardData) {
  const activeClubs = data.clubs.filter((club) => club.active);
  const publishedCalendarEvents = data.calendarEvents.filter(
    (event) => event.published,
  );

  return [
    {
      href: "/admin/actualites",
      title: "Actualités",
      description: "Publier et modifier les annonces du site.",
      count: data.articles.length,
      unit: "articles",
      state: "Prêt",
      icon: Newspaper,
    },
    {
      href: "/admin/documents",
      title: "Documents",
      description: "Centraliser les formulaires et ressources.",
      count: data.documents.length,
      unit: "documents",
      state: "Prêt",
      icon: FileText,
    },
    {
      href: "/admin/competitions",
      title: "Compétitions",
      description: "Vue de cadrage en lecture seule.",
      count: competitions.length,
      unit: "démo",
      state: "Préparation",
      demo: true,
      icon: Trophy,
    },
    {
      href: "/admin/calendrier",
      title: "Calendrier",
      description: "Piloter les échéances sportives.",
      count: data.calendarEvents.length,
      unit:
        publishedCalendarEvents.length === 1
          ? "échéance publiée"
          : "échéances",
      state: "Prêt",
      icon: CalendarDays,
    },
    {
      href: "/admin/clubs",
      title: "Clubs",
      description: "Maintenir l'annuaire départemental.",
      count: activeClubs.length,
      unit: activeClubs.length === 1 ? "club actif" : "clubs actifs",
      state: "Structure",
      icon: Building2,
    },
    {
      href: "/admin/stats",
      title: "Stats",
      description: "Synchroniser et suivre les chiffres FFTT.",
      count: data.licenseeCount ?? 0,
      unit: "licenciés",
      state: "FFTT",
      icon: BarChart3,
    },
    {
      href: "/admin/comite",
      title: "Comité",
      description: "Mettre à jour les membres et fonctions.",
      count: data.committeeMembers.length,
      unit: "membres",
      state: "Structure",
      icon: Landmark,
    },
    {
      href: "/admin/cadres-techniques",
      title: "Cadres techniques",
      description: "Compléter les fiches des encadrants.",
      count: data.technicalStaffMembers.length,
      unit: "cadres",
      state: "Structure",
      icon: UserRoundCheck,
    },
    {
      href: "/admin/site",
      title: "Paramètres",
      description: "Régler les informations générales du site.",
      count: 1,
      unit: "configuration",
      state: "Prêt",
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
    detail: "Édition branchée sur la base.",
    done: true,
  },
  {
    label: "Clubs, comité, cadres",
    detail: "Gestion structurée en base, avec fallback public séparé.",
    done: true,
  },
  {
    label: "Compétitions",
    detail: "Lecture seule tant que le modèle de données n'est pas branché.",
    done: false,
  },
];

export default async function AdminDashboardPage() {
  const [
    articles,
    documents,
    adminClubs,
    calendarEvents,
    committeeMembers,
    technicalStaffMembers,
    stats,
  ] = await Promise.all([
    getAdminNewsArticles(),
    getAdminDocuments(),
    getAdminClubs(),
    getAdminCalendarEvents(),
    getAdminCommitteeMembers(),
    getAdminTechnicalStaffMembers(),
    getAdminStats(),
  ]);

  const data: DashboardData = {
    articles,
    documents,
    clubs: adminClubs,
    calendarEvents,
    committeeMembers,
    technicalStaffMembers,
    licenseeCount: stats.licenseeTotal,
  };
  const modules = getModules(data);
  const publishedArticleCount = articles.filter(
    (article) => article.status === NewsArticleStatus.PUBLISHED,
  ).length;
  const publishedDocumentCount = documents.filter(
    (document) => document.status === DocumentResourceStatus.PUBLISHED,
  ).length;
  const publishedCalendarCount = calendarEvents.filter(
    (event) => event.published,
  ).length;
  const publicContentCount =
    publishedArticleCount + publishedDocumentCount + publishedCalendarCount;
  const structuredDataCount =
    adminClubs.length + committeeMembers.length + technicalStaffMembers.length;

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
              Une console simple pour piloter les contenus réellement présents
              en base, suivre les modules disponibles et identifier les zones de
              démonstration.
            </p>
          </div>
          <Link
            href="/admin/actualites/nouveau"
            className="inline-flex h-9 items-center justify-center rounded-md bg-foreground px-3 text-sm font-medium text-background transition-colors hover:opacity-85"
          >
            Nouvelle actualité
          </Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Modules</p>
          <p className="mt-2 text-2xl font-semibold">{modules.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Contenus publiés</p>
          <p className="mt-2 text-2xl font-semibold">{publicContentCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Actus, documents et échéances visibles
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Données structurées</p>
          <p className="mt-2 text-2xl font-semibold">{structuredDataCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Clubs, comité et cadres en base
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Données de démo</p>
          <p className="mt-2 text-2xl font-semibold">{competitions.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Compétitions en lecture seule
          </p>
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
                        {item.demo ? (
                          <Badge variant="secondary" className="rounded-md">
                            Données de démo
                          </Badge>
                        ) : null}
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
            <h2 className="text-base font-semibold">Prochaine priorité</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Brancher le modèle Compétitions pour remplacer les données de
              démonstration par un vrai CRUD.
            </p>
            <Link
              href="/admin/competitions"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Voir le module compétitions
            </Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
