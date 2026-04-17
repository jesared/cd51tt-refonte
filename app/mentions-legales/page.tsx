import { Building2, FileText, ShieldCheck } from "lucide-react";

import { PageIntro } from "@/components/shared/page-intro";
import { SectionCard } from "@/components/shared/section-card";
import { createPageMetadata } from "@/lib/metadata";
import { routeCopy, siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Mentions légales",
  description:
    "Informations d'identification du site, responsabilités éditoriales et repères légaux du comité.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  const intro = routeCopy["/mentions-legales"];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <SectionCard
          eyebrow="Éditeur"
          title="Identification du site"
          description="Base institutionnelle à compléter et valider avant publication définitive."
          icon={Building2}
        >
          <div className="space-y-4 text-sm leading-6 text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">{siteConfig.name}</p>
              <p>{siteConfig.organization}</p>
            </div>
            <div>
              <p>{siteConfig.location}</p>
              <p>{siteConfig.email}</p>
              <p>{siteConfig.phone}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Directeur de publication</p>
              <p>{siteConfig.publicationDirector}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Hébergement"
          title="Informations à confirmer"
          description="Les éléments techniques définitifs peuvent être précisés sans modifier la structure du site."
          icon={ShieldCheck}
        >
          <div className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Hébergeur : à compléter avant mise en ligne officielle.</p>
            <p>Adresse de l&apos;hébergeur : à compléter.</p>
            <p>
              Contact technique : à compléter selon l&apos;environnement de
              production retenu.
            </p>
          </div>
        </SectionCard>
      </section>

      <SectionCard
        eyebrow="Propriété intellectuelle"
        title="Contenus, reproduction et responsabilités"
        description="Cadre de base pour l'usage des contenus publiés sur le site du comité."
        icon={FileText}
      >
        <div className="space-y-4 text-sm leading-6 text-muted-foreground">
          <p>
            Les textes, visuels, éléments d&apos;identité et documents diffusés sur
            ce site sont destinés à l&apos;information des clubs, des licenciés et
            des partenaires institutionnels.
          </p>
          <p>
            Toute reproduction, diffusion ou réutilisation significative doit
            être autorisée par le comité ou faire l&apos;objet d&apos;une mention
            explicite de la source lorsqu&apos;elle est permise.
          </p>
          <p>
            Le comité veille à l&apos;exactitude des informations publiées, mais se
            réserve la possibilité de corriger, compléter ou mettre à jour les
            contenus à tout moment.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
