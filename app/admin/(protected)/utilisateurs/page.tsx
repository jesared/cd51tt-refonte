import { AdminUserRole } from "@prisma/client";
import {
  KeyRound,
  UserPlus,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";

import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { ConfirmableActionForm } from "@/components/admin/confirmable-action-form";
import { Badge } from "@/components/ui/badge";
import { requireAdministratorSession } from "@/lib/admin-auth";
import {
  getAdminUsers,
  createAdminUser,
  resetAdminUserPassword,
  toggleAdminUserActive,
  updateAdminUserRole,
} from "@/lib/admin-users";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Admin utilisateurs",
  description: "Gestion des comptes autorisés à accéder au back-office.",
  path: "/admin/utilisateurs",
});

type AdminUsersPageProps = {
  searchParams?: {
    invited?: string;
    role?: string;
    active?: string;
    password?: string;
    error?: string;
  };
};

function formatDate(date: Date | null) {
  if (!date) {
    return "Jamais";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getRoleLabel(role: AdminUserRole) {
  if (role === AdminUserRole.ADMIN) {
    return "ADMIN";
  }

  return role === AdminUserRole.EDITOR ? "EDITOR" : "USER";
}

function getFeedbackMessage(searchParams: AdminUsersPageProps["searchParams"]) {
  if (searchParams?.error) {
    return decodeURIComponent(searchParams.error);
  }

  if (searchParams?.invited === "1") {
    return "Compte ajouté. Transmettez-lui le mot de passe temporaire.";
  }

  if (searchParams?.role === "1") {
    return "Rôle mis à jour.";
  }

  if (searchParams?.active === "1") {
    return "Statut du compte mis à jour.";
  }

  if (searchParams?.password === "1") {
    return "Mot de passe réinitialisé.";
  }

  return null;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  await requireAdministratorSession("/admin");

  const users = await getAdminUsers();
  const activeCount = users.filter((user) => user.active).length;
  const adminCount = users.filter(
    (user) => user.active && user.role === AdminUserRole.ADMIN,
  ).length;
  const message = getFeedbackMessage(searchParams);
  const hasError = Boolean(searchParams?.error);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 rounded-[1.5rem] border border-border bg-background p-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-center gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Réglages
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Utilisateurs admin
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Gérez les personnes autorisées à modifier le site, leur rôle, leur
            accès actif et les mots de passe temporaires.
          </p>
        </div>

        <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Comptes</p>
            <p className="mt-2 text-3xl font-semibold">{users.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Admins actifs</p>
            <p className="mt-2 text-3xl font-semibold">{adminCount}</p>
          </div>
        </div>
      </section>

      {message ? (
        <div
          className={
            hasError
              ? "rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive shadow-sm"
              : "admin-feedback"
          }
        >
          {message}
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-medium">Ajouter un compte</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Créez un compte actif en choisissant son rôle. Le mot de passe
            saisi est hashé en base.
          </p>
        </div>

        <form action={createAdminUser} className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(10rem,0.6fr)_minmax(13rem,0.7fr)_auto] lg:items-end">
          <div className="grid gap-2">
            <label htmlFor="invite-name" className="text-sm font-medium">
              Nom
            </label>
            <input
              id="invite-name"
              name="name"
              required
              placeholder="Marie Dupont"
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="invite-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="invite-email"
              name="email"
              type="email"
              required
              placeholder="editeur@cd51tt.fr"
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="invite-role" className="text-sm font-medium">
              Rôle
            </label>
            <select
              id="invite-role"
              name="role"
              defaultValue={AdminUserRole.EDITOR}
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
            >
              <option value={AdminUserRole.ADMIN}>ADMIN</option>
              <option value={AdminUserRole.EDITOR}>EDITOR</option>
              <option value={AdminUserRole.USER}>USER</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="invite-password" className="text-sm font-medium">
              Mot de passe temporaire
            </label>
            <input
              id="invite-password"
              name="password"
              type="password"
              minLength={10}
              required
              placeholder="10 caractères minimum"
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <AdminSubmitButton
            icon={<UserPlus className="size-4" />}
            loadingLabel="Création..."
            variant="default"
            className="h-11 px-4"
          >
            Ajouter
          </AdminSubmitButton>
        </form>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium">Comptes autorisés</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeCount} compte(s) actif(s) sur {users.length}.
            </p>
          </div>
          <Badge variant="outline">Réservé ADMIN</Badge>
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun utilisateur admin n&apos;est encore enregistré.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {users.map((user) => (
              <article key={user.id} className="admin-list-row px-6 py-5">
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(19rem,0.8fr)_minmax(18rem,0.8fr)] xl:items-start">
                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium">{user.name}</h4>
                      <Badge
                        variant={
                          user.role === AdminUserRole.ADMIN
                            ? "secondary"
                            : "outline"
                        }
                      >
                        <ShieldCheck className="size-3" />
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge variant={user.active ? "outline" : "destructive"}>
                        {user.active ? (
                          <UserCheck className="size-3" />
                        ) : (
                          <UserX className="size-3" />
                        )}
                        {user.active ? "Actif" : "Désactivé"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                      <span>Dernière connexion : {formatDate(user.lastLoginAt)}</span>
                      <span>Mis à jour : {formatDate(user.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <form action={updateAdminUserRole} className="grid gap-2">
                      <input type="hidden" name="id" value={user.id} />
                      <label
                        htmlFor={`role-${user.id}`}
                        className="text-sm font-medium"
                      >
                        Rôle
                      </label>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <select
                          id={`role-${user.id}`}
                          name="role"
                          defaultValue={user.role}
                          className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 sm:flex-1"
                        >
                          <option value={AdminUserRole.ADMIN}>ADMIN</option>
                          <option value={AdminUserRole.EDITOR}>EDITOR</option>
                          <option value={AdminUserRole.USER}>USER</option>
                        </select>
                        <AdminSubmitButton
                          icon={<ShieldCheck className="size-4" />}
                          loadingLabel="Rôle..."
                          className="h-10 px-3"
                        >
                          Changer le rôle
                        </AdminSubmitButton>
                      </div>
                    </form>

                    <ConfirmableActionForm
                      action={toggleAdminUserActive}
                      className="contents"
                      message={
                        user.active
                          ? `Désactiver le compte ${user.email} ? Il ne pourra plus se connecter.`
                          : `Réactiver le compte ${user.email} ? Il pourra de nouveau se connecter.`
                      }
                    >
                      <input type="hidden" name="id" value={user.id} />
                      <AdminSubmitButton
                        icon={
                          user.active ? (
                            <UserX className="size-4" />
                          ) : (
                            <UserCheck className="size-4" />
                          )
                        }
                        loadingLabel="Mise à jour..."
                        variant={user.active ? "danger" : "outline"}
                        className="h-10 w-full px-3"
                      >
                        {user.active ? "Désactiver le compte" : "Réactiver le compte"}
                      </AdminSubmitButton>
                    </ConfirmableActionForm>
                  </div>

                  <ConfirmableActionForm
                    action={resetAdminUserPassword}
                    className="grid gap-2"
                    message={`Réinitialiser le mot de passe de ${user.email} ? L'ancien mot de passe ne fonctionnera plus.`}
                  >
                    <input type="hidden" name="id" value={user.id} />
                    <label
                      htmlFor={`password-${user.id}`}
                      className="text-sm font-medium"
                    >
                      Nouveau mot de passe temporaire
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        id={`password-${user.id}`}
                        name="password"
                        type="password"
                        minLength={10}
                        required
                        placeholder="10 caractères minimum"
                        className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 sm:flex-1"
                      />
                      <AdminSubmitButton
                        icon={<KeyRound className="size-4" />}
                        loadingLabel="Reset..."
                        className="h-10 px-3"
                      >
                        Réinitialiser
                      </AdminSubmitButton>
                    </div>
                  </ConfirmableActionForm>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
