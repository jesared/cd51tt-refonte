import { AdminUserRole } from "@prisma/client";
import {
  KeyRound,
  Mail,
  UserPlus,
  ShieldCheck,
  UserCheck,
  UserX,
} from "lucide-react";

import { AdminListControls } from "@/components/admin/admin-list-controls";
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
    roleUpdated?: string;
    active?: string;
    password?: string;
    error?: string;
    q?: string;
    role?: string;
    actif?: string;
    mdp?: string;
    tri?: string;
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

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buildMailtoLink({
  email,
  name,
  reason,
}: {
  email: string;
  name: string;
  reason: "invite" | "reset";
}) {
  const loginUrl = "http://localhost:3000/admin/login";
  const subject =
    reason === "invite"
      ? "Accès au back-office CD51TT"
      : "Mot de passe admin CD51TT réinitialisé";
  const body =
    reason === "invite"
      ? `Bonjour ${name},\n\nUn accès au back-office CD51TT vient d'être créé pour vous.\n\nAdresse de connexion : ${loginUrl}\nIdentifiant : ${email}\n\nVotre mot de passe provisoire vous sera transmis séparément. À la première connexion, le site vous demandera de choisir votre propre mot de passe.\n\nBonne journée.`
      : `Bonjour ${name},\n\nVotre mot de passe du back-office CD51TT vient d'être réinitialisé.\n\nAdresse de connexion : ${loginUrl}\nIdentifiant : ${email}\n\nVotre nouveau mot de passe provisoire vous sera transmis séparément. À la prochaine connexion, le site vous demandera de choisir votre propre mot de passe.\n\nBonne journée.`;

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function getFeedbackMessage(searchParams: AdminUsersPageProps["searchParams"]) {
  if (searchParams?.error) {
    return decodeURIComponent(searchParams.error);
  }

  if (searchParams?.invited === "1") {
    return "Compte ajouté. Transmettez-lui le mot de passe temporaire.";
  }

  if (searchParams?.roleUpdated === "1") {
    return "Rôle mis à jour.";
  }

  if (searchParams?.active === "1") {
    return "Statut du compte mis à jour.";
  }

  if (searchParams?.password === "1") {
    return "Mot de passe réinitialisé. La personne devra le changer à sa prochaine connexion.";
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
  const query = normalizeSearchValue(searchParams?.q ?? "");
  const roleFilter = searchParams?.role;
  const activeFilter = searchParams?.actif;
  const passwordFilter = searchParams?.mdp;
  const sortMode = searchParams?.tri ?? "name-asc";
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        !query ||
        normalizeSearchValue(`${user.name} ${user.email}`).includes(query);
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesActive =
        !activeFilter ||
        (activeFilter === "active" && user.active) ||
        (activeFilter === "inactive" && !user.active);
      const matchesPassword =
        !passwordFilter ||
        (passwordFilter === "temporary" && user.mustChangePassword) ||
        (passwordFilter === "changed" && !user.mustChangePassword);

      return matchesSearch && matchesRole && matchesActive && matchesPassword;
    })
    .sort((first, second) => {
      if (sortMode === "role-asc") {
        return first.role.localeCompare(second.role, "fr");
      }

      if (sortMode === "login-desc") {
        return (
          (second.lastLoginAt?.getTime() ?? 0) -
          (first.lastLoginAt?.getTime() ?? 0)
        );
      }

      if (sortMode === "updated-desc") {
        return second.updatedAt.getTime() - first.updatedAt.getTime();
      }

      return first.name.localeCompare(second.name, "fr");
    });
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
          <h3 className="font-medium">Ajouter / inviter un compte</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Créez un compte actif en choisissant son rôle. Le mot de passe
            saisi est provisoire : il devra être changé à la première connexion.
            L’invitation email est disponible ensuite depuis la liste.
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
        <div className="space-y-4 border-b border-border px-6 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">Comptes autorisés</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredUsers.length} sur {users.length} compte(s), dont{" "}
                {activeCount} actif(s).
              </p>
            </div>
            <Badge variant="outline">Réservé ADMIN</Badge>
          </div>
          <AdminListControls
            searchPlaceholder="Nom ou email"
            filters={[
              {
                name: "role",
                label: "Rôle",
                defaultLabel: "Tous les rôles",
                options: [
                  { label: "ADMIN", value: AdminUserRole.ADMIN },
                  { label: "EDITOR", value: AdminUserRole.EDITOR },
                  { label: "USER", value: AdminUserRole.USER },
                ],
              },
              {
                name: "actif",
                label: "Accès",
                defaultLabel: "Tous les accès",
                options: [
                  { label: "Actif", value: "active" },
                  { label: "Désactivé", value: "inactive" },
                ],
              },
              {
                name: "mdp",
                label: "Mot de passe",
                defaultLabel: "Tous les mots de passe",
                options: [
                  { label: "Provisoire", value: "temporary" },
                  { label: "Déjà changé", value: "changed" },
                ],
              },
            ]}
            sortOptions={[
              { label: "Nom A-Z", value: "name-asc" },
              { label: "Rôle", value: "role-asc" },
              { label: "Dernière connexion", value: "login-desc" },
              { label: "Mise à jour récente", value: "updated-desc" },
            ]}
          />
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun utilisateur admin n&apos;est encore enregistré.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredUsers.length === 0 ? (
              <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
                Aucun compte ne correspond aux filtres.
              </div>
            ) : null}
            {filteredUsers.map((user) => (
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
                      {user.mustChangePassword ? (
                        <Badge variant="secondary">
                          <KeyRound className="size-3" />
                          Mot de passe provisoire
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                      <span>Dernière connexion : {formatDate(user.lastLoginAt)}</span>
                      <span>
                        Mot de passe changé : {formatDate(user.passwordChangedAt)}
                      </span>
                      <span>Mis à jour : {formatDate(user.updatedAt)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={buildMailtoLink({
                          email: user.email,
                          name: user.name,
                          reason: "invite",
                        })}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Mail className="size-4" />
                        Envoyer l’invitation
                      </a>
                      {user.mustChangePassword ? (
                        <a
                          href={buildMailtoLink({
                            email: user.email,
                            name: user.name,
                            reason: "reset",
                          })}
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <KeyRound className="size-4" />
                          Email reset
                        </a>
                      ) : null}
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
                    className="rounded-xl border border-border bg-muted/25 p-3"
                    message={`Réinitialiser le mot de passe de ${user.email} ? L'ancien mot de passe ne fonctionnera plus et la personne devra choisir un nouveau mot de passe à la prochaine connexion.`}
                  >
                    <input type="hidden" name="id" value={user.id} />
                    <label
                      htmlFor={`password-${user.id}`}
                      className="text-sm font-medium"
                    >
                      Réinitialisation propre
                    </label>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Définissez un mot de passe provisoire, puis envoyez
                      l’email de reset. Transmettez le mot de passe séparément.
                    </p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <input
                        id={`password-${user.id}`}
                        name="password"
                        type="password"
                        minLength={10}
                        required
                        placeholder="Mot de passe provisoire"
                        className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 sm:flex-1"
                      />
                      <AdminSubmitButton
                        icon={<KeyRound className="size-4" />}
                        loadingLabel="Reset..."
                        className="h-10 px-3"
                      >
                        Définir
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
