import Link from "next/link";
import { Landmark, Plus, Sparkles } from "lucide-react";

import { AdminRowActionsMenu } from "@/components/admin/admin-row-actions-menu";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  deletePeopleMember,
  getAdminCommitteeMembers,
  seedCommitteeMembers,
} from "@/lib/admin-people";
import { getCloudinaryCircleAvatarUrl } from "@/lib/cloudinary-url";
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
              <AdminSubmitButton
                icon={<Sparkles className="size-4" />}
                loadingLabel="Import en cours..."
                className="h-10 px-4"
              >
                Importer la liste actuelle
              </AdminSubmitButton>
            </form>
          ) : null}

          <Link
            href="/admin/comite/nouveau"
            className="admin-action admin-action-primary"
          >
            <Plus className="size-4" />
            Ajouter
          </Link>
        </div>
      </section>

      {message ? (
        <div className="admin-feedback">
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
                className="admin-list-row grid gap-3 px-6 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <Avatar className="size-11 border border-border bg-background">
                    {member.imageUrl ? (
                      <AvatarImage
                        src={getCloudinaryCircleAvatarUrl(member.imageUrl)}
                        alt={member.name}
                      />
                    ) : null}
                    <AvatarFallback className="text-sm font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium">{member.name}</h4>
                      <Badge variant="secondary">{member.area}</Badge>
                      <Badge variant={member.active ? "outline" : "secondary"}>
                        {member.active ? "Actif" : "Masqué"}
                      </Badge>
                      {member.imageUrl ? (
                        <Badge variant="outline">Photo</Badge>
                      ) : null}
                      <Badge variant="secondary">#{member.sortOrder}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <AdminRowActionsMenu
                    editHref={`/admin/comite/${member.id}`}
                    deleteAction={deletePeopleMember}
                    deleteFields={{ kind: "committee", id: member.id }}
                    deleteId={member.id}
                    deleteMessage="Supprimer ce membre du comité ? Cette action est définitive."
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
