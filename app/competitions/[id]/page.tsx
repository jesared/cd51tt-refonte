import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  FileText,
  MapPin,
  Trophy,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedCalendarEvents } from "@/lib/admin-calendar";
import { getPublishedCompetitionItemById } from "@/lib/admin-competitions";
import { getPublishedDocumentCards } from "@/lib/admin-documents";
import { getCalendarEventTypeLabel } from "@/lib/calendar";
import { getGoogleMapsSearchUrl } from "@/lib/maps";
import { createPageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

type CompetitionDetailPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: CompetitionDetailPageProps) {
  const competition = await getPublishedCompetitionItemById(params.id);

  if (!competition) {
    return createPageMetadata({
      title: "Compétition",
      description: "Détail d'une compétition du Comité Marne TT.",
      path: "/competitions",
    });
  }

  return createPageMetadata({
    title: competition.title,
    description: competition.summary,
    path: `/competitions/${competition.id}`,
  });
}

export const dynamic = "force-dynamic";

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function CompetitionDetailPage({
  params,
}: CompetitionDetailPageProps) {
  const [competition, publishedDocuments, publishedEvents] = await Promise.all([
    getPublishedCompetitionItemById(params.id),
    getPublishedDocumentCards(),
    getPublishedCalendarEvents(),
  ]);

  if (!competition) {
    notFound();
  }

  const documents =
    publishedDocuments?.filter(
      (document) => document.competitionId === competition.id,
    ) ?? [];
  const events =
    publishedEvents?.filter((event) => event.competitionId === competition.id) ??
    [];
  const primaryAction =
    competition.actions.find((action) => action.primary) ??
    competition.actions[0];

  return (
    <div className="space-y-8">
      <Link
        href="/competitions"
        className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
      >
        <ArrowLeft className="size-4" />
        Retour aux compétitions
      </Link>

      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)] lg:items-start">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                competition.status === "En cours" ? "default" : "secondary"
              }
            >
              {competition.status}
            </Badge>
            {competition.statusDetail ? (
              <Badge variant="outline">{competition.statusDetail}</Badge>
            ) : null}
            <Badge variant="outline">{competition.format}</Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {competition.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {competition.summary}
            </p>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="flex items-center gap-2 font-medium">
                <CalendarDays className="size-4 text-primary" />
                Prochaine échéance
              </p>
              <p className="mt-2 text-muted-foreground">
                {competition.nextDate}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="flex items-center gap-2 font-medium">
                <Trophy className="size-4 text-primary" />
                Saison
              </p>
              <p className="mt-2 text-muted-foreground">
                {competition.period}
              </p>
            </div>
          </div>

          {primaryAction ? (
            <Link
              href={primaryAction.href}
              className={cn(buttonVariants({ variant: "default", size: "lg" }))}
            >
              {primaryAction.label}
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card">
          {competition.imageUrl ? (
            <Image
              src={competition.imageUrl}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 460px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-muted-foreground">
              <Trophy className="size-12" />
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">
                Échéances liées
              </h2>
            </div>
            {events.length > 0 ? (
              <div className="mt-5 divide-y divide-border">
                {events.map((event) => (
                  <article
                    key={event.id}
                    className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge variant="secondary">
                          {getCalendarEventTypeLabel(event.type)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm">
                        <a
                          href={getGoogleMapsSearchUrl(event.location)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-primary transition-colors hover:text-foreground hover:underline"
                        >
                          {event.location}
                        </a>
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatEventDate(event.date)}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Aucune échéance publiée n&apos;est encore rattachée à cette
                compétition.
              </p>
            )}
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">
                Documents
              </h2>
            </div>
            {documents.length > 0 ? (
              <div className="mt-5 grid gap-3">
                {documents.map((document) => (
                  <Link
                    key={`${document.title}-${document.href}`}
                    href={document.href ?? "/documents"}
                    className="group flex min-w-0 items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm transition-colors hover:border-primary/35 hover:bg-accent"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium group-hover:text-primary">
                        {document.title}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {document.category} · {document.format}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Aucun document publié n&apos;est encore lié à cette compétition.
              </p>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-border bg-card p-5">
          <h2 className="text-xl font-semibold tracking-tight">
            Organisation
          </h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase text-muted-foreground">
                Limite d&apos;inscription
              </dt>
              <dd className="mt-1">{competition.registrationDeadline}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                <MapPin className="size-3.5" />
                Lieu
              </dt>
              <dd className="mt-1">
                <a
                  href={getGoogleMapsSearchUrl(competition.location)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary transition-colors hover:text-foreground hover:underline"
                >
                  {competition.location}
                </a>
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
                <UserRound className="size-3.5" />
                Responsable
              </dt>
              <dd className="mt-1">{competition.manager}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </div>
  );
}
