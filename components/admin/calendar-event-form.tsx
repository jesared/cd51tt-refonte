import Link from "next/link";
import { CalendarEventType, type CalendarEvent } from "@prisma/client";
import { ArrowLeft, Save } from "lucide-react";

import { saveCalendarEvent } from "@/lib/admin-calendar";
import { competitions } from "@/lib/mock-data";

type CalendarEventFormProps = {
  event?: CalendarEvent;
  mode: "create" | "edit";
  errorMessage?: string | null;
};

function toDateInputValue(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  return new Date(date).toISOString().slice(0, 10);
}

const eventTypes = [
  { value: CalendarEventType.JOURNEE, label: "Journée" },
  { value: CalendarEventType.CONVOCATION, label: "Convocation" },
  { value: CalendarEventType.INSCRIPTION, label: "Inscription" },
  { value: CalendarEventType.RESULTAT, label: "Résultat" },
];

export function CalendarEventForm({
  event,
  errorMessage,
  mode,
}: CalendarEventFormProps) {
  const isEdit = mode === "edit";

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Sportif
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {isEdit ? "Modifier l'échéance" : "Nouvelle échéance"}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Rattachez un événement à une compétition pour alimenter le
              calendrier public, la page compétitions et l&apos;agenda admin.
            </p>
          </div>

          <Link
            href="/admin/calendrier"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour au calendrier
          </Link>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <form action={saveCalendarEvent} className="grid gap-6">
        {event ? <input type="hidden" name="id" value={event.id} /> : null}

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Informations</h3>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="competitionId" className="text-sm font-medium">
                Compétition
              </label>
              <select
                id="competitionId"
                name="competitionId"
                defaultValue={event?.competitionId ?? ""}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                <option value="">Événement général</option>
                {competitions.map((competition) => (
                  <option key={competition.id} value={competition.id}>
                    {competition.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_220px]">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Libellé
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  defaultValue={event?.title ?? ""}
                  placeholder="Journée 1, tour 2, limite inscription..."
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={toDateInputValue(event?.date)}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  defaultValue={event?.type ?? CalendarEventType.JOURNEE}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px]">
              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Lieu
                </label>
                <input
                  id="location"
                  name="location"
                  required
                  defaultValue={event?.location ?? ""}
                  placeholder="Salle, club recevant, extranet..."
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="sortOrder" className="text-sm font-medium">
                  Ordre
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={event?.sortOrder ?? 0}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border px-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="published"
                defaultChecked={event?.published ?? false}
                className="size-4 rounded border border-input"
              />
              Publier cette échéance sur le site
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Save className="size-4" />
            {isEdit ? "Enregistrer les modifications" : "Créer l'échéance"}
          </button>
        </div>
      </form>
    </div>
  );
}
