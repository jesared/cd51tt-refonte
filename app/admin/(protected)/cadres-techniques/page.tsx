import Link from "next/link";
import { Plus, Sparkles, UserRoundCheck } from "lucide-react";

import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminRowActionsMenu } from "@/components/admin/admin-row-actions-menu";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  deletePeopleMember,
  getAdminTechnicalStaffMembers,
  seedTechnicalStaffMembers,
} from "@/lib/admin-people";
import { getCloudinaryCircleAvatarUrl } from "@/lib/cloudinary-url";
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
    q?: string;
    statut?: string;
    categorie?: string;
    tri?: string;
  };
};

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default async function AdminCadresTechniquesPage({
  searchParams,
}: AdminCadresTechniquesPageProps) {
  const members = await getAdminTechnicalStaffMembers();
  const areas = Array.from(
    new Set(members.map((member) => member.area ?? "Technique")),
  ).sort((a, b) => a.localeCompare(b, "fr"));
  const query = normalizeSearchValue(searchParams?.q ?? "");
  const statusFilter = searchParams?.statut;
  const areaFilter = searchParams?.categorie;
  const sortMode = searchParams?.tri ?? "order-asc";
  const filteredMembers = members
    .filter((member) => {
      const area = member.area ?? "Technique";
      const matchesSearch =
        !query ||
        normalizeSearchValue(
          `${member.name} ${member.role ?? ""} ${area} ${member.mission ?? ""}`,
        ).includes(query);
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active" && member.active) ||
        (statusFilter === "hidden" && !member.active) ||
        (statusFilter === "photo" && Boolean(member.imageUrl));
      const matchesArea = !areaFilter || area === areaFilter;

      return matchesSearch && matchesStatus && matchesArea;
    })
    .sort((first, second) => {
      if (sortMode === "name-asc") {
        return first.name.localeCompare(second.name, "fr");
      }

      if (sortMode === "name-desc") {
        return second.name.localeCompare(first.name, "fr");
      }

      return sortMode === "order-desc"
        ? second.sortOrder - first.sortOrder
        : first.sortOrder - second.sortOrder;
    });
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
      <section className="grid gap-6 rounded-[1.5rem] border border-border bg-background p-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-center gap-3">
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

        <div className="flex flex-col justify-center gap-3 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          {members.length === 0 ? (
            <form action={seedTechnicalStaffMembers} className="contents">
              <AdminSubmitButton
                icon={<Sparkles className="size-4" />}
                loadingLabel="Import en cours..."
                className="h-11 w-full px-4"
              >
                Importer la liste actuelle
              </AdminSubmitButton>
            </form>
          ) : null}

          <Link
            href="/admin/cadres-techniques/nouveau"
            className="admin-action admin-action-primary h-11 w-full"
          >
            <Plus className="size-4" />
            Ajouter un cadre
          </Link>
        </div>
      </section>

      {message ? <div className="admin-feedback">{message}</div> : null}

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="space-y-4 border-b border-border px-6 py-4">
          <div>
            <h3 className="font-medium">Liste des cadres</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredMembers.length} sur {members.length} cadre(s)
            </p>
          </div>
          <AdminListControls
            searchPlaceholder="Nom, rôle, mission ou zone"
            filters={[
              {
                name: "statut",
                label: "Statut",
                defaultLabel: "Tous les statuts",
                options: [
                  { label: "Actifs", value: "active" },
                  { label: "Masqués", value: "hidden" },
                  { label: "Avec photo", value: "photo" },
                ],
              },
              {
                name: "categorie",
                label: "Zone",
                defaultLabel: "Toutes les zones",
                options: areas.map((area) => ({ label: area, value: area })),
              },
            ]}
            sortOptions={[
              { label: "Ordre croissant", value: "order-asc" },
              { label: "Ordre décroissant", value: "order-desc" },
              { label: "Nom A-Z", value: "name-asc" },
              { label: "Nom Z-A", value: "name-desc" },
            ]}
          />
        </div>

        {members.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun cadre technique n&apos;est encore en base. Importez la liste
            actuelle ou ajoutez une fiche manuellement.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredMembers.length === 0 ? (
              <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
                Aucun cadre ne correspond aux filtres.
              </div>
            ) : null}
            {filteredMembers.map((member) => (
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
                      <Badge variant="secondary">
                        {member.area ?? "Technique"}
                      </Badge>
                      <Badge variant={member.active ? "outline" : "secondary"}>
                        {member.active ? "Actif" : "Masqué"}
                      </Badge>
                      {member.imageUrl ? <Badge variant="outline">Photo</Badge> : null}
                      <Badge variant="secondary">#{member.sortOrder}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.role ?? "Cadre technique"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <AdminRowActionsMenu
                    editHref={`/admin/cadres-techniques/${member.id}`}
                    deleteAction={deletePeopleMember}
                    deleteFields={{ kind: "technical", id: member.id }}
                    deleteId={member.id}
                    deleteLabel={member.name}
                    deleteMessage="Supprimer ce cadre technique ? Cette action est définitive."
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
