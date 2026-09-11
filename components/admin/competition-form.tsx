import Link from "next/link";
import type { CalendarEvent, CompetitionResource } from "@prisma/client";
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  Eye,
  ExternalLink,
  Save,
} from "lucide-react";

import {
  COMPETITION_ACTION_TYPES,
  COMPETITION_SPORT_STATUS_OPTIONS,
  COMPETITION_TAG_OPTIONS,
  saveCompetition,
} from "@/lib/admin-competitions";
import { SaveResultActions } from "@/components/admin/save-result-actions";
import { ConfirmableAdminForm } from "@/components/admin/confirmable-admin-form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { PlaceAutocompleteInput } from "@/components/admin/place-autocomplete-input";
import { UnsavedChangesGuard } from "@/components/admin/unsaved-changes-guard";
import {
  formatCalendarEventDate,
  getCalendarEventTypeLabel,
} from "@/lib/calendar";
import type { CompetitionAction, CompetitionTag } from "@/lib/mock-data";

type CompetitionFormProps = {
  mode: "create" | "edit";
  competition?: CompetitionResource;
  linkedCalendarEvents?: CalendarEvent[];
  errorMessage?: string | null;
  saved?: boolean;
  canPublish?: boolean;
};

const actionFields = [
  { type: "calendar", label: "Échéances" },
  { type: "results", label: "Résultats" },
  { type: "convocation", label: "Convocation" },
  { type: "rules", label: "Règlement" },
  { type: "registration", label: "Inscription" },
] satisfies Array<{
  type: CompetitionAction["type"];
  label: string;
}>;

const defaultActions: CompetitionAction[] = [
  {
    label: "Voir les échéances",
    href: "/calendrier",
    type: "calendar",
    primary: true,
  },
  {
    label: "Documents",
    href: "/documents",
    type: "rules",
  },
];

function parseJsonArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function getAction(
  actions: CompetitionAction[],
  type: CompetitionAction["type"],
) {
  return actions.find((action) => action.type === type);
}

const frenchMonthIndexes: Record<string, string> = {
  janvier: "01",
  fevrier: "02",
  février: "02",
  mars: "03",
  avril: "04",
  mai: "05",
  juin: "06",
  juillet: "07",
  aout: "08",
  août: "08",
  septembre: "09",
  octobre: "10",
  novembre: "11",
  decembre: "12",
  décembre: "12",
};

function toDateInputValue(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoDateMatch) {
    return isoDateMatch[0];
  }

  const frenchDateMatch = value
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})\s+([a-zéû]+)\s+(\d{4})$/i);

  if (!frenchDateMatch) {
    return "";
  }

  const [, day, month, year] = frenchDateMatch;
  const monthNumber = frenchMonthIndexes[month];

  return monthNumber ? `${year}-${monthNumber}-${day.padStart(2, "0")}` : "";
}

export function CompetitionForm({
  mode,
  competition,
  linkedCalendarEvents = [],
  errorMessage,
  saved = false,
  canPublish = true,
}: CompetitionFormProps) {
  const isEdit = mode === "edit";
  const selectedTags = parseJsonArray<CompetitionTag>(competition?.tags, []);
  const actions = parseJsonArray<CompetitionAction>(
    competition?.actions,
    defaultActions,
  );
  const primaryActionType =
    actions.find((action) => action.primary)?.type ?? actions[0]?.type ?? "calendar";
  const publicHref =
    competition?.status === "PUBLISHED"
      ? `/competitions/${competition.id}`
      : null;
  const previewHref = competition
    ? `/admin/competitions/${competition.id}/preview`
    : null;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Compétitions
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {isEdit ? "Modifier la compétition" : "Créer une compétition"}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Préparez tous les champs nécessaires pour alimenter la page
              publique, les échéances et les documents liés.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {previewHref ? (
              <Link
                href={previewHref}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <Eye className="size-4" />
                Prévisualiser
              </Link>
            ) : null}
            {publicHref ? (
              <Link
                href={publicHref}
                target="_blank"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <ExternalLink className="size-4" />
                Voir sur le site
              </Link>
            ) : null}
            <Link
              href="/admin/competitions"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Retour à la liste
            </Link>
          </div>
        </div>
      </section>

      {saved ? (
        <SaveResultActions
          message="Compétition enregistrée."
          publicHref={publicHref}
          editHref={competition ? `/admin/competitions/${competition.id}` : null}
          listHref="/admin/competitions"
        />
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <ConfirmableAdminForm
        action={saveCompetition}
        className="grid gap-6"
        contentLabel="cette compétition"
        contentType="competition"
        currentHasImage={Boolean(competition?.imageUrl)}
      >
        <UnsavedChangesGuard />
        {competition ? (
          <input type="hidden" name="id" value={competition.id} />
        ) : null}

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
                defaultValue={competition?.title ?? ""}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="summary" className="text-sm font-medium">
                Information courte visible sur le site
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={4}
                defaultValue={competition?.summary ?? ""}
                className="rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Facultatif. Si rien n’est indiqué, le site affichera :
                Consulter le règlement pour les modalités complètes.
              </p>
            </div>

            <ImageUploadField initialImageUrl={competition?.imageUrl} />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label htmlFor="period" className="text-sm font-medium">
                  Période / saison
                </label>
                <input
                  id="period"
                  name="period"
                  required
                  placeholder="Septembre 2026 - Juin 2027"
                  defaultValue={competition?.period ?? ""}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
                <p className="text-xs leading-5 text-muted-foreground">
                  Exemple : Septembre 2026 - juin 2027, ou 4 tours / saison.
                </p>
              </div>

              <div className="grid gap-2">
                <label htmlFor="sportStatus" className="text-sm font-medium">
                  Statut sportif
                </label>
                <select
                  id="sportStatus"
                  name="sportStatus"
                  defaultValue={competition?.sportStatus ?? "À venir"}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  {COMPETITION_SPORT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-5 text-muted-foreground">
                  Choisissez l’état général visible sur la carte publique.
                </p>
              </div>

              <div className="grid gap-2">
                <label htmlFor="statusDetail" className="text-sm font-medium">
                  Détail du statut
                </label>
                <input
                  id="statusDetail"
                  name="statusDetail"
                  placeholder="Phase 2 en cours"
                  defaultValue={competition?.statusDetail ?? ""}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
                <p className="text-xs leading-5 text-muted-foreground">
                  Facultatif. Servez-vous-en pour préciser le statut, par
                  exemple : Phase 2 en cours, inscriptions ouvertes, finales à
                  venir.
                </p>
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
                  defaultValue={competition?.format ?? "Équipes"}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  {COMPETITION_TAG_OPTIONS.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-5 text-muted-foreground">
                  Sélectionnez le format principal affiché en badge.
                </p>
              </div>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-medium">Tags</legend>
                <div className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-2 lg:grid-cols-4">
                  {COMPETITION_TAG_OPTIONS.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <input
                        type="checkbox"
                        name="tags"
                        value={tag}
                        defaultChecked={selectedTags.includes(tag)}
                        className="size-4 rounded border border-input"
                      />
                      {tag}
                    </label>
                  ))}
                </div>
                <p className="text-xs leading-5 text-muted-foreground">
                  Les tags servent aux filtres de la page compétitions. Cochez
                  tous les publics concernés.
                </p>
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
                  defaultValue={competition?.sortOrder ?? 0}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
                <p className="text-xs leading-5 text-muted-foreground">
                  Plus le nombre est petit, plus la compétition remonte dans la
                  liste.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Échéance et organisation</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="grid gap-2 rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium">Prochaine échéance</p>
              <p className="text-sm text-muted-foreground">
                Elle est calculée automatiquement à partir des échéances liées
                à cette compétition.
              </p>
              {competition ? (
                <Link
                  href={`/admin/calendrier/nouveau?competition=${competition.id}`}
                  className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <CalendarPlus className="size-4" />
                  Ajouter une échéance liée
                </Link>
              ) : (
                <p className="text-xs leading-5 text-muted-foreground">
                  Créez d’abord la compétition, puis ajoutez ses échéances
                  depuis cette fiche.
                </p>
              )}
              <input
                type="hidden"
                name="nextDate"
                value={competition?.nextDate ?? ""}
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
                type="date"
                required
                defaultValue={toDateInputValue(competition?.registrationDeadline)}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Sélectionnez la date limite. Si les inscriptions sont déjà
                closes, gardez la vraie date de clôture.
              </p>
            </div>

            <PlaceAutocompleteInput
              id="location"
              name="location"
              label="Lieu"
              required
              defaultValue={competition?.location ?? ""}
              placeholder="Complexe René Tys, salles des clubs recevants..."
              hint="Exemple : Complexe René Tys, salles des clubs recevants, lieu à confirmer."
            />

            <div className="grid gap-2">
              <label htmlFor="manager" className="text-sm font-medium">
                Responsable
              </label>
              <input
                id="manager"
                name="manager"
                required
                defaultValue={competition?.manager ?? ""}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Nom de la personne référente ou du responsable de la commission.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Échéances liées</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ces dates alimentent la page publique des échéances et la
                prochaine échéance affichée sur la compétition.
              </p>
            </div>

            {competition ? (
              <Link
                href={`/admin/calendrier/nouveau?competition=${competition.id}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <CalendarPlus className="size-4" />
                Ajouter une échéance pour cette compétition
              </Link>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3">
            {competition ? (
              linkedCalendarEvents.length > 0 ? (
                linkedCalendarEvents.map((event) => (
                  <div
                    key={event.id}
                    className="grid gap-3 rounded-xl border border-border px-4 py-3 md:grid-cols-[1fr_auto] md:items-center"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                          {getCalendarEventTypeLabel(event.type)}
                        </span>
                        <span className="rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                          {event.published ? "Publié" : "Brouillon"}
                        </span>
                      </div>
                      <p className="mt-2 font-medium">{event.title}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" />
                        {formatCalendarEventDate(event.date)}
                        {event.location ? ` · ${event.location}` : null}
                      </p>
                    </div>
                    <Link
                      href={`/admin/calendrier/${event.id}`}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                      Modifier
                      <ExternalLink className="size-4" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                  Aucune échéance n’est encore liée à cette compétition.
                </div>
              )
            ) : (
              <div className="rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
                Enregistrez d’abord la compétition, puis ajoutez ses échéances
                depuis cette fiche.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Liens d’action</h3>
          <div className="mt-5 grid gap-4">
            {actionFields.map((field, index) => {
              const action = getAction(actions, field.type);
              const fieldId = `action-${index}`;

              return (
                <div
                  key={field.type}
                  className="grid gap-3 rounded-xl border border-border p-3 md:grid-cols-[160px_minmax(0,1fr)_minmax(0,1.2fr)_120px] md:items-end"
                >
                  <input
                    type="hidden"
                    name={`${fieldId}-type`}
                    value={field.type}
                  />
                  <div className="grid gap-2">
                    <label
                      htmlFor={`${fieldId}-label`}
                      className="text-sm font-medium"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`${fieldId}-label`}
                      name={`${fieldId}-label`}
                      defaultValue={action?.label ?? ""}
                      placeholder={field.label}
                      className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                    />
                    <p className="text-xs leading-5 text-muted-foreground">
                      Texte du bouton affiché au public.
                    </p>
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <label
                      htmlFor={`${fieldId}-href`}
                      className="text-sm font-medium"
                    >
                      URL
                    </label>
                    <input
                      id={`${fieldId}-href`}
                      name={`${fieldId}-href`}
                      defaultValue={action?.href ?? ""}
                      placeholder="https://... ou /documents?categorie=..."
                      className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                    />
                    <p className="text-xs leading-5 text-muted-foreground">
                      Lien interne ou externe. Exemple : /calendrier,
                      /documents, ou une URL complète.
                    </p>
                  </div>
                  <label className="flex min-h-11 items-center gap-2 rounded-xl border border-border px-3 text-sm text-muted-foreground">
                    <input
                      type="radio"
                      name="primaryAction"
                      value={field.type}
                      defaultChecked={primaryActionType === field.type}
                      className="size-4 border border-input"
                    />
                    Principal
                  </label>
                </div>
              );
            })}
            <input
              type="hidden"
              name="actionTypes"
              value={COMPETITION_ACTION_TYPES.join(",")}
            />
          </div>
        </section>

        {canPublish ? (
          <section className="rounded-[1.5rem] border border-border bg-background p-6">
            <h3 className="text-lg font-semibold">Publication</h3>
            <div className="mt-5">
              <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border px-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={competition?.status === "PUBLISHED"}
                  className="size-4 rounded border border-input"
                />
                Publier cette compétition sur le site
              </label>
            </div>
          </section>
        ) : (
          <section className="rounded-[1.5rem] border border-border bg-background p-6">
            <h3 className="text-lg font-semibold">Publication</h3>
            <p className="mt-3 rounded-xl border border-border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
              Enregistré sans changer l&apos;état Publié / Brouillon.
            </p>
          </section>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Save className="size-4" />
            {isEdit ? "Enregistrer les modifications" : "Créer la compétition"}
          </button>
        </div>
      </ConfirmableAdminForm>
    </div>
  );
}
