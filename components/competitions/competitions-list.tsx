"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  LayoutGrid,
  List as ListIcon,
  ListChecks,
  MapPin,
  PenLine,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type {
  Competition,
  CompetitionAction,
  CompetitionTag,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type CompetitionFilter = "Toutes" | Competition["status"] | CompetitionTag;
type CompetitionView = "cards" | "list";

const filters: CompetitionFilter[] = [
  "Toutes",
  "En cours",
  "À venir",
  "Équipes",
  "Individuel",
  "Jeunes",
  "Seniors",
];

const views: Array<{
  id: CompetitionView;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "cards", label: "Cartes", icon: LayoutGrid },
  { id: "list", label: "Liste", icon: ListIcon },
];

const actionIcons: Record<CompetitionAction["type"], LucideIcon> = {
  calendar: CalendarDays,
  results: ListChecks,
  convocation: ClipboardCheck,
  rules: ClipboardList,
  registration: PenLine,
};

function isCompetitionTag(filter: CompetitionFilter): filter is CompetitionTag {
  return ["Équipes", "Individuel", "Jeunes", "Seniors"].includes(filter);
}

function matchesFilter(competition: Competition, filter: CompetitionFilter) {
  if (filter === "Toutes") {
    return true;
  }

  return (
    competition.status === filter ||
    (isCompetitionTag(filter) && competition.tags.includes(filter))
  );
}

function CompetitionBadges({ competition }: { competition: Competition }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge
        variant={competition.status === "En cours" ? "default" : "secondary"}
      >
        {competition.status}
      </Badge>
      <Badge variant="outline">{competition.statusDetail}</Badge>
      <Badge variant="outline">{competition.format}</Badge>
    </div>
  );
}

function CompetitionActions({
  competition,
  compact = false,
}: {
  competition: Competition;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-t border-border pt-4">
      {competition.actions.map((action) => {
        const Icon = actionIcons[action.type];

        return (
          <Link
            key={`${competition.title}-${action.label}`}
            href={action.href}
            className={buttonVariants({
              variant: action.primary ? "default" : "outline",
              size: "sm",
              className: cn("min-w-0", compact ? "flex-1" : "flex-1 sm:flex-none"),
            })}
          >
            <Icon className="size-4" />
            <span className="truncate">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

function CompetitionDetails({
  competition,
  compact = false,
}: {
  competition: Competition;
  compact?: boolean;
}) {
  return (
    <div className="space-y-4 rounded-md border border-border bg-background p-4">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <CalendarDays className="size-4 text-primary" />
          Prochaine échéance
        </div>
        <p className="mt-2 text-sm font-medium">{competition.nextDate}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Saison : {competition.period}
        </p>
      </div>
      <dl
        className={cn(
          "grid gap-3 border-t border-border pt-4 text-sm",
          compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-1",
        )}
      >
        <div>
          <dt className="text-xs font-medium uppercase text-muted-foreground">
            Limite d&apos;inscription
          </dt>
          <dd className="mt-1 text-foreground">
            {competition.registrationDeadline}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
            <MapPin className="size-3.5" />
            Lieu
          </dt>
          <dd className="mt-1 text-foreground">{competition.location}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs font-medium uppercase text-muted-foreground">
            <UserRound className="size-3.5" />
            Responsable
          </dt>
          <dd className="mt-1 text-foreground">{competition.manager}</dd>
        </div>
      </dl>
      <CompetitionActions competition={competition} compact={compact} />
    </div>
  );
}

function CompetitionCard({ competition }: { competition: Competition }) {
  return (
    <article className="flex min-h-full flex-col rounded-lg border border-border bg-card p-5">
      <div className="min-w-0">
        <CompetitionBadges competition={competition} />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          {competition.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {competition.summary}
        </p>
      </div>
      <div className="mt-5">
        <CompetitionDetails competition={competition} compact />
      </div>
    </article>
  );
}

function CompetitionListRow({ competition }: { competition: Competition }) {
  return (
    <article className="grid gap-5 rounded-lg border border-border bg-card p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div className="min-w-0">
        <CompetitionBadges competition={competition} />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          {competition.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {competition.summary}
        </p>
      </div>

      <CompetitionDetails competition={competition} />
    </article>
  );
}

export function CompetitionsList({
  competitions,
}: {
  competitions: Competition[];
}) {
  const [activeFilter, setActiveFilter] =
    useState<CompetitionFilter>("Toutes");
  const [activeView, setActiveView] = useState<CompetitionView>("cards");
  const filteredCompetitions = useMemo(
    () =>
      competitions.filter((competition) =>
        matchesFilter(competition, activeFilter),
      ),
    [activeFilter, competitions],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          className="flex flex-wrap gap-2"
          aria-label="Filtrer les compétitions"
        >
          {filters.map((filter) => {
            const selected = filter === activeFilter;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "inline-flex h-8 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
          <p className="px-1 text-sm text-muted-foreground">
            {filteredCompetitions.length} sur {competitions.length} épreuves
          </p>
          <div
            className="flex w-fit rounded-lg border border-border bg-background p-1"
            aria-label="Choisir la vue"
          >
            {views.map((view) => {
              const Icon = view.icon;
              const selected = view.id === activeView;

              return (
                <button
                  key={view.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveView(view.id)}
                  className={cn(
                    "inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {view.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeView === "cards" ? (
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {filteredCompetitions.map((competition) => (
            <CompetitionCard
              key={competition.title}
              competition={competition}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCompetitions.map((competition) => (
            <CompetitionListRow
              key={competition.title}
              competition={competition}
            />
          ))}
        </div>
      )}
    </section>
  );
}
