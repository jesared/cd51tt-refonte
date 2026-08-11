type DataPageSkeletonProps = {
  type:
    | "articles"
    | "clubs"
    | "documents"
    | "calendar"
    | "competitions"
    | "committee"
    | "technicalStaff";
};

const pageCopy = {
  articles: {
    eyebrowWidth: "w-28",
    titleWidth: "w-44",
    descriptionWidth: "w-80",
    badgeWidths: ["w-28", "w-20", "w-24"],
  },
  clubs: {
    eyebrowWidth: "w-24",
    titleWidth: "w-32",
    descriptionWidth: "w-72",
    badgeWidths: ["w-20", "w-20"],
  },
  documents: {
    eyebrowWidth: "w-28",
    titleWidth: "w-44",
    descriptionWidth: "w-80",
    badgeWidths: ["w-28", "w-24", "w-20"],
  },
  calendar: {
    eyebrowWidth: "w-32",
    titleWidth: "w-44",
    descriptionWidth: "w-96",
    badgeWidths: ["w-28", "w-36"],
  },
  competitions: {
    eyebrowWidth: "w-32",
    titleWidth: "w-56",
    descriptionWidth: "w-96",
    badgeWidths: ["w-24", "w-24", "w-24"],
  },
  committee: {
    eyebrowWidth: "w-28",
    titleWidth: "w-36",
    descriptionWidth: "w-80",
    badgeWidths: ["w-32", "w-24", "w-24"],
  },
  technicalStaff: {
    eyebrowWidth: "w-28",
    titleWidth: "w-80",
    descriptionWidth: "w-72",
    badgeWidths: ["w-24", "w-24"],
  },
} as const;

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`skeleton-pulse rounded-md bg-muted ${className}`} />;
}

function FilterSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <section className="grid gap-3 rounded-lg border border-border bg-card p-3 lg:grid-cols-[minmax(260px,1fr)_minmax(14rem,0.35fr)_auto] lg:items-end">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="grid gap-1">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-10 w-full rounded-lg" />
        </div>
      ))}
    </section>
  );
}

function HeaderSkeleton({ type }: DataPageSkeletonProps) {
  const copy = pageCopy[type];

  return (
    <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="size-4 rounded-full" />
          <SkeletonBlock className={`h-4 ${copy.eyebrowWidth}`} />
        </div>
        <div className="space-y-3">
          <SkeletonBlock className={`h-11 ${copy.titleWidth} sm:h-14`} />
          <SkeletonBlock className={`h-5 max-w-full ${copy.descriptionWidth}`} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        {copy.badgeWidths.map((width, index) => (
          <SkeletonBlock key={index} className={`h-6 rounded-full ${width}`} />
        ))}
      </div>
    </section>
  );
}

function ArticleSkeleton() {
  return (
    <div className="space-y-5">
      <FilterSkeleton fields={3} />
      <div className="flex flex-wrap gap-2">
        {["w-20", "w-24", "w-28"].map((width) => (
          <SkeletonBlock key={width} className={`h-8 rounded-lg ${width}`} />
        ))}
      </div>
      <article className="overflow-hidden rounded-lg border border-border bg-card">
        <SkeletonBlock className="aspect-[16/9] w-full rounded-none" />
        <div className="space-y-4 p-6 sm:p-7">
          <div className="flex flex-wrap gap-3">
            <SkeletonBlock className="h-6 w-24 rounded-full" />
            <SkeletonBlock className="h-5 w-28" />
            <SkeletonBlock className="h-5 w-16" />
          </div>
          <SkeletonBlock className="h-8 w-3/4" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
      </article>
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="grid gap-4 p-5 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center">
            <SkeletonBlock className="aspect-[4/3] w-full" />
            <div className="space-y-3">
              <SkeletonBlock className="h-5 w-1/2" />
              <SkeletonBlock className="h-6 w-3/4" />
              <SkeletonBlock className="h-4 w-full" />
            </div>
            <SkeletonBlock className="h-5 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardsSkeleton() {
  return (
    <section className="space-y-4">
      <FilterSkeleton fields={3} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article
            key={index}
            className="flex min-h-56 flex-col justify-between rounded-lg border border-border bg-card p-5"
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <SkeletonBlock className="size-10" />
                <SkeletonBlock className="h-6 w-24 rounded-full" />
              </div>
              <SkeletonBlock className="h-7 w-3/4" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
            <div className="mt-6 space-y-3">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DocumentsSkeleton() {
  return (
    <section className="space-y-4">
      <FilterSkeleton fields={3} />
      <div className="flex flex-wrap gap-2">
        {["w-20", "w-24", "w-28", "w-32"].map((width) => (
          <SkeletonBlock key={width} className={`h-8 rounded-lg ${width}`} />
        ))}
      </div>
      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {Array.from({ length: 5 }).map((_, index) => (
          <article key={index} className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <SkeletonBlock className="h-6 w-24 rounded-full" />
                <SkeletonBlock className="h-6 w-16 rounded-full" />
                <SkeletonBlock className="h-5 w-36" />
              </div>
              <div className="flex items-start gap-3">
                <SkeletonBlock className="size-10" />
                <div className="flex-1 space-y-3">
                  <SkeletonBlock className="h-7 w-3/4" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-2/3" />
                </div>
              </div>
            </div>
            <SkeletonBlock className="h-10 w-32 rounded-lg" />
          </article>
        ))}
      </div>
    </section>
  );
}

function CalendarSkeleton() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-border bg-card p-3 sm:p-5">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="mb-4 grid gap-3 sm:grid-cols-3 sm:items-center">
            <SkeletonBlock className="h-9 w-40" />
            <SkeletonBlock className="h-7 w-44 justify-self-center" />
            <SkeletonBlock className="h-9 w-48 justify-self-end" />
          </div>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {Array.from({ length: 35 }).map((_, index) => (
              <div key={index} className="min-h-20 bg-card p-2">
                <SkeletonBlock className="mb-3 h-3 w-6" />
                {index % 4 === 0 ? <SkeletonBlock className="h-5 w-full rounded-sm" /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-8 w-32" />
          </div>
          <SkeletonBlock className="h-9 w-40 rounded-lg" />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <SkeletonBlock className="h-6 w-24 rounded-full" />
                <SkeletonBlock className="size-4 rounded-full" />
              </div>
              <SkeletonBlock className="mt-4 h-6 w-3/4" />
              <SkeletonBlock className="mt-2 h-4 w-1/2" />
              <div className="mt-4 space-y-2">
                <SkeletonBlock className="h-4 w-40" />
                <SkeletonBlock className="h-4 w-52" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function PeopleCardSkeleton() {
  return (
    <article className="flex min-h-72 flex-col justify-between rounded-lg border border-border bg-card p-5">
      <div>
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4">
            <SkeletonBlock className="size-20 rounded-full sm:size-24" />
            <div className="min-w-0 space-y-3">
              <SkeletonBlock className="h-5 w-36" />
              <SkeletonBlock className="h-4 w-28" />
            </div>
          </div>
          <SkeletonBlock className="h-6 w-24 rounded-full" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="size-4 rounded-full" />
          <SkeletonBlock className="h-4 w-20" />
        </div>
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-4/5" />
        <SkeletonBlock className="h-4 w-2/3" />
      </div>
    </article>
  );
}

function PeopleSkeleton({ withFeature = false }: { withFeature?: boolean }) {
  return (
    <div className="space-y-8">
      {withFeature ? (
        <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-7 w-44" />
            <SkeletonBlock className="h-4 w-64" />
          </div>
          <SkeletonBlock className="h-10 w-36 rounded-lg" />
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <PeopleCardSkeleton key={index} />
        ))}
      </section>
    </div>
  );
}

function CompetitionCardSkeleton() {
  return (
    <article className="flex min-h-full flex-col rounded-lg border border-border bg-card p-5">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <SkeletonBlock className="h-6 w-20 rounded-full" />
          <SkeletonBlock className="h-6 w-28 rounded-full" />
          <SkeletonBlock className="h-6 w-20 rounded-full" />
        </div>
        <SkeletonBlock className="h-8 w-3/4" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-4/5" />
      </div>
      <div className="mt-5 space-y-4 rounded-md border border-border bg-background p-4">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-4 w-32" />
        <div className="grid gap-3 border-t border-border pt-4">
          <SkeletonBlock className="h-4 w-44" />
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-4 w-40" />
        </div>
        <div className="border-t border-border pt-4">
          <SkeletonBlock className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </article>
  );
}

function CompetitionsSkeleton() {
  return (
    <div className="space-y-8">
      <section className="grid gap-5 rounded-lg border border-primary/20 bg-card p-5 shadow-sm ring-1 ring-primary/10 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 gap-5">
          <SkeletonBlock className="hidden size-16 sm:block" />
          <div className="min-w-0 flex-1 space-y-3">
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-8 w-3/4" />
            <SkeletonBlock className="h-4 w-1/2" />
          </div>
        </div>
        <SkeletonBlock className="h-10 w-44 rounded-lg" />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["w-20", "w-20", "w-24", "w-20", "w-24"].map((width, index) => (
              <SkeletonBlock
                key={`${width}-${index}`}
                className={`h-8 rounded-lg ${width}`}
              />
            ))}
          </div>
          <SkeletonBlock className="h-9 w-44 rounded-lg" />
        </div>
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <CompetitionCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function DataPageSkeleton({ type }: DataPageSkeletonProps) {
  return (
    <div role="status" aria-live="polite" className="space-y-8">
      <HeaderSkeleton type={type} />
      {type === "articles" ? <ArticleSkeleton /> : null}
      {type === "clubs" ? <CardsSkeleton /> : null}
      {type === "documents" ? <DocumentsSkeleton /> : null}
      {type === "calendar" ? <CalendarSkeleton /> : null}
      {type === "competitions" ? <CompetitionsSkeleton /> : null}
      {type === "committee" ? <PeopleSkeleton withFeature /> : null}
      {type === "technicalStaff" ? <PeopleSkeleton /> : null}
      <span className="sr-only">Chargement en cours</span>
    </div>
  );
}
