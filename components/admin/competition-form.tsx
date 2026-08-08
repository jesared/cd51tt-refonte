import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

const sportStatuses = ["Brouillon", "Publié", "En cours", "À venir", "Terminé"];
const formats = ["Équipes", "Individuel", "Jeunes", "Seniors"];
const tags = ["Équipes", "Individuel", "Jeunes", "Seniors"];
const actionFields = [
  { id: "calendarUrl", label: "Calendrier" },
  { id: "resultsUrl", label: "Résultats" },
  { id: "convocationUrl", label: "Convocation" },
  { id: "rulesUrl", label: "Règlement" },
  { id: "registrationUrl", label: "Inscription" },
];

export function CompetitionForm() {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Compétitions
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Créer une compétition
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Préparez tous les champs nécessaires pour alimenter la page
              publique, le calendrier et les documents liés.
            </p>
          </div>

          <Link
            href="/admin/competitions"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour à la liste
          </Link>
        </div>
      </section>

      <div className="admin-feedback">
        Formulaire prêt côté interface. L’enregistrement sera activé avec le
        modèle Prisma `CompetitionResource`.
      </div>

      <form className="grid gap-6">
        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Fiche compétition</h3>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titre
              </label>
              <input
                id="title"
                name="title"
                required
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="summary" className="text-sm font-medium">
                Résumé
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={4}
                required
                className="rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label htmlFor="period" className="text-sm font-medium">
                  Période / saison
                </label>
                <input
                  id="period"
                  name="period"
                  placeholder="Septembre 2026 - Juin 2027"
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Statut principal
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue="Brouillon"
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  {sportStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="statusDetail" className="text-sm font-medium">
                  Détail du statut
                </label>
                <input
                  id="statusDetail"
                  name="statusDetail"
                  placeholder="Phase 2 en cours"
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_2fr_160px]">
              <div className="grid gap-2">
                <label htmlFor="format" className="text-sm font-medium">
                  Format
                </label>
                <select
                  id="format"
                  name="format"
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  {formats.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-medium">Tags</legend>
                <div className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-2 lg:grid-cols-4">
                  {tags.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <input
                        type="checkbox"
                        name="tags"
                        value={tag}
                        className="size-4 rounded border border-input"
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-2">
                <label htmlFor="sortOrder" className="text-sm font-medium">
                  Ordre d’affichage
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Échéance et organisation</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="nextDate" className="text-sm font-medium">
                Prochaine échéance
              </label>
              <input
                id="nextDate"
                name="nextDate"
                placeholder="Journée 4 - 14 septembre 2026"
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="registrationDeadline"
                className="text-sm font-medium"
              >
                Date limite d’inscription
              </label>
              <input
                id="registrationDeadline"
                name="registrationDeadline"
                placeholder="28 septembre 2026"
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="location" className="text-sm font-medium">
                Lieu
              </label>
              <input
                id="location"
                name="location"
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="manager" className="text-sm font-medium">
                Responsable
              </label>
              <input
                id="manager"
                name="manager"
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Liens d’action</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {actionFields.map((field) => (
              <div key={field.id} className="grid gap-2">
                <label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  placeholder="https://... ou /documents?categorie=..."
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            disabled
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground opacity-60"
          >
            <Save className="size-4" />
            Créer la compétition
          </button>
        </div>
      </form>
    </div>
  );
}
