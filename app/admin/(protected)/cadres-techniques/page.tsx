import Link from "next/link";
import { Pencil, Plus, Sparkles, Trash2, UserRoundCheck } from "lucide-react";

import { DeleteConfirmationForm } from "@/components/admin/delete-confirmation-form";
import { Badge } from "@/components/ui/badge";
import {
  deletePeopleMember,
  getAdminTechnicalStaffMembers,
  seedTechnicalStaffMembers,
} from "@/lib/admin-people";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Admin cadres techniques",
  description: "Gestion des cadres techniques du Comité Marne de tennis de table.",
  path: "/admin/cadres-techniques",
});

type AdminCadresTechniquesPageProps = {
  searchParams?: {
    saved?: string;
    deleted?: string;
    seeded?: string;
    error?: string;
  };
};

export default async function AdminCadresTechniquesPage({
  searchParams,
}: AdminCadresTechniquesPageProps) {
  const members = await getAdminTechnicalStaffMembers();
  const message =
    searchParams?.saved === "1"
      ? "Le cadre technique a été enregistré."
      : searchParams?.deleted === "1"
        ? "Le cadre technique a été supprimé."
        : searchParams?.seeded === "1"
          ? "Les cadres actuels ont été importés."
          : searchParams?.seeded === "0"
            ? "Des cadres existent déjà. Import ignoré."
            : searchParams?.error
              ? decodeURIComponent(searchParams.error)
              : null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <UserRoundCheck className="size-4" />
            Encadrement
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer les cadres techniques
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Ajoutez, modifiez ou masquez les cadres affichés sur la page cadres
            techniques.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {members.length === 0 ? (
            <form action={seedTechnicalStaffMembers}>
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
            href="/admin/cadres-techniques/nouveau"
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
          <h3 className="font-medium">Liste des cadres</h3>
        </div>

        {members.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun cadre technique n&apos;est encore en base. Importez la liste
            actuelle ou ajoutez une fiche manuellement.
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
                    <Badge variant="secondary">
                      {member.area ?? "Technique"}
                    </Badge>
                    <Badge variant={member.active ? "outline" : "secondary"}>
                      {member.active ? "Actif" : "Masqué"}
                    </Badge>
                    {member.imageUrl ? (
                      <Badge variant="outline">Photo</Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {member.role ?? "Cadre technique"}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {member.mission ??
                      "Informations complémentaires à ajouter."}
                  </p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Ordre</p>
                  <p className="mt-2">{member.sortOrder}</p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    href={`/admin/cadres-techniques/${member.id}`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                    Modifier
                  </Link>
                  <DeleteConfirmationForm
                    action={deletePeopleMember}
                    message="Supprimer ce cadre technique ? Cette action est définitive."
                  >
                    <input type="hidden" name="kind" value="technical" />
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
