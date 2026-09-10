import Link from "next/link";
import {
  CalendarPlus,
  Eye,
  EyeOff,
  FilePlus2,
  HelpCircle,
  ImagePlus,
  ListChecks,
  Plus,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { AdminUserRole } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { requireAdminSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Aide admin",
  description: "Guide rapide pour mettre à jour les contenus administrables.",
  path: "/admin/aide",
});

const guideSections = [
  {
    title: "Créer une compétition",
    icon: Trophy,
    href: "/admin/competitions/nouveau",
    actionLabel: "Nouvelle compétition",
    steps: [
      "Aller dans Compétitions, puis cliquer sur Nouvelle compétition.",
      "Renseigner le titre, le résumé, le format, le lieu et le responsable.",
      "Laisser en Brouillon tant que les informations ne sont pas prêtes.",
      "Ajouter ensuite les échéances liées depuis la fiche compétition.",
    ],
  },
  {
    title: "Ajouter une échéance",
    icon: CalendarPlus,
    href: "/admin/calendrier/nouveau",
    actionLabel: "Nouvelle échéance",
    steps: [
      "Choisir la compétition concernée en premier.",
      "Renseigner le libellé, la date, le type et le lieu.",
      "Publier seulement si l’échéance doit apparaître sur le site public.",
      "Vérifier ensuite la fiche compétition pour voir l’échéance liée.",
    ],
  },
  {
    title: "Lier un document",
    icon: FilePlus2,
    href: "/admin/documents/nouveau",
    actionLabel: "Nouveau document",
    steps: [
      "Créer ou modifier un document depuis Documents.",
      "Choisir la compétition liée si le document concerne une compétition.",
      "Utiliser un titre clair, par exemple Règlement ou Convocation.",
      "Publier le document quand le lien ou le fichier est correct.",
    ],
  },
  {
    title: "Publier / dépublier",
    icon: Eye,
    href: "/admin/a-verifier",
    actionLabel: "Voir les vérifications",
    steps: [
      "Publié signifie visible sur le site public.",
      "Brouillon signifie enregistré dans l’admin, mais non visible au public.",
      "Avant de publier, vérifier les champs manquants dans À vérifier.",
      "Dépublier si une information devient incorrecte ou temporaire.",
    ],
  },
  {
    title: "Mettre une image",
    icon: ImagePlus,
    href: "/admin/competitions",
    actionLabel: "Gérer les compétitions",
    steps: [
      "Ouvrir la compétition à modifier.",
      "Sélectionner une image depuis le champ Image.",
      "Utiliser une image nette, en paysage si possible, et inférieure à 15 Mo.",
      "Enregistrer, puis vérifier l’aperçu public après publication.",
    ],
  },
];

const handoverSections = [
  {
    title: "Quoi faire en premier",
    icon: ListChecks,
    items: [
      "Ouvrir À vérifier pour repérer les contenus incomplets.",
      "Commencer par créer ou compléter la compétition concernée.",
      "Ajouter les échéances liées depuis la fiche compétition ou depuis Échéances.",
      "Ajouter les documents et images seulement quand les informations principales sont prêtes.",
    ],
  },
  {
    title: "Avant de publier",
    icon: ShieldCheck,
    items: [
      "Vérifier que le contenu a une image quand elle est attendue.",
      "Vérifier qu’une compétition possède au moins une échéance liée.",
      "Tester les liens de document, d’inscription, de convocation ou de résultat.",
      "Lire la prévisualisation pour éviter les titres trop courts ou les contenus trop vides.",
    ],
  },
  {
    title: "En cas de doute",
    icon: HelpCircle,
    items: [
      "Laisser le contenu en Brouillon plutôt que de publier une information incertaine.",
      "Dépublier temporairement si une date, un lieu ou un document devient faux.",
      "Contacter l’administrateur du site pour les droits, les comptes ou les paramètres.",
      "Contacter le responsable sportif pour valider une compétition ou une échéance.",
    ],
  },
];

export default async function AdminHelpPage() {
  const session = await requireAdminSession();
  const canEditContent = session.role !== AdminUserRole.USER;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 rounded-[1.5rem] border border-border bg-background p-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-center gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Pilotage
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Aide admin</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Un guide court pour réaliser les actions courantes sans hésiter sur
            les termes : Compétition, Échéance, Document, Publié et Brouillon.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Guide rapide</Badge>
            <Badge variant="secondary">Vocabulaire uniforme</Badge>
          </div>
        </div>

        {canEditContent ? (
          <div className="grid gap-3 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <Link
              href="/admin/competitions/nouveau"
              className="admin-action admin-action-primary h-11 w-full"
            >
              <Plus className="size-4" />
              Créer une compétition
            </Link>
            <Link
              href="/admin/calendrier/nouveau"
              className="admin-action h-11 w-full"
            >
              <CalendarPlus className="size-4" />
              Ajouter une échéance
            </Link>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {guideSections.map((section) => {
          const Icon = section.icon;

          return (
            <article
              key={section.title}
              className="rounded-[1.5rem] border border-border bg-background"
            >
              <div className="flex items-start gap-3 border-b border-border px-5 py-4">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold">{section.title}</h3>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    À suivre dans cet ordre pour éviter les oublis.
                  </p>
                </div>
              </div>

              <div className="space-y-4 px-5 py-5">
                <ol className="grid gap-3">
                  {section.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-6">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-xs font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>

                {canEditContent ? (
                  <Link
                    href={section.href}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {section.title === "Publier / dépublier" ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Icon className="size-4" />
                    )}
                    {section.actionLabel}
                  </Link>
                ) : (
                  <Badge variant="outline" className="w-fit">
                    Lecture seule
                  </Badge>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-semibold">Mise en main</h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Les réflexes à garder pour mettre à jour le site sans publier trop
            vite une information incomplète.
          </p>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-3">
          {handoverSections.map((section) => {
            const Icon = section.icon;

            return (
              <article key={section.title} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </div>
                  <h4 className="font-medium">{section.title}</h4>
                </div>
                <ul className="mt-4 grid gap-2 text-sm leading-6 text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
