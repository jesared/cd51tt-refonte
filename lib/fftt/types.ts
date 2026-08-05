export type FfttClubRecord = {
  id: string;
  name: string;
  city: string;
  venue?: string;
  audience?: string;
  tables?: number;
  contact?: string;
};

export type FfttNewsRecord = {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: string;
};

export type FfttCompetitionRecord = {
  id: string;
  title: string;
  summary: string;
  period: string;
  status: "open" | "upcoming" | "live";
};

export type FfttClientConfig = {
  baseUrl: string;
  apiKey?: string;
  appId?: string;
  appPassword?: string;
  department?: string;
};
