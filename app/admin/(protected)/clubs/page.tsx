import Link from "next/link";
import { Building2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

import { DeleteConfirmationForm } from "@/components/admin/delete-confirmation-form";
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
  };
};

export default async function AdminClubsPage({
  searchParams,
}: AdminClubsPageProps) {
  const clubs = await getAdminClubs();
  const activeClubs = clubs.filter((club) => club.active);
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
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <RefreshCw className="size-4" />
              Synchroniser FFTT
            </button>
          </form>

          <Link
            href="/admin/clubs/nouveau"
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
          <h3 className="font-medium">Liste des clubs</h3>
        </div>

        {clubs.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun club n&apos;est encore en base. Synchronisez la FFTT ou ajoutez
            un club manuellement.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {clubs.map((club) => (
              <article
                key={club.id}
                className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_10rem_8rem_14rem]"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-medium">{club.name}</h4>
                    <Badge variant="secondary">{club.city}</Badge>
                    <Badge variant={club.active ? "outline" : "secondary"}>
                      {club.active ? "Actif" : "Masqué"}
                    </Badge>
                    {club.ffttId ? <Badge variant="outline">FFTT</Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{club.venue}</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {club.audience}
                  </p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Contact</p>
                  <p className="mt-2 break-all">{club.contact}</p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Tables</p>
                  <p className="mt-2">{club.tables}</p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    href={`/admin/clubs/${club.id}`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                    Modifier
                  </Link>
                  <DeleteConfirmationForm
                    action={deleteClub}
                    message="Supprimer ce club ? Cette action est définitive."
                  >
                    <input type="hidden" name="id" value={club.id} />
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
