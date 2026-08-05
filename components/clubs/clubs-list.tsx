import { Building2, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Club } from "@/lib/mock-data";

type ClubsListProps = {
  clubs: Club[];
};

export function ClubsList({ clubs }: ClubsListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {clubs.map((club) => (
        <div
          key={club.name}
          className="rounded-lg border border-border bg-card p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <Building2 className="size-5 text-primary" />
            <Badge variant="secondary">{club.city}</Badge>
          </div>
          <h3 className="mt-4 font-semibold">{club.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{club.audience}</p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <span>{club.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span>{club.tables} tables</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
