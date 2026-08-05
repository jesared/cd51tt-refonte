import "server-only";

import { createHash, createHmac, randomBytes } from "crypto";

import { clubs, competitions, newsArticles } from "@/lib/mock-data";

import type {
  FfttClientConfig,
  FfttClubRecord,
  FfttCompetitionRecord,
  FfttLicenseeRecord,
  FfttNewsRecord,
} from "@/lib/fftt/types";

const SMARTPING_CLUB_ENDPOINTS = [
  "xml_initialisation.php",
  "xml_club_dep2.php",
  "xml_club_detail.php",
  "xml_liste_joueur_o.php",
];

const defaultConfig: FfttClientConfig = {
  baseUrl:
    process.env.FFTT_BASE_URL ??
    process.env.FFTT_API_BASE_URL ??
    "https://www.fftt.com/mobile/pxml/",
  apiKey: process.env.FFTT_API_KEY,
  appId: process.env.FFTT_APP_ID,
  appPassword: process.env.FFTT_APP_PASSWORD,
  department: process.env.FFTT_DEPARTMENT ?? "51",
};

function withTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

function decodeXml(buffer: ArrayBuffer, contentType: string | null) {
  const charset = contentType?.match(/charset=([^;]+)/i)?.[1] ?? "utf-8";

  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return new TextDecoder("utf-8").decode(buffer);
  }
}

function stripXmlValue(value: string) {
  return value
    .replace(/^<!\[CDATA\[/, "")
    .replace(/\]\]>$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));

  return match ? stripXmlValue(match[1] ?? "") : "";
}

function readTagNumber(xml: string, tag: string) {
  const value = Number.parseInt(readTag(xml, tag), 10);

  return Number.isFinite(value) ? value : undefined;
}

function readItems(xml: string, tag: string) {
  return Array.from(
    xml.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi")),
    (match) => match[1] ?? "",
  );
}

function joinAddress(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(", ");
}

function toContact(detailXml: string) {
  const mail = readTag(detailXml, "mailcor");
  const phone = readTag(detailXml, "telcor");
  const web = readTag(detailXml, "web");

  return [mail, phone, web].filter(Boolean).join(" / ");
}

function toClubRecord(clubXml: string, detailXml?: string): FfttClubRecord | null {
  const sourceXml = detailXml || clubXml;
  const id = readTag(clubXml, "numero") || readTag(sourceXml, "numero");
  const name = readTag(clubXml, "nom") || readTag(sourceXml, "nom");
  const city =
    readTag(sourceXml, "villesalle") ||
    readTag(sourceXml, "ville") ||
    readTag(sourceXml, "libelle");

  if (!id || !name) {
    return null;
  }

  const venueName = readTag(sourceXml, "nomsalle");
  const venueAddress = joinAddress(
    readTag(sourceXml, "adressesalle1"),
    readTag(sourceXml, "adressesalle2"),
    readTag(sourceXml, "adressesalle3"),
    readTag(sourceXml, "codepsalle"),
    readTag(sourceXml, "villesalle"),
  );

  return {
    id,
    name,
    city: city || "Ville à compléter",
    venue: venueName
      ? joinAddress(venueName, venueAddress)
      : venueAddress || undefined,
    audience: "Tout public",
    tables: readTagNumber(sourceXml, "nbtables"),
    contact: detailXml ? toContact(detailXml) || undefined : undefined,
  };
}

function toMockClubs(): FfttClubRecord[] {
  return clubs.map((club, index) => ({
    id: `mock-club-${index + 1}`,
    name: club.name,
    city: club.city,
    venue: club.venue,
    audience: club.audience,
    tables: club.tables,
    contact: club.contact,
  }));
}

function toLicenseeRecord(playerXml: string): FfttLicenseeRecord | null {
  const licence = readTag(playerXml, "licence") || readTag(playerXml, "numlic");

  if (!licence) {
    return null;
  }

  return {
    licence,
    lastName: readTag(playerXml, "nom") || undefined,
    firstName: readTag(playerXml, "prenom") || undefined,
    clubId: readTag(playerXml, "nclub") || readTag(playerXml, "club") || undefined,
  };
}

export class FfttClient {
  private readonly smartpingSerie = randomBytes(12)
    .toString("hex")
    .toUpperCase()
    .slice(0, 15);

  constructor(private readonly config: FfttClientConfig = defaultConfig) {}

  private get hasJsonCredentials() {
    return Boolean(this.config.apiKey);
  }

  private get hasSmartpingCredentials() {
    return Boolean(this.config.appId && this.config.appPassword);
  }

  private get usesSmartpingApi() {
    return (
      this.config.baseUrl.includes("fftt.com/mobile") ||
      this.hasSmartpingCredentials
    );
  }

  private async requestJson<T>(path: string): Promise<T> {
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

  private createSmartpingAuthParams() {
    if (!this.config.appId || !this.config.appPassword) {
      throw new Error("Les identifiants FFTT ne sont pas configurés.");
    }

    const timestamp = String(Date.now());
    const key = createHash("md5").update(this.config.appPassword).digest("hex");
    const signature = createHmac("sha1", key).update(timestamp).digest("hex");

    return {
      serie: this.smartpingSerie,
      tm: timestamp,
      tmc: signature,
      id: this.config.appId,
    };
  }

  private async requestSmartping(
    endpoint: string,
    params: Record<string, string> = {},
  ) {
    const url = new URL(endpoint, withTrailingSlash(this.config.baseUrl));
    const authParams = this.createSmartpingAuthParams();

    for (const [key, value] of Object.entries({ ...authParams, ...params })) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url, {
      headers: {
        Accept: "application/xml,text/xml,*/*",
        "User-Agent": "CD51TT Backoffice",
      },
      cache: "no-store",
    });

    const xml = decodeXml(
      await response.arrayBuffer(),
      response.headers.get("content-type"),
    );

    if (!response.ok || readTag(xml, "verification") === "0") {
      const message = readTag(xml, "erreur") || `statut ${response.status}`;
      throw new Error(`La FFTT a refusé la requête (${message}).`);
    }

    return xml;
  }

  private async initialiseSmartping() {
    await this.requestSmartping("xml_initialisation.php", {
      os: "Web",
      version: "1",
    });
  }

  private async getClubDetail(id: string) {
    try {
      const xml = await this.requestSmartping("xml_club_detail.php", {
        club: id,
      });

      return readItems(xml, "club")[0];
    } catch {
      return undefined;
    }
  }

  private async getSmartpingClubs(): Promise<FfttClubRecord[]> {
    await this.initialiseSmartping();

    const xml = await this.requestSmartping("xml_club_dep2.php", {
      dep: this.config.department ?? "51",
    });

    const records: FfttClubRecord[] = [];

    for (const clubXml of readItems(xml, "club")) {
      const id = readTag(clubXml, "numero");
      const detailXml = id ? await this.getClubDetail(id) : undefined;
      const record = toClubRecord(clubXml, detailXml);

      if (record) {
        records.push(record);
      }
    }

    return records.length ? records : toMockClubs();
  }

  async getClubs(): Promise<FfttClubRecord[]> {
    if (this.usesSmartpingApi) {
      return this.hasSmartpingCredentials
        ? this.getSmartpingClubs()
        : toMockClubs();
    }

    if (!this.hasJsonCredentials) {
      return toMockClubs();
    }

    return this.requestJson<FfttClubRecord[]>("/clubs");
  }

  async getLicenseesByClub(clubId: string): Promise<FfttLicenseeRecord[]> {
    if (!this.hasSmartpingCredentials) {
      throw new Error("Les identifiants FFTT ne sont pas configurés.");
    }

    await this.initialiseSmartping();

    const xml = await this.requestSmartping("xml_liste_joueur_o.php", {
      club: clubId,
    });

    return readItems(xml, "joueur")
      .map(toLicenseeRecord)
      .filter((player): player is FfttLicenseeRecord => Boolean(player));
  }

  async getNews(): Promise<FfttNewsRecord[]> {
    if (!this.hasJsonCredentials || this.usesSmartpingApi) {
      return newsArticles.map((article, index) => ({
        id: `mock-news-${index + 1}`,
        title: article.title,
        excerpt: article.excerpt,
        publishedAt: article.date,
        category: article.category,
      }));
    }

    return this.requestJson<FfttNewsRecord[]>("/news");
  }

  async getCompetitions(): Promise<FfttCompetitionRecord[]> {
    if (!this.hasJsonCredentials || this.usesSmartpingApi) {
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

    return this.requestJson<FfttCompetitionRecord[]>("/competitions");
  }
}

export const ffttClient = new FfttClient();

export const ffttApiReadiness = {
  baseUrl: defaultConfig.baseUrl,
  department: defaultConfig.department,
  hasApiKey: Boolean(defaultConfig.apiKey),
  hasAppCredentials: Boolean(defaultConfig.appId && defaultConfig.appPassword),
  configuredEndpoints: defaultConfig.baseUrl.includes("fftt.com/mobile")
    ? SMARTPING_CLUB_ENDPOINTS
    : ["/clubs", "/news", "/competitions"],
};
