"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";

import { getGoogleMapsSearchUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";

type PlaceAutocompleteInputProps = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  className?: string;
};

type GoogleAutocomplete = {
  addListener: (eventName: "place_changed", handler: () => void) => void;
  getPlace: () => {
    formatted_address?: string;
    name?: string;
  };
};

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              componentRestrictions?: { country: string | string[] };
              fields?: string[];
            },
          ) => GoogleAutocomplete;
        };
      };
    };
    googleMapsPlacesLoading?: Promise<void>;
  }
}

function loadGooglePlaces(apiKey: string) {
  if (window.google?.maps?.places?.Autocomplete) {
    return Promise.resolve();
  }

  if (window.googleMapsPlacesLoading) {
    return window.googleMapsPlacesLoading;
  }

  window.googleMapsPlacesLoading = new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey,
    )}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject());
    document.head.appendChild(script);
  });

  return window.googleMapsPlacesLoading;
}

export function PlaceAutocompleteInput({
  id,
  name,
  label,
  defaultValue,
  placeholder,
  required = false,
  hint,
  className,
}: PlaceAutocompleteInputProps) {
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [isAutocompleteReady, setIsAutocompleteReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const input = inputRef.current;

    if (!input || !apiKey) {
      return;
    }

    let active = true;

    loadGooglePlaces(apiKey)
      .then(() => {
        if (!active || !window.google?.maps?.places?.Autocomplete) {
          return;
        }

        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          componentRestrictions: { country: "fr" },
          fields: ["formatted_address", "name"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const nextValue = place.formatted_address ?? place.name ?? input.value;

          setValue(nextValue);
        });
        setIsAutocompleteReady(true);
      })
      .catch(() => {
        setIsAutocompleteReady(false);
      });

    return () => {
      active = false;
    };
  }, [apiKey]);

  const mapsHref = value.trim() ? getGoogleMapsSearchUrl(value) : null;

  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          aria-describedby={hint ? hintId : undefined}
          className="h-11 w-full rounded-xl border border-input bg-background px-3 pl-9 pr-11 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
        {mapsHref ? (
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Voir sur Google Maps"
            title="Voir sur Google Maps"
            className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </a>
        ) : null}
      </div>
      <p id={hint ? hintId : undefined} className="text-xs leading-5 text-muted-foreground">
        {hint}
        {apiKey
          ? isAutocompleteReady
            ? " Les suggestions Google Maps sont actives."
            : " Les suggestions Google Maps se chargent."
          : " Ajoutez NEXT_PUBLIC_GOOGLE_MAPS_API_KEY pour activer les suggestions Google Maps."}
      </p>
    </div>
  );
}
