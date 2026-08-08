import { CalendarDays, Eye, EyeOff, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { createPageMetadata } from "@/lib/metadata";
import { competitions } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Admin calendrier",
  description: "Pilotage des échéances sportives du comité.",
  path: "/admin/calendrier",
});

const eventTypes = ["Journée", "Convocation", "Inscription", "Résultat"];

const calendarEvents = [
  {
    competitionTitle: "Championnat par équipes",
    date: "2026-09-14",
    label: "Journée 4",
    type: "Journée",
    location: "Salles des clubs recevants",
    published: true,
  },
  {
    competitionTitle: "Critérium fédéral",
    date: "2026-09-28",
    label: "Limite d’inscription tour 1",
    type: "Inscription",
    location: "Extranet clubs",
    published: true,
  },
  {
    competitionTitle: "Critérium fédéral",
    date: "2026-10-11",
    label: "Tour 1",
    type: "Journée",
    location: "Complexe René Tys, Reims",
    published: false,
  },
  {
    competitionTitle: "Coupe et finales départementales",
    date: "2027-05-30",
    label: "Finales départementales",
    type: "Journée",
    location: "Lieu à confirmer",
    published: false,
  },
];

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export default function AdminCalendrierPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Sportif
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer le calendrier
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Centralisez les journées, tours, finales, convocations, résultats et
            limites d’inscription rattachés à une compétition.
          </p>
        </div>

        <a href="#nouvelle-echeance" className="admin-action admin-action-primary">
          <Plus className="size-4" />
          Nouvelle échéance
        </a>
      </section>

      <div className="admin-feedback">
        Calendrier prêt côté interface. Les événements seront persistés avec un
        futur modèle Prisma relié aux compétitions.
      </div>

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium">Événements du calendrier</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {calendarEvents.length} échéances préparées
            </p>
          </div>
          <Badge variant="outline">Données de démonstration</Badge>
        </div>

        <div className="hidden border-b border-border px-6 py-3 text-xs font-medium uppercase text-muted-foreground xl:grid xl:grid-cols-[minmax(180px,1.2fr)_150px_160px_140px_minmax(180px,1fr)_120px] xl:gap-4">
          <span>Compétition</span>
          <span>Date</span>
          <span>Libellé</span>
          <span>Type</span>
          <span>Lieu</span>
          <span>Publication</span>
        </div>

        <div className="divide-y divide-border">
          {calendarEvents.map((event) => (
            <article
              key={`${event.competitionTitle}-${event.date}-${event.label}`}
              className="admin-list-row grid gap-4 px-6 py-4 xl:grid-cols-[minmax(180px,1.2fr)_150px_160px_140px_minmax(180px,1fr)_120px] xl:items-center"
            >
              <div className="min-w-0">
                <h4 className="font-medium">{event.competitionTitle}</h4>
                <p className="mt-1 text-sm text-muted-foreground xl:hidden">
                  {formatEventDate(event.date)} · {event.label}
                </p>
              </div>

              <p className="text-sm text-foreground">
                {formatEventDate(event.date)}
              </p>
              <p className="text-sm text-foreground">{event.label}</p>
              <span className="w-fit rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                {event.type}
              </span>
              <p className="text-sm text-muted-foreground">{event.location}</p>
              <span
                className={
                  event.published
                    ? "inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300"
                    : "inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                }
              >
                {event.published ? (
                  <Eye className="size-3.5" />
                ) : (
                  <EyeOff className="size-3.5" />
                )}
                {event.published ? "Publié" : "Brouillon"}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section
        id="nouvelle-echeance"
        className="rounded-[1.5rem] border border-border bg-background p-6"
      >
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Nouvelle échéance</h3>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Rattachez un événement à une compétition pour l’afficher ensuite
            dans le calendrier public et les prochaines échéances.
          </p>
        </div>

        <form className="mt-5 grid gap-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_180px_1fr]">
            <div className="grid gap-2">
              <label htmlFor="competitionId" className="text-sm font-medium">
                Compétition
              </label>
              <select
                id="competitionId"
                name="competitionId"
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                {competitions.map((competition) => (
                  <option key={competition.title} value={competition.title}>
                    {competition.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="label" className="text-sm font-medium">
                Libellé
              </label>
              <input
                id="label"
                name="label"
                placeholder="Journée 1, tour 2, finales..."
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <select
                id="type"
                name="type"
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="location" className="text-sm font-medium">
                Lieu
              </label>
              <input
                id="location"
                name="location"
                placeholder="Salle, club recevant, extranet..."
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <label className="flex min-h-11 items-center gap-3 rounded-xl border border-border px-3 text-sm text-muted-foreground lg:mt-7">
              <input
                type="checkbox"
                name="published"
                className="size-4 rounded border border-input"
              />
              Publier l’événement
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground opacity-60"
            >
              <CalendarDays className="size-4" />
              Créer l’échéance
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
