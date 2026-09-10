import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Edit3,
  ExternalLink,
  FileText,
  MapPin,
  Trophy,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { requireEditorSession } from "@/lib/admin-auth";
import { getAdminCalendarEvents } from "@/lib/admin-calendar";
import {
  getAdminCompetitionById,
  toCompetitionItem,
} from "@/lib/admin-competitions";
import { getAdminDocuments } from "@/lib/admin-documents";
import { getCalendarEventTypeLabel } from "@/lib/calendar";
import { createPageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export const metadata = createPageMetadata({
  title: "Prévisualisation compétition",
  description: "Aperçu d'une compétition avant publication.",
  path: "/admin/competitions/[id]/preview",
});

type AdminCompetitionPreviewPageProps = {
  params: {
    id: string;
  };
};

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function AdminCompetitionPreviewPage({
  params,
}: AdminCompetitionPreviewPageProps) {
  const [entry, , adminDocuments, adminEvents] = await Promise.all([
    getAdminCompetitionById(params.id),
    requireEditorSession("/admin/competitions"),
    getAdminDocuments(),
    getAdminCalendarEvents(),
  ]);

  if (!entry) {
    notFound();
  }

  const competition = toCompetitionItem(entry);
  const documents = adminDocuments.filter(
    (document) => document.competitionId === competition.id,
  );
  const events = adminEvents.filter(
    (event) => event.competitionId === competition.id,
  );
  const primaryAction =
    competition.actions.find((action) => action.primary) ??
    competition.actions[0];
  const isPublished = entry.status === "PUBLISHED";

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-[1.5rem] border border-primary/20 bg-primary/10 p-4 text-sm text-primary lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-medium">Prévisualisation back-office</p>
          <p className="mt-1 text-primary/80">
            Vérifiez l’image, les échéances liées, les documents et les infos
            d’organisation avant publication.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isPublished ? (
            <Link
              href={`/competitions/${competition.id}`}
              target="_blank"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-background px-4 text-sm font-medium text-primary transition hover:bg-primary/10"
            >
              <ExternalLink className="size-4" />
              Voir sur le site
            </Link>
          ) : null}
          <Link
            href={`/admin/competitions/${competition.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-background px-4 text-sm font-medium text-primary transition hover:bg-primary/10"
          >
            <Edit3 className="size-4" />
            Modifier
          </Link>
        </div>
      </section>

      <Link
        href={`/admin/competitions/${competition.id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-3")}
      >
        <ArrowLeft className="size-4" />
        Retour à l’édition
      </Link>

      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)] lg:items-start">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={competition.status === "En cours" ? "default" : "secondary"}>
              {competition.status}
            </Badge>
            <Badge variant={isPublished ? "secondary" : "outline"}>
              {isPublished ? "Publié" : "Brouillon"}
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
                {events[0] ? formatEventDate(events[0].date) : competition.nextDate}
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
                        <Badge variant={event.published ? "secondary" : "outline"}>
                          {event.published ? "Publié" : "Brouillon"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {event.location}
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
                Aucune échéance n&apos;est encore rattachée à cette compétition.
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
                  <a
                    key={document.id}
                    href={document.fileUrl}
                    target="_blank"
                    rel="noreferrer"
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
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Aucun document n&apos;est encore lié à cette compétition.
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
              <dd className="mt-1">{competition.location}</dd>
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
