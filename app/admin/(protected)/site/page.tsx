import Link from "next/link";
import { AtSign, ExternalLink, Save, Settings2, Share2 } from "lucide-react";

import { UnsavedChangesGuard } from "@/components/admin/unsaved-changes-guard";
import { getSiteSettings, updateSiteSettings } from "@/lib/admin-site-settings";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Paramètres du site",
  description:
    "Administration des coordonnées, réseaux sociaux et réglages éditoriaux du site du comité.",
  path: "/admin/site",
});

type AdminSitePageProps = {
  searchParams?: {
    updated?: string;
  };
};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
      />
    </div>
  );
}

function HiddenSettings({
  settings,
}: {
  settings: Awaited<ReturnType<typeof getSiteSettings>>;
}) {
  return (
    <>
      <input type="hidden" name="description" value={settings.description} />
      <input type="hidden" name="organization" value={settings.organization} />
      <input
        type="hidden"
        name="publicationDirector"
        value={settings.publicationDirector}
      />
      <input type="hidden" name="dataContact" value={settings.dataContact} />
      <input type="hidden" name="officeHours" value={settings.officeHours} />
      <input type="hidden" name="affiliations" value={settings.affiliations} />
      <input type="hidden" name="partners" value={settings.partners} />
    </>
  );
}

export default async function AdminSiteSettingsPage({
  searchParams,
}: AdminSitePageProps) {
  const settings = await getSiteSettings();
  const updated = searchParams?.updated === "1";

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-border bg-muted p-3 text-primary">
              <Settings2 className="size-5" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Paramètres généraux
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Identité et contacts du comité
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                Gérez les informations visibles dans l&apos;en-tête, le footer, la
                page contact et les pages légales.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/30 px-4 text-sm font-medium text-primary transition hover:bg-primary/10"
            >
              <ExternalLink className="size-4" />
              Prévisualiser le site
            </Link>
          </div>
        </div>
      </section>

      {updated ? (
        <div className="flex flex-col gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 sm:flex-row sm:items-center sm:justify-between">
          <span>Paramètres enregistrés. Vérifiez le rendu côté public.</span>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 font-medium text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-200"
          >
            <ExternalLink className="size-4" />
            Voir sur le site
          </Link>
        </div>
      ) : null}

      <form action={updateSiteSettings} className="grid gap-6">
        <UnsavedChangesGuard message="Les paramètres du site ont été modifiés." />
        <HiddenSettings settings={settings} />

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Settings2 className="size-4" />
            Identité
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <Field
                label="Nom du comité"
                name="siteName"
                defaultValue={settings.siteName}
              />
            </div>
            <Field
              label="Nom court"
              name="shortName"
              defaultValue={settings.shortName}
            />
            <Field
              label="Saison en cours"
              name="season"
              defaultValue={settings.season}
              placeholder="Saison 2026-2027"
            />
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <AtSign className="size-4" />
            Coordonnées
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field
              label="Email"
              name="email"
              defaultValue={settings.email}
              type="email"
            />
            <Field
              label="Téléphone"
              name="phone"
              defaultValue={settings.phone}
            />
            <div className="md:col-span-2">
              <Field
                label="Adresse"
                name="addressLine1"
                defaultValue={settings.addressLine1}
              />
            </div>
            <div className="md:col-span-2">
              <Field
                label="Complément d'adresse"
                name="addressLine2"
                defaultValue={settings.addressLine2}
              />
            </div>
            <Field
              label="Code postal"
              name="postalCode"
              defaultValue={settings.postalCode}
            />
            <Field label="Ville" name="city" defaultValue={settings.city} />
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Share2 className="size-4" />
            Réseaux sociaux
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field
              label="Facebook"
              name="facebookUrl"
              defaultValue={settings.facebookUrl}
              type="url"
              placeholder="https://www.facebook.com/..."
            />
            <Field
              label="Instagram"
              name="instagramUrl"
              defaultValue={settings.instagramUrl}
              type="url"
              placeholder="https://www.instagram.com/..."
            />
          </div>
        </section>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/15 transition hover:opacity-90"
          >
            <Save className="size-4" />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
