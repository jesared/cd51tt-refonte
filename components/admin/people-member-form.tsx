import Link from "next/link";
import type {
  CommitteeMemberResource,
  TechnicalStaffMemberResource,
} from "@prisma/client";
import { ArrowLeft, Save } from "lucide-react";

import { savePeopleMember } from "@/lib/admin-people";

type PeopleKind = "committee" | "technical";

type PeopleMember =
  | CommitteeMemberResource
  | TechnicalStaffMemberResource;

type PeopleMemberFormProps = {
  kind: PeopleKind;
  mode: "create" | "edit";
  member?: PeopleMember;
  errorMessage?: string | null;
};

const labels = {
  committee: {
    section: "Comité",
    titleCreate: "Ajouter un membre",
    titleEdit: "Modifier le membre",
    backHref: "/admin/comite",
    rolePlaceholder: "Président, secrétaire, responsable...",
    areaPlaceholder: "Sportif, administration, arbitrage...",
    activeLabel: "Afficher ce membre sur le site",
  },
  technical: {
    section: "Cadres techniques",
    titleCreate: "Ajouter un cadre technique",
    titleEdit: "Modifier le cadre technique",
    backHref: "/admin/cadres-techniques",
    rolePlaceholder: "Cadre technique, entraîneur...",
    areaPlaceholder: "Technique, formation, jeunes...",
    activeLabel: "Afficher ce cadre sur le site",
  },
};

export function PeopleMemberForm({
  kind,
  mode,
  member,
  errorMessage,
}: PeopleMemberFormProps) {
  const copy = labels[kind];
  const isEdit = mode === "edit";

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {copy.section}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {isEdit ? copy.titleEdit : copy.titleCreate}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Modifiez les informations affichées sur le site public sans
              repasser par le code.
            </p>
          </div>

          <Link
            href={copy.backHref}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour à la liste
          </Link>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <form
        action={savePeopleMember}
        encType="multipart/form-data"
        className="grid gap-6"
      >
        <input type="hidden" name="kind" value={kind} />
        {member ? <input type="hidden" name="id" value={member.id} /> : null}

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Fiche</h3>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue={member?.name ?? ""}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Fonction
                </label>
                <input
                  id="role"
                  name="role"
                  defaultValue={member?.role ?? ""}
                  placeholder={copy.rolePlaceholder}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="area" className="text-sm font-medium">
                  Domaine
                </label>
                <input
                  id="area"
                  name="area"
                  defaultValue={member?.area ?? ""}
                  placeholder={copy.areaPlaceholder}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="initials" className="text-sm font-medium">
                  Initiales
                </label>
                <input
                  id="initials"
                  name="initials"
                  required
                  maxLength={4}
                  defaultValue={member?.initials ?? ""}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm uppercase outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="mission" className="text-sm font-medium">
                Mission / informations
              </label>
              <textarea
                id="mission"
                name="mission"
                rows={5}
                defaultValue={member?.mission ?? ""}
                className="rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">
                  Image existante
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={member?.imageUrl ?? ""}
                  placeholder="https://... ou /images/photo.jpg"
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="imageUpload" className="text-sm font-medium">
                  Photo Cloudinary
                </label>
                <input
                  id="imageUpload"
                  name="imageUpload"
                  type="file"
                  accept="image/*"
                  className="h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm file:text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[12rem_1fr]">
              <div className="grid gap-2">
                <label htmlFor="sortOrder" className="text-sm font-medium">
                  Ordre
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min={0}
                  defaultValue={member?.sortOrder ?? 0}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <label className="flex min-h-11 items-center gap-3 rounded-xl border border-border px-3 text-sm text-muted-foreground md:mt-7">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked={member?.active ?? true}
                  className="size-4 rounded border border-input"
                />
                {copy.activeLabel}
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
            {isEdit ? "Enregistrer les modifications" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}
