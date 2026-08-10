import { Search } from "lucide-react";

import { ClubsList } from "@/components/clubs/clubs-list";
import { Badge } from "@/components/ui/badge";
import { getPublicClubs } from "@/lib/admin-clubs";
import { createPageMetadata } from "@/lib/metadata";
import { clubs } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Clubs",
  description:
    "L'annuaire des clubs affiliés au Comité Marne de tennis de table.",
  path: "/clubs",
});

export const dynamic = "force-dynamic";

export default async function ClubsPage() {
  const directory = (await getPublicClubs()) ?? clubs;
  const cities = Array.from(new Set(directory.map((club) => club.city)));

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
          <Badge variant="secondary">{directory.length} clubs</Badge>
          <Badge variant="outline">{cities.length} villes</Badge>
        </div>
      </section>

      <ClubsList clubs={directory} />
    </div>
  );
}
