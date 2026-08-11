"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  FileText,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const primaryAction =
    competition.actions.find((action) => action.primary) ??
    competition.actions[0];
  const secondaryActions = competition.actions.filter(
    (action) => action !== primaryAction,
  );

  if (!primaryAction) {
    return null;
  }

  const PrimaryIcon = actionIcons[primaryAction.type];

  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center",
        compact ? "sm:justify-end" : "sm:justify-start lg:justify-end",
      )}
    >
      <Link
        href={primaryAction.href}
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "w-full sm:w-auto",
        )}
      >
        <PrimaryIcon className="size-4" />
        {primaryAction.label}
        <ArrowRight className="size-4" />
      </Link>

      {secondaryActions.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto",
            )}
          >
            <FileText className="size-4" />
            Documents
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
              Documents utiles
            </div>
            <div className="grid gap-1">
              {secondaryActions.map((action) => {
                const Icon = actionIcons[action.type];

                return (
                  <Link
                    key={`${competition.title}-${action.label}`}
                    href={action.href}
                    className="flex min-h-9 items-center gap-2 rounded-md px-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none"
                  >
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}

function CompetitionDocumentLinks({
  competition,
  compact = false,
}: {
  competition: Competition;
  compact?: boolean;
}) {
  if (competition.documents.length === 0) {
    return null;
  }

  const visibleDocuments = competition.documents.slice(0, compact ? 2 : 3);
  const remainingCount = competition.documents.length - visibleDocuments.length;

  return (
    <div className="space-y-2 border-t border-border pt-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <FileText className="size-4 text-primary" />
        Documents liés
      </div>
      <div
        className={cn(
          "grid gap-2",
          compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-1",
        )}
      >
        {visibleDocuments.map((document) => (
          <Link
            key={`${competition.title}-${document.title}`}
            href={document.href}
            className="group flex min-w-0 items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-primary/35 hover:bg-accent"
          >
            <span className="min-w-0">
              <span className="block truncate font-medium group-hover:text-primary">
                {document.title}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {document.category} · {document.format}
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </Link>
        ))}
        {remainingCount > 0 ? (
          <Link
            href="/documents"
            className="inline-flex min-h-10 items-center rounded-md border border-dashed border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/35 hover:text-foreground"
          >
            + {remainingCount} document{remainingCount > 1 ? "s" : ""}
          </Link>
        ) : null}
      </div>
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
      <CompetitionDocumentLinks competition={competition} compact={compact} />
      <CompetitionActions competition={competition} compact={compact} />
    </div>
  );
}

function CompetitionCard({ competition }: { competition: Competition }) {
  return (
    <article className="interactive-card flex min-h-full flex-col rounded-lg border border-border bg-card p-5">
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
    <article className="interactive-card rounded-lg border border-border bg-card p-4 hover:bg-accent sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <CompetitionBadges competition={competition} />
          <h2 className="mt-3 text-xl font-semibold tracking-tight">
            {competition.title}
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
            {competition.summary}
          </p>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-3 lg:min-w-[520px]">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Prochaine date
            </p>
            <p className="mt-1 font-medium">{competition.nextDate}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Limite
            </p>
            <p className="mt-1">{competition.registrationDeadline}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Responsable
            </p>
            <p className="mt-1">{competition.manager}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="truncate">{competition.location}</span>
        </p>
        <CompetitionActions competition={competition} />
      </div>
      <div className="mt-4">
        <CompetitionDocumentLinks competition={competition} compact />
      </div>
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
