import Link from "next/link";
import { Landmark, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";

import { DeleteConfirmationForm } from "@/components/admin/delete-confirmation-form";
import { Badge } from "@/components/ui/badge";
import {
  deletePeopleMember,
  getAdminCommitteeMembers,
  seedCommitteeMembers,
} from "@/lib/admin-people";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Admin comité",
  description: "Gestion des membres du Comité Marne de tennis de table.",
  path: "/admin/comite",
});

type AdminComitePageProps = {
  searchParams?: {
    saved?: string;
    deleted?: string;
    seeded?: string;
    error?: string;
  };
};

export default async function AdminComitePage({
  searchParams,
}: AdminComitePageProps) {
  const members = await getAdminCommitteeMembers();
  const message =
    searchParams?.saved === "1"
      ? "Le membre a été enregistré."
      : searchParams?.deleted === "1"
        ? "Le membre a été supprimé."
        : searchParams?.seeded === "1"
          ? "Les membres actuels ont été importés."
          : searchParams?.seeded === "0"
            ? "Des membres existent déjà. Import ignoré."
            : searchParams?.error
              ? decodeURIComponent(searchParams.error)
              : null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Landmark className="size-4" />
            Gouvernance
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer les membres du comité
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Ajoutez, modifiez ou masquez les responsables affichés sur la page
            comité.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {members.length === 0 ? (
            <form action={seedCommitteeMembers}>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <Sparkles className="size-4" />
                Importer la liste actuelle
              </button>
            </form>
          ) : null}

          <Link
            href="/admin/comite/nouveau"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" />
            Ajouter
          </Link>
        </div>
      </section>

      {message ? (
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          {message}
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-medium">Liste des membres</h3>
        </div>

        {members.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun membre n&apos;est encore en base. Importez la liste actuelle
            ou ajoutez une fiche manuellement.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {members.map((member) => (
              <article
                key={member.id}
                className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_8rem_14rem]"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-medium">{member.name}</h4>
                    <Badge variant="secondary">{member.area}</Badge>
                    <Badge variant={member.active ? "outline" : "secondary"}>
                      {member.active ? "Actif" : "Masqué"}
                    </Badge>
                    {member.imageUrl ? (
                      <Badge variant="outline">Photo</Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {member.mission}
                  </p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Ordre</p>
                  <p className="mt-2">{member.sortOrder}</p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    href={`/admin/comite/${member.id}`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                    Modifier
                  </Link>
                  <DeleteConfirmationForm
                    action={deletePeopleMember}
                    message="Supprimer ce membre du comité ? Cette action est définitive."
                  >
                    <input type="hidden" name="kind" value="committee" />
                    <input type="hidden" name="id" value={member.id} />
                    <button
                      type="submit"
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-destructive/20 px-3 text-sm text-destructive transition hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                      Supprimer
                    </button>
                  </DeleteConfirmationForm>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
