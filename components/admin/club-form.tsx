import Link from "next/link";
import type { ClubResource } from "@prisma/client";
import { ArrowLeft, Save } from "lucide-react";

import { saveClub } from "@/lib/admin-clubs";
import { SaveResultActions } from "@/components/admin/save-result-actions";
import { UnsavedChangesGuard } from "@/components/admin/unsaved-changes-guard";

type ClubFormProps = {
  mode: "create" | "edit";
  club?: ClubResource;
  errorMessage?: string | null;
  saved?: boolean;
};

export function ClubForm({
  mode,
  club,
  errorMessage,
  saved = false,
}: ClubFormProps) {
  const isEdit = mode === "edit";

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Clubs
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {isEdit ? "Modifier le club" : "Ajouter un club"}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Les données peuvent être importées depuis la FFTT, puis
              complétées ici pour l&apos;annuaire public.
            </p>
          </div>

          <Link
            href="/admin/clubs"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour à la liste
          </Link>
        </div>
      </section>

      {saved ? (
        <SaveResultActions
          message="Club enregistré."
          publicHref="/clubs"
          createHref="/admin/clubs/nouveau"
          listHref="/admin/clubs"
        />
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <form action={saveClub} className="grid gap-6">
        <UnsavedChangesGuard />
        {club ? <input type="hidden" name="id" value={club.id} /> : null}

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Fiche club</h3>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue={club?.name ?? ""}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="city" className="text-sm font-medium">
                  Ville
                </label>
                <input
                  id="city"
                  name="city"
                  required
                  defaultValue={club?.city ?? ""}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="venue" className="text-sm font-medium">
                  Salle
                </label>
                <input
                  id="venue"
                  name="venue"
                  required
                  defaultValue={club?.venue ?? ""}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label htmlFor="audience" className="text-sm font-medium">
                  Public
                </label>
                <input
                  id="audience"
                  name="audience"
                  required
                  defaultValue={club?.audience ?? ""}
                  placeholder="Jeunes, loisir, compétition..."
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="tables" className="text-sm font-medium">
                  Nombre de tables
                </label>
                <input
                  id="tables"
                  name="tables"
                  type="number"
                  min={0}
                  required
                  defaultValue={club?.tables ?? 0}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="contact" className="text-sm font-medium">
                  Contact
                </label>
                <input
                  id="contact"
                  name="contact"
                  required
                  defaultValue={club?.contact ?? ""}
                  placeholder="email, téléphone ou URL"
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <div className="grid gap-2">
                <label htmlFor="ffttId" className="text-sm font-medium">
                  Identifiant FFTT
                </label>
                <input
                  id="ffttId"
                  name="ffttId"
                  defaultValue={club?.ffttId ?? ""}
                  placeholder="Renseigné par la synchronisation"
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <label className="flex min-h-11 items-center gap-3 rounded-xl border border-border px-3 text-sm text-muted-foreground md:mt-7">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked={club?.active ?? true}
                  className="size-4 rounded border border-input"
                />
                Afficher ce club sur le site
              </label>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Save className="size-4" />
            {isEdit ? "Enregistrer les modifications" : "Ajouter le club"}
          </button>
        </div>
      </form>
    </div>
  );
}
