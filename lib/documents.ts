import type { DocumentItem } from "@/lib/mock-data";

export type DocumentCardItem = DocumentItem & {
  href: string;
  competitionId?: string | null;
};

export function formatFrenchMonthYear(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(date);
}
