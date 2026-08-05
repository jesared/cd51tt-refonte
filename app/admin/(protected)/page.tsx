import { FileText, Newspaper, Settings2, ShieldCheck } from "lucide-react";

import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Administration",
  description:
    "Tableau de bord de l'administration du Comité Marne de tennis de table.",
  path: "/admin",
});

const nextModules = [
  {
    title: "Actualités",
    description: "Créer, modifier et publier les actualités du site.",
    icon: Newspaper,
  },
  {
    title: "Documents",
    description: "Administrer les ressources et liens de téléchargement.",
    icon: FileText,
  },
  {
    title: "Paramètres",
    description: "Modifier les coordonnées et informations générales.",
    icon: Settings2,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-background p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-md border border-border bg-card p-2 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">
              Connexion active
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Le socle admin est en place
            </h2>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
          Cette première étape protège l’accès au back-office avec une
          authentification email/mot de passe et une session simple par cookie.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">
          Prochains modules
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {nextModules.map((module) => {
            const Icon = module.icon;

            return (
              <div
                key={module.title}
                className="rounded-lg border border-border bg-background p-5"
              >
                <Icon className="size-5 text-primary" />
                <h3 className="mt-4 font-semibold">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {module.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
