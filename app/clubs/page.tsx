import { Building2, MapPin, Search, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { createPageMetadata } from "@/lib/metadata";
import { clubs } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Clubs",
  description:
    "L'annuaire des clubs affiliés au Comité Marne de tennis de table.",
  path: "/clubs",
});

export default function ClubsPage() {
  const cities = Array.from(new Set(clubs.map((club) => club.city)));
  const totalTables = clubs.reduce((total, club) => total + club.tables, 0);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Search className="size-4" />
            Annuaire
          </div>
          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Clubs
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Trouvez rapidement un club de tennis de table dans la Marne.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge variant="secondary">{clubs.length} clubs</Badge>
          <Badge variant="outline">{cities.length} villes</Badge>
          <Badge variant="outline">{totalTables} tables</Badge>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {clubs.map((club) => (
          <article
            key={club.name}
            className="flex min-h-56 flex-col justify-between rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/45 hover:bg-accent"
          >
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-md border border-border bg-background p-2 text-primary">
                  <Building2 className="size-5" />
                </div>
                <Badge variant="secondary">{club.city}</Badge>
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight">
                {club.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {club.audience}
              </p>
            </div>

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  {club.venue}, {club.city}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-4 shrink-0 text-primary" />
                <span>{club.tables} tables disponibles</span>
              </div>
              <a
                href={`mailto:${club.contact}`}
                className="inline-flex text-sm font-medium text-primary transition-colors hover:text-foreground"
              >
                {club.contact}
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
