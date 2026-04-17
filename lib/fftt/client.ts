import "server-only";

import { clubs, competitions, newsArticles } from "@/lib/mock-data";

import type {
  FfttClientConfig,
  FfttClubRecord,
  FfttCompetitionRecord,
  FfttNewsRecord,
} from "@/lib/fftt/types";

const defaultConfig: FfttClientConfig = {
  baseUrl: process.env.FFTT_API_BASE_URL ?? "https://api.fftt.example/v1",
  apiKey: process.env.FFTT_API_KEY,
};

export class FfttClient {
  constructor(private readonly config: FfttClientConfig = defaultConfig) {}

  private get hasCredentials() {
    return Boolean(this.config.apiKey);
  }

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`FFTT API request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  }

  async getClubs(): Promise<FfttClubRecord[]> {
    if (!this.hasCredentials) {
      return clubs.map((club, index) => ({
        id: `mock-club-${index + 1}`,
        name: club.name,
        city: club.city,
        venue: club.venue,
        audience: club.audience,
      }));
    }

    return this.request<FfttClubRecord[]>("/clubs");
  }

  async getNews(): Promise<FfttNewsRecord[]> {
    if (!this.hasCredentials) {
      return newsArticles.map((article, index) => ({
        id: `mock-news-${index + 1}`,
        title: article.title,
        excerpt: article.excerpt,
        publishedAt: article.date,
        category: article.category,
      }));
    }

    return this.request<FfttNewsRecord[]>("/news");
  }

  async getCompetitions(): Promise<FfttCompetitionRecord[]> {
    if (!this.hasCredentials) {
      return competitions.map((competition, index) => ({
        id: `mock-competition-${index + 1}`,
        title: competition.title,
        summary: competition.summary,
        period: competition.period,
        status:
          competition.status === "En cours"
            ? "live"
            : competition.status === "À venir"
              ? "upcoming"
              : "open",
      }));
    }

    return this.request<FfttCompetitionRecord[]>("/competitions");
  }
}

export const ffttClient = new FfttClient();

export const ffttApiReadiness = {
  baseUrl: defaultConfig.baseUrl,
  hasApiKey: Boolean(defaultConfig.apiKey),
  configuredEndpoints: ["/clubs", "/news", "/competitions"],
};
