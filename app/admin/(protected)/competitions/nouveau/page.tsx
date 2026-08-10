import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Module compétitions en préparation",
  description:
    "La création des compétitions sera disponible lorsque le modèle de données sera branché.",
  path: "/admin/competitions/nouveau",
});

export default function AdminNewCompetitionPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-border bg-muted p-3 text-primary">
              <Construction className="size-5" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Compétitions
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Module en préparation
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                La création et la modification des compétitions ne sont pas
                encore branchées en base. Le formulaire sera réactivé lorsque
                l&apos;enregistrement, la publication et la suppression seront
                réellement disponibles.
              </p>
            </div>
          </div>

          <Link
            href="/admin/competitions"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour à la liste
          </Link>
        </div>
      </section>

      <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-900 dark:text-amber-200">
        Pour l&apos;instant, utilisez les pages Calendrier et Documents pour
        gérer les échéances et les ressources visibles sur le site public.
      </div>
    </div>
  );
}
