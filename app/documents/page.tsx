import { Download, FolderKanban, ShieldCheck } from "lucide-react";

import { PageIntro } from "@/components/shared/page-intro";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/metadata";
import { documents } from "@/lib/mock-data";
import { routeCopy } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Documents",
  description:
    "Guides, règlements et formulaires du comité présentés dans une base documentaire claire et structurée.",
  path: "/documents",
});

export default function DocumentsPage() {
  const intro = routeCopy["/documents"];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <SectionCard
          eyebrow="Bibliothèque"
          title="Une base documentaire unique"
          description="Les ressources utiles à la gestion sportive et administrative sont regroupées pour faciliter leur consultation."
          icon={FolderKanban}
        >
          <div className="grid gap-4">
            {documents.map((document) => (
              <div
                key={document.title}
                className="rounded-3xl border border-border bg-muted p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-medium">{document.title}</h3>
                  <Badge variant="secondary">{document.category}</Badge>
                  <Badge variant="outline">{document.format}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {document.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    Mis à jour : {document.updatedAt}
                  </span>
                  <a
                    href="#"
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Télécharger
                    <Download className="size-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Organisation"
          title="Des repères simples pour retrouver le bon document"
          description="La bibliothèque est structurée pour donner une lecture claire aux clubs, aux bénévoles et aux responsables sportifs."
          icon={ShieldCheck}
        >
          <div className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Catégorisation claire par usage : gestion, réglementation,
              communication.
            </p>
            <p>
              Présentation homogène pour consulter rapidement un formulaire ou
              un règlement.
            </p>
            <p>
              Téléchargements lisibles et faciles à enrichir au fil de la
              saison.
            </p>
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
