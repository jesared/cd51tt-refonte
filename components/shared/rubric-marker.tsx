import { Building2, FileText, Newspaper, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const rubricMarkers = {
  competitions: { label: "Compétitions", icon: Trophy },
  documents: { label: "Documents", icon: FileText },
  clubs: { label: "Clubs", icon: Building2 },
  news: { label: "Actualités", icon: Newspaper },
} satisfies Record<string, { label: string; icon: LucideIcon }>;

type RubricMarkerProps = {
  rubric: keyof typeof rubricMarkers;
};

export function RubricMarker({ rubric }: RubricMarkerProps) {
  const { label, icon: Icon } = rubricMarkers[rubric];

  return (
    <Badge
      variant="outline"
      className="h-7 gap-1.5 border-primary/20 bg-primary/5 px-2.5 text-primary"
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {label}
    </Badge>
  );
}
