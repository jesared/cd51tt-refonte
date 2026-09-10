import { AdminUserRole } from "@prisma/client";
import {
  CalendarClock,
  FileText,
  Newspaper,
  ScrollText,
  Settings2,
  ShieldCheck,
  Trophy,
  UserCog,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getAdminActivity, type AdminActivityItem } from "@/lib/admin-activity";
import { requireAdministratorSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Journal d'activité admin",
  description: "Suivi des actions réalisées dans le back-office.",
  path: "/admin/activite",
});

function formatActivityDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getEntityIcon(entityType: string) {
  if (entityType === "competition") {
    return Trophy;
  }

  if (entityType === "actualite") {
    return Newspaper;
  }

  if (entityType === "document") {
    return FileText;
  }

  if (entityType === "echeance") {
    return CalendarClock;
  }

  if (entityType === "utilisateur") {
    return UserCog;
  }

  if (entityType === "parametres") {
    return Settings2;
  }

  return ScrollText;
}

function getRoleLabel(role: AdminUserRole) {
  if (role === AdminUserRole.ADMIN) {
    return "ADMIN";
  }

  return role === AdminUserRole.EDITOR ? "EDITOR" : "USER";
}

function getActionLabel(action: string) {
  const labels: Record<string, string> = {
    create: "Création",
    update: "Modification",
    publish: "Publication",
    unpublish: "Dépublication",
    delete: "Suppression",
    replace_image: "Image",
    invite: "Invitation",
    role: "Rôle",
    active: "Accès",
    password: "Mot de passe",
  };

  return labels[action] ?? action;
}

function ActivityRow({ item }: { item: AdminActivityItem }) {
  const Icon = getEntityIcon(item.entityType);

  return (
    <article className="admin-list-row grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </span>
          <h3 className="font-medium">{item.message}</h3>
          <Badge variant="outline">{getActionLabel(item.action)}</Badge>
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>{item.entityLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{formatActivityDate(item.createdAt)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:justify-end">
        <Badge
          variant={
            item.adminUserRole === AdminUserRole.ADMIN ? "secondary" : "outline"
          }
        >
          <ShieldCheck className="size-3" />
          {getRoleLabel(item.adminUserRole)}
        </Badge>
        <span className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
          {item.adminUserName}
        </span>
      </div>
    </article>
  );
}

export default async function AdminActivityPage() {
  await requireAdministratorSession("/admin");

  const activity = await getAdminActivity(80);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 rounded-[1.5rem] border border-border bg-background p-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-center gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Pilotage
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Journal d&apos;activité
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Suivez les créations, modifications, publications, suppressions,
            images remplacées et actions sur les comptes admin.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-3 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">Actions récentes</p>
            <p className="mt-2 text-3xl font-semibold">{activity.length}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-medium">Dernières actions</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Les entrées les plus récentes apparaissent en premier.
          </p>
        </div>

        {activity.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucune activité n&apos;est encore enregistrée.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activity.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
