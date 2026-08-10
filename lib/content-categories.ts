export const NEWS_CATEGORY_OPTIONS = [
  "Vie fédérale",
  "Clubs",
  "Jeunes",
  "Formation",
  "Compétitions",
] as const;

export const DOCUMENT_CATEGORY_OPTIONS = [
  "Calendrier",
  "Convocation",
  "Engagements",
  "Communication",
  "Financement",
  "Formulaire",
  "Gestion club",
  "Inscription",
  "Règlement",
  "Résultats",
  "Support club",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORY_OPTIONS)[number];
export type DocumentCategory = (typeof DOCUMENT_CATEGORY_OPTIONS)[number];

const NEWS_CATEGORY_ALIASES: Record<string, NewsCategory> = {
  federation: "Vie fédérale",
  federale: "Vie fédérale",
  "vie federale": "Vie fédérale",
  "vie fédérale": "Vie fédérale",
  competition: "Compétitions",
  competitions: "Compétitions",
};

const DOCUMENT_CATEGORY_ALIASES: Record<string, DocumentCategory> = {
  calendrier: "Calendrier",
  convocation: "Convocation",
  convocations: "Convocation",
  engagement: "Engagements",
  engagements: "Engagements",
  formulaire: "Formulaire",
  formulaires: "Formulaire",
  communication: "Communication",
  financement: "Financement",
  "gestion club": "Gestion club",
  inscription: "Inscription",
  inscriptions: "Inscription",
  reglement: "Règlement",
  reglementation: "Règlement",
  règlement: "Règlement",
  règlementation: "Règlement",
  resultat: "Résultats",
  resultats: "Résultats",
  résultat: "Résultats",
  résultats: "Résultats",
  "support club": "Support club",
};

function normalizeCategoryKey(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function normalizeNewsCategory(value: string): NewsCategory | null {
  const directMatch = NEWS_CATEGORY_OPTIONS.find((category) => category === value);

  if (directMatch) {
    return directMatch;
  }

  return NEWS_CATEGORY_ALIASES[normalizeCategoryKey(value)] ?? null;
}

export function normalizeDocumentCategory(value: string): DocumentCategory | null {
  const directMatch = DOCUMENT_CATEGORY_OPTIONS.find(
    (category) => category === value,
  );

  if (directMatch) {
    return directMatch;
  }

  return DOCUMENT_CATEGORY_ALIASES[normalizeCategoryKey(value)] ?? null;
}
