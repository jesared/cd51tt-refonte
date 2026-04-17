import { Building2, MapPin, Users } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import type { Club } from "@/lib/mock-data";

type ClubsListProps = {
  clubs: Club[];
};

export function ClubsList({ clubs }: ClubsListProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {clubs.map((club) => (
        <SectionCard
          key={club.name}
          title={club.name}
          description={club.audience}
          icon={Building2}
        >
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <span>
                {club.city} · {club.venue}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span>{club.tables} tables disponibles</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{club.city}</Badge>
              <Badge variant="outline">{club.contact}</Badge>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
