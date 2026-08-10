"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Building2, Mail, MapPin, Phone, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Club } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ClubsListProps = {
  clubs: Club[];
};

type SortMode = "name" | "city";

const collator = new Intl.Collator("fr", {
  sensitivity: "base",
  numeric: true,
});

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parseClubContact(contact: string) {
  const parts = contact
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  const email = parts.find((part) => /\S+@\S+\.\S+/.test(part));
  const phone = parts.find((part) => /(?:\+33|0)\s*\d/.test(part));

  return { email, phone };
}

export function ClubsList({ clubs }: ClubsListProps) {
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("city");

  const cities = useMemo(
    () =>
      Array.from(new Set(clubs.map((club) => club.city))).sort((a, b) =>
        collator.compare(a, b),
      ),
    [clubs],
  );
  const normalizedQuery = normalizeSearchValue(query);
  const filteredClubs = useMemo(() => {
    return clubs
      .filter((club) => {
        const matchesCity = cityFilter === "all" || club.city === cityFilter;
        const searchable = normalizeSearchValue(
          [club.name, club.city, club.venue, club.audience].join(" "),
        );
        const matchesQuery =
          normalizedQuery.length === 0 || searchable.includes(normalizedQuery);

        return matchesCity && matchesQuery;
      })
      .sort((a, b) => {
        const primary =
          sortMode === "city"
            ? collator.compare(a.city, b.city)
            : collator.compare(a.name, b.name);

        return primary || collator.compare(a.name, b.name);
      });
  }, [cityFilter, clubs, normalizedQuery, sortMode]);
  const hasActiveFilters = query.length > 0 || cityFilter !== "all";

  return (
    <section className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-border bg-card p-3 lg:grid-cols-[minmax(260px,1fr)_minmax(15rem,0.35fr)_minmax(10rem,0.22fr)] xl:grid-cols-[minmax(280px,1fr)_minmax(15rem,0.34fr)_minmax(10rem,0.22fr)_auto] xl:items-end">
        <label className="grid gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Recherche
          </span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Club, ville ou salle"
              className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 pl-9 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
            />
          </span>
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Ville
          </span>
          <select
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50"
          >
            <option value="all">Toutes les villes</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Trier
          </span>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as SortMode)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50"
          >
            <option value="city">Ville</option>
            <option value="name">Nom du club</option>
          </select>
        </label>

        <div className="flex min-h-10 flex-wrap items-center gap-2 lg:col-span-3 xl:col-span-1 xl:justify-end">
          <span className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium">
            {filteredClubs.length} sur {clubs.length}
          </span>
          <span className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium">
            <ArrowUpDown className="size-3" />
            {sortMode === "city" ? "Ville" : "Nom"}
          </span>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCityFilter("all");
              }}
              className={cn(buttonVariants({ variant: "ghost" }), "h-10")}
            >
              Réinitialiser
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {filteredClubs.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-sm leading-6 text-muted-foreground">
          Aucun club ne correspond à cette recherche.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredClubs.map((club) => {
            const contact = parseClubContact(club.contact);

            return (
              <article
                key={club.name}
                className="flex min-h-56 flex-col justify-between rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/45 hover:bg-accent"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-md border border-border bg-background p-2 text-primary">
                      <Building2 className="size-5" />
                    </div>
                    <Badge variant="secondary">{club.city}</Badge>
                  </div>
                  <h2 className="mt-5 text-xl font-semibold tracking-tight">
                    {club.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {club.audience}
                  </p>
                </div>

                <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{club.venue}</span>
                  </div>
                  {contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex min-w-0 items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-foreground"
                    >
                      <Mail className="size-4 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </a>
                  ) : null}
                  {contact.phone ? (
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 shrink-0 text-primary" />
                      <span>{contact.phone}</span>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
