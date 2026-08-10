"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FilterOption = {
  label: string;
  value: string;
};

type FilterConfig = {
  name: string;
  label: string;
  defaultLabel: string;
  options: FilterOption[];
};

type AdminListControlsProps = {
  searchPlaceholder: string;
  filters?: FilterConfig[];
  sortOptions: FilterOption[];
};

const CONTROL_PARAMS = new Set(["q", "tri", "statut", "categorie", "ville", "type"]);

export function AdminListControls({
  searchPlaceholder,
  filters = [],
  sortOptions,
}: AdminListControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const activeFilters = useMemo(
    () =>
      query.trim().length > 0 ||
      Array.from(CONTROL_PARAMS).some((param) => {
        if (param === "q") {
          return false;
        }

        return searchParams.has(param);
      }),
    [query, searchParams],
  );

  function updateParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    params.delete("saved");
    params.delete("deleted");
    params.delete("seeded");
    params.delete("published");
    params.delete("unpublished");
    params.delete("fftt");
    params.delete("error");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function applySearch() {
    updateParam("q", query.trim());
  }

  function resetControls() {
    const params = new URLSearchParams(searchParams.toString());

    CONTROL_PARAMS.forEach((param) => params.delete(param));
    setQuery("");
    router.replace(params.size ? `${pathname}?${params.toString()}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div className="grid gap-3 rounded-lg border border-border bg-background p-3 lg:grid-cols-[minmax(260px,1fr)_repeat(3,minmax(10rem,0.26fr))] lg:items-end xl:grid-cols-[minmax(260px,1fr)_repeat(3,minmax(10rem,0.24fr))_auto]">
      <label className="grid gap-1">
        <span className="text-xs font-medium text-muted-foreground">
          Recherche
        </span>
        <span className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applySearch();
              }
            }}
            placeholder={searchPlaceholder}
            className="h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 pl-9 pr-9 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                updateParam("q", "");
              }}
              className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Effacer la recherche"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </span>
      </label>

      {filters.map((filter) => (
        <label key={filter.name} className="grid gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {filter.label}
          </span>
          <select
            value={searchParams.get(filter.name) ?? ""}
            onChange={(event) => updateParam(filter.name, event.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50"
          >
            <option value="">{filter.defaultLabel}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}

      <label className="grid gap-1">
        <span className="text-xs font-medium text-muted-foreground">Tri</span>
        <select
          value={searchParams.get("tri") ?? sortOptions[0]?.value ?? ""}
          onChange={(event) => updateParam("tri", event.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-3 focus:ring-ring/50"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex min-h-10 flex-wrap items-center gap-2 lg:col-span-4 lg:justify-end xl:col-span-1">
        <button
          type="button"
          onClick={applySearch}
          className={cn(buttonVariants({ variant: "outline" }), "h-10")}
        >
          Appliquer
        </button>
        {activeFilters ? (
          <button
            type="button"
            onClick={resetControls}
            className={cn(buttonVariants({ variant: "ghost" }), "h-10")}
          >
            Réinitialiser
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
