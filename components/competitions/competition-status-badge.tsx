import { Badge } from "@/components/ui/badge";
import type { Competition } from "@/lib/mock-data";

const statusStyles: Record<Competition["status"], string> = {
  Ouvert:
    "border-emerald-600/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/25 dark:text-emerald-300",
  "À venir":
    "border-sky-600/25 bg-sky-500/10 text-sky-800 dark:border-sky-400/25 dark:text-sky-300",
  "En cours":
    "border-amber-600/25 bg-amber-500/10 text-amber-900 dark:border-amber-400/25 dark:text-amber-300",
  Terminé:
    "border-border bg-muted text-muted-foreground",
};

export function getCompetitionStatusClassName(status: string) {
  return statusStyles[status as Competition["status"]] ?? statusStyles.Terminé;
}

export function CompetitionStatusBadge({
  status,
}: {
  status: Competition["status"];
}) {
  return (
    <Badge variant="outline" className={getCompetitionStatusClassName(status)}>
      {status}
    </Badge>
  );
}
