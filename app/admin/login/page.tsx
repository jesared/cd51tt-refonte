import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { isAdminAuthenticated, loginAdmin } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Connexion admin",
  description:
    "Accès sécurisé à l'administration du Comité Marne de tennis de table.",
  path: "/admin/login",
});

type LoginPageProps = {
  searchParams?: {
    error?: string;
  };
};

const errorMessages: Record<string, string> = {
  credentials:
    "Identifiants invalides. Vérifiez l'adresse email et le mot de passe.",
  config: "Les identifiants admin ne sont pas configurés.",
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const errorMessage = searchParams?.error
    ? errorMessages[searchParams.error] ?? "Impossible d'ouvrir la session."
    : null;

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center">
        <section className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            Administration CD51TT
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Connexion admin
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Accès réservé à l’équipe du comité pour préparer la gestion des
              contenus du site.
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-border bg-background p-2 text-primary">
              <LockKeyhole className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">S’identifier</h2>
              <p className="text-sm text-muted-foreground">
                Email et mot de passe administrateur.
              </p>
            </div>
          </div>

          <form action={loginAdmin} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="admin@cd51tt.fr"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="••••••••"
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
              Ouvrir l’administration
            </button>
          </form>

          <Link
            href="/"
            className="mt-6 inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Retour au site public
          </Link>
        </section>
      </div>
    </main>
  );
}
