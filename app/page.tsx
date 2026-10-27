import {
  ArrowRight,
  Building2,
  CalendarDays,
  Download,
  FileText,
  MapPin,
  Paperclip,
  Newspaper,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AnimatedMetrics } from "@/components/home/animated-metrics";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPublicClubs } from "@/lib/admin-clubs";
import { getPublishedCompetitionItems } from "@/lib/admin-competitions";
import { getPublishedNewsArticleCards } from "@/lib/admin-news";
import { getPublicLicenseeTotal } from "@/lib/admin-stats";
import { NEWS_CATEGORY_DESTINATIONS } from "@/lib/content-categories";
import { createPageMetadata } from "@/lib/metadata";
import type { ArticleCardItem } from "@/lib/news";

export const metadata = createPageMetadata({
  title: "Accueil",
  description:
    "Compétitions, clubs et documents du Comité Marne de tennis de table.",
  path: "/",
});

const quickLinks = [
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

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const databaseArticles = await getPublishedNewsArticleCards(7);
  const infoItems: ArticleCardItem[] = databaseArticles ?? [];
  const publishedCompetitions = (await getPublishedCompetitionItems()) ?? [];
  const databaseClubs = await getPublicClubs();
  const licenseeTotal = await getPublicLicenseeTotal();
  const directory = databaseClubs ?? [];
  const cities = Array.from(new Set(directory.map((club) => club.city)));
  const homeMetrics = [
    {
      label: "Clubs affiliés",
      value: directory.length,
      tone: "clubs" as const,
    },
    ...(licenseeTotal === null
      ? []
      : [
          {
            label: "Licenciés",
            value: licenseeTotal,
            tone: "licensees" as const,
          },
        ]),
    {
      label: "Villes représentées",
      value: cities.length,
      tone: "cities" as const,
    },
  ];

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
              Compétitions, clubs et documents utiles du comité départemental.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/competitions"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Voir les compétitions
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
              <div className="relative size-24 overflow-hidden rounded-md shadow-sm ring-1 ring-border">
                {/* Logo thème clair */}
                <Image
                  src="/branding/comite-logo.png"
                  alt="Logo du Comité de la Marne de Tennis de Table"
                  fill
                  priority
                  className="object-contain p-1 dark:hidden"
                />

                {/* Logo thème sombre */}
                <Image
                  src="/branding/comite-logo-dark.png"
                  alt="Logo du Comité de la Marne de Tennis de Table"
                  fill
                  className="hidden object-contain p-1 dark:block"
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
                  {directory.length} clubs affiliés
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Retrouvez les informations utiles pour jouer, suivre les
                  compétitions ou gérer votre club.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Link
                  href="/calendrier"
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
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {quickLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="interactive-card group flex min-h-32 flex-col justify-between rounded-lg border border-border bg-card p-5 hover:bg-accent"
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

      <section aria-labelledby="fil-info-title" className="space-y-4">
        <div className="flex items-center gap-2">
          <Newspaper className="size-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-primary">
              Les dernières nouvelles
            </p>
            <h2
              id="fil-info-title"
              className="text-2xl font-semibold tracking-tight"
            >
              Fil info
            </h2>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {infoItems.length ? (
            <ul className="divide-y divide-border">
              {infoItems.map((item) => {
                const categoryDestination =
                  NEWS_CATEGORY_DESTINATIONS[
                    item.category as keyof typeof NEWS_CATEGORY_DESTINATIONS
                  ] ?? {
                    href: "/documents",
                    label: "Documents",
                  };
                const linkedCompetition = publishedCompetitions.find(
                  (competition) =>
                    item.targetUrl === `/competitions/${competition.id}`,
                );
                const destination = {
                  href:
                    item.targetUrl?.startsWith("/competitions/") &&
                    !linkedCompetition
                      ? "/competitions"
                      : item.targetUrl ?? categoryDestination.href,
                  label:
                    linkedCompetition?.title ??
                    (item.targetUrl?.startsWith("/competitions/")
                      ? "Compétitions"
                      : categoryDestination.label),
                };

                return (
                  <li key={item.slug} className="p-4 transition-colors hover:bg-accent sm:px-5">
                    <Link href={destination.href} className="group grid gap-2 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:gap-5">
                      <time className="text-sm text-muted-foreground">
                        {item.date}
                      </time>
                      <span className="min-w-0">
                        <span className="block font-semibold leading-6 group-hover:text-primary">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                          {item.excerpt}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                        {destination.label}
                        <ArrowRight className="size-4" />
                      </span>
                    </Link>
                    {item.attachments?.length ? (
                      <ul className="mt-3 flex flex-wrap gap-2 sm:ml-[calc(9rem+1.25rem)]">
                        {item.attachments.map((attachment) => (
                          <li key={attachment.url}>
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-accent"
                            >
                              <Paperclip className="size-3.5 shrink-0" />
                              <span className="break-all">{attachment.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="p-5 text-sm text-muted-foreground">
              Aucune information publiée pour le moment.
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ScrollReveal>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Sport</p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Temps forts
              </h2>
            </div>
            <Link
              href="/calendrier"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Calendrier
              <CalendarDays className="size-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {publishedCompetitions.slice(0, 3).map((competition) => (
              <div
                key={competition.title}
                className="interactive-card rounded-lg border border-border bg-card p-5"
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
            {publishedCompetitions.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
                Aucun temps fort publié pour le moment.
              </div>
            ) : null}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={90}>
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
            {directory.slice(0, 4).map((club) => (
              <div
                key={club.name}
                className="interactive-card rounded-lg border border-border bg-card p-5"
              >
                <h3 className="font-semibold">{club.name}</h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-primary" />
                  {club.city}
                </p>
              </div>
            ))}
            {directory.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground sm:col-span-2">
                Aucun club publié pour le moment.
              </div>
            ) : null}
          </div>
        </ScrollReveal>
      </section>

      <AnimatedMetrics metrics={homeMetrics} />

      <ScrollReveal>
        <section className="interactive-card flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
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
      </ScrollReveal>
    </div>
  );
}
