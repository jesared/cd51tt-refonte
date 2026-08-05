import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Download,
  FileText,
  MapPin,
  Newspaper,
  Trophy,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/metadata";
import {
  clubs,
  competitions,
  newsArticles,
  siteMetrics,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "Accueil",
  description:
    "Actualités, compétitions, clubs et documents du Comité Marne de tennis de table.",
  path: "/",
});

const quickLinks = [
  {
    href: "/actualites",
    label: "Actualités",
    description: "Les infos du moment",
    icon: Newspaper,
  },
  {
    href: "/competitions",
    label: "Compétitions",
    description: "Calendriers et résultats",
    icon: Trophy,
  },
  {
    href: "/clubs",
    label: "Clubs",
    description: "Trouver une salle",
    icon: Building2,
  },
  {
    href: "/documents",
    label: "Documents",
    description: "Formulaires et règlements",
    icon: FileText,
  },
];

export default function HomePage() {
  const highlightedArticles = newsArticles.slice(0, 3);
  const featuredArticle = highlightedArticles[0];
  const secondaryArticles = highlightedArticles.slice(1);

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 py-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.65fr)] lg:py-8">
        <div className="max-w-3xl space-y-7">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Saison 2025-2026
          </Badge>
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Le tennis de table dans la Marne
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Actualités, compétitions, clubs et documents utiles du comité
              départemental.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/actualites"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Voir les actualités
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/clubs"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Trouver un club
              <MapPin className="size-4" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[280px] overflow-hidden rounded-lg border border-border bg-card">
          <div className="absolute inset-0 bg-muted" />
          <div className="relative flex h-full min-h-[280px] flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <div className="relative size-24 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-border">
                <Image
                  src="/branding/comite-logo.png"
                  alt="Logo du Comite de la Marne de Tennis de Table"
                  fill
                  priority
                  className="object-contain p-1"
                />
              </div>
              <Badge variant="outline" className="bg-background/80">
                CD51
              </Badge>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Comité Marne
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  24 clubs affiliés
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Retrouvez les informations utiles pour jouer, suivre les
                  compétitions ou gérer votre club.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Link
                  href="/competitions"
                  className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Calendrier
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/documents"
                  className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Documents
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Accès rapides"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {quickLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-32 flex-col justify-between rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/45 hover:bg-accent"
            >
              <Icon className="size-5 text-primary" />
              <div>
                <h2 className="text-base font-semibold">{item.label}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </section>

      {featuredArticle ? (
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div className="rounded-lg border border-border bg-card p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge>{featuredArticle.category}</Badge>
              <span>{featuredArticle.date}</span>
              <span>{featuredArticle.readTime}</span>
            </div>
            <h2 className="mt-5 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
              {featuredArticle.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              {featuredArticle.excerpt}
            </p>
            <Link
              href="/actualites"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-6",
              )}
            >
              Toutes les actualités
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Newspaper className="size-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                À la une
              </h2>
            </div>
            {secondaryArticles.map((article) => (
              <Link
                key={article.slug}
                href="/actualites"
                className="block rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/45 hover:bg-accent"
              >
                <p className="text-sm font-medium text-primary">
                  {article.category}
                </p>
                <h3 className="mt-2 text-base font-semibold leading-6">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {article.date}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Sport</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Temps forts
              </h2>
            </div>
            <Link
              href="/competitions"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Calendrier
              <CalendarDays className="size-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {competitions.slice(0, 3).map((competition) => (
              <div
                key={competition.title}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{competition.title}</h3>
                  <Badge variant="secondary">{competition.status}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {competition.period}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Territoire</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Clubs proches
              </h2>
            </div>
            <Link
              href="/clubs"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Annuaire
              <Users className="size-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {clubs.slice(0, 4).map((club) => (
              <div
                key={club.name}
                className="rounded-lg border border-border bg-card p-5"
              >
                <h3 className="font-semibold">{club.name}</h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-primary" />
                  {club.city}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-4">
        {siteMetrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-3xl font-semibold tracking-tight">
              {metric.value}
            </p>
            <p className="mt-1 text-sm font-medium">{metric.label}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Besoin d&apos;un document ?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Retrouvez les formulaires, règlements et supports pratiques.
          </p>
        </div>
        <Link
          href="/documents"
          className={buttonVariants({ variant: "default", size: "lg" })}
        >
          Accéder aux documents
          <Download className="size-4" />
        </Link>
      </section>
    </div>
  );
}
