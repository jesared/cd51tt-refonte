import Link from "next/link";
import { Building2, Plus, RefreshCw } from "lucide-react";

import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminRowActionsMenu } from "@/components/admin/admin-row-actions-menu";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { Badge } from "@/components/ui/badge";
import {
  deleteClub,
  getAdminClubs,
  syncFfttClubs,
} from "@/lib/admin-clubs";
import { ffttApiReadiness } from "@/lib/fftt/client";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Admin clubs",
  description: "Gestion des clubs du Comité Marne de tennis de table.",
  path: "/admin/clubs",
});

type AdminClubsPageProps = {
  searchParams?: {
    saved?: string;
    deleted?: string;
    fftt?: string;
    error?: string;
    q?: string;
    statut?: string;
    ville?: string;
    tri?: string;
  };
};

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default async function AdminClubsPage({
  searchParams,
}: AdminClubsPageProps) {
  const clubs = await getAdminClubs();
  const activeClubs = clubs.filter((club) => club.active);
  const cities = Array.from(new Set(clubs.map((club) => club.city))).sort(
    (a, b) => a.localeCompare(b, "fr"),
  );
  const query = normalizeSearchValue(searchParams?.q ?? "");
  const statusFilter = searchParams?.statut;
  const cityFilter = searchParams?.ville;
  const sortMode = searchParams?.tri ?? "name-asc";
  const filteredClubs = clubs
    .filter((club) => {
      const matchesSearch =
        !query ||
        normalizeSearchValue(
          `${club.name} ${club.city} ${club.venue} ${club.contact}`,
        ).includes(query);
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active" && club.active) ||
        (statusFilter === "hidden" && !club.active) ||
        (statusFilter === "fftt" && Boolean(club.ffttId));
      const matchesCity = !cityFilter || club.city === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    })
    .sort((first, second) => {
      if (sortMode === "city-asc") {
        return (
          first.city.localeCompare(second.city, "fr") ||
          first.name.localeCompare(second.name, "fr")
        );
      }

      if (sortMode === "city-desc") {
        return (
          second.city.localeCompare(first.city, "fr") ||
          first.name.localeCompare(second.name, "fr")
        );
      }

      if (sortMode === "name-desc") {
        return second.name.localeCompare(first.name, "fr");
      }

      return first.name.localeCompare(second.name, "fr");
    });
  const message =
    searchParams?.saved === "1"
      ? "Le club a été enregistré."
      : searchParams?.deleted === "1"
        ? "Le club a été supprimé."
        : searchParams?.fftt
          ? `${searchParams.fftt} clubs synchronisés depuis la FFTT.`
          : searchParams?.error
            ? decodeURIComponent(searchParams.error)
            : null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Building2 className="size-4" />
            Annuaire FFTT
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer les clubs
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Synchronisez la base FFTT, puis complétez les informations affichées
            sur le site : salle, public, nombre de tables et contact.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline">
              API FFTT{" "}
              {ffttApiReadiness.hasAppCredentials
                ? `configurée, dép. ${ffttApiReadiness.department}`
                : "mock local"}
            </Badge>
            <Badge variant="secondary">{activeClubs.length} clubs actifs</Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <form action={syncFfttClubs}>
            <AdminSubmitButton
              icon={<RefreshCw className="size-4" />}
              loadingLabel="Synchronisation..."
              className="h-10 px-4"
            >
              Synchroniser FFTT
            </AdminSubmitButton>
          </form>

          <Link
            href="/admin/clubs/nouveau"
            className="admin-action admin-action-primary"
          >
            <Plus className="size-4" />
            Ajouter
          </Link>
        </div>
      </section>

      {message ? <div className="admin-feedback">{message}</div> : null}

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="space-y-4 border-b border-border px-6 py-4">
          <div>
            <h3 className="font-medium">Liste des clubs</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredClubs.length} sur {clubs.length} club(s)
            </p>
          </div>
          <AdminListControls
            searchPlaceholder="Club, ville, salle ou contact"
            filters={[
              {
                name: "statut",
                label: "Statut",
                defaultLabel: "Tous les statuts",
                options: [
                  { label: "Actifs", value: "active" },
                  { label: "Masqués", value: "hidden" },
                  { label: "Avec identifiant FFTT", value: "fftt" },
                ],
              },
              {
                name: "ville",
                label: "Ville",
                defaultLabel: "Toutes les villes",
                options: cities.map((city) => ({ label: city, value: city })),
              },
            ]}
            sortOptions={[
              { label: "Nom A-Z", value: "name-asc" },
              { label: "Nom Z-A", value: "name-desc" },
              { label: "Ville A-Z", value: "city-asc" },
              { label: "Ville Z-A", value: "city-desc" },
            ]}
          />
        </div>

        {clubs.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun club n&apos;est encore en base. Synchronisez la FFTT ou ajoutez
            un club manuellement.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredClubs.length === 0 ? (
              <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
                Aucun club ne correspond aux filtres.
              </div>
            ) : null}
            {filteredClubs.map((club) => (
              <article
                key={club.id}
                className="admin-list-row grid gap-3 px-6 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-medium">{club.name}</h4>
                    <Badge variant="secondary">{club.city}</Badge>
                    <Badge variant={club.active ? "outline" : "secondary"}>
                      {club.active ? "Actif" : "Masqué"}
                    </Badge>
                    {club.ffttId ? <Badge variant="outline">FFTT</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{club.venue}</p>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <AdminRowActionsMenu
                    editHref={`/admin/clubs/${club.id}`}
                    deleteAction={deleteClub}
                    deleteId={club.id}
                    deleteLabel={club.name}
                    deleteMessage="Supprimer ce club ? Cette action est définitive."
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
