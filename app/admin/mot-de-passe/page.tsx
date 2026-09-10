import Link from "next/link";
import { KeyRound, ShieldCheck } from "lucide-react";

import {
  changeOwnAdminPassword,
  logoutAdmin,
  requireAdminSession,
} from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Changer le mot de passe admin",
  description: "Mise à jour du mot de passe de l'espace admin.",
  path: "/admin/mot-de-passe",
});

type AdminPasswordPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function AdminPasswordPage({
  searchParams,
}: AdminPasswordPageProps) {
  const session = await requireAdminSession();
  const errorMessage = searchParams?.error
    ? decodeURIComponent(searchParams.error)
    : null;

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center">
        <section className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            Sécurité du compte
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Changer votre mot de passe
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              {session.mustChangePassword
                ? "Votre mot de passe est provisoire. Choisissez un mot de passe personnel avant d'accéder au back-office."
                : "Vous pouvez remplacer votre mot de passe admin à tout moment."}
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-border bg-background p-2 text-primary">
              <KeyRound className="size-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">Nouveau mot de passe</h2>
              <p className="truncate text-sm text-muted-foreground">
                Connecté : {session.email}
              </p>
            </div>
          </div>

          <form action={changeOwnAdminPassword} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="currentPassword" className="text-sm font-medium">
                Mot de passe actuel
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                autoComplete="current-password"
                className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="Mot de passe provisoire ou actuel"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                Nouveau mot de passe
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                minLength={10}
                required
                autoComplete="new-password"
                className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="10 caractères minimum"
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Utilisez une phrase courte avec lettres, chiffres et symbole.
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                minLength={10}
                required
                autoComplete="new-password"
                className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="Retapez le nouveau mot de passe"
              />
            </div>

            {errorMessage ? (
              <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Enregistrer le mot de passe
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            {!session.mustChangePassword ? (
              <Link
                href="/admin"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Retour au back-office
              </Link>
            ) : null}
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Se déconnecter
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
