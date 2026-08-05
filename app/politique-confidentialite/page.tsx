import { Database, LockKeyhole, Mail } from "lucide-react";

import { PageIntro } from "@/components/shared/page-intro";
import { SectionCard } from "@/components/shared/section-card";
import { createPageMetadata } from "@/lib/metadata";
import { routeCopy } from "@/lib/site";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const metadata = createPageMetadata({
  title: "Politique de confidentialité",
  description:
    "Principes de collecte, d'usage et de protection des données personnelles du site du comité.",
  path: "/politique-confidentialite",
});

export default async function PolitiqueConfidentialitePage() {
  const intro = routeCopy["/politique-confidentialite"];
  const { siteConfig } = await getPublicSiteSettings();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SectionCard
          eyebrow="Collecte"
          title="Données concernées"
          description="Le site est conçu pour limiter la collecte aux informations strictement utiles."
          icon={Database}
        >
          <div className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Les données transmises via le formulaire de contact peuvent
              inclure le nom, l&apos;adresse email, l&apos;objet et le contenu du
              message.
            </p>
            <p>
              Ces informations sont utilisées uniquement pour répondre aux
              demandes adressées au comité et assurer le suivi des échanges.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Protection"
          title="Usage et conservation"
          description="Une base claire pour encadrer le traitement des demandes et préparer une mise en conformité plus poussée."
          icon={LockKeyhole}
        >
          <div className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Les données ne sont pas destinées à une réutilisation commerciale
              ni à une cession à des tiers hors besoins techniques ou légaux.
            </p>
            <p>
              La durée de conservation doit être définie selon l&apos;outil de
              traitement retenu et la nature des demandes reçues.
            </p>
          </div>
        </SectionCard>
      </section>

      <SectionCard
        eyebrow="Droits des personnes"
        title="Exercer un droit d'accès, de rectification ou de suppression"
        description="Point de contact à utiliser pour toute question liée aux données personnelles."
        icon={Mail}
      >
        <div className="space-y-4 text-sm leading-6 text-muted-foreground">
          <p>
            Toute personne ayant transmis des données via le site peut demander
            des informations sur leur traitement, leur rectification ou leur
            suppression.
          </p>
          <p>
            Pour toute demande, le contact de référence est :
            <span className="ml-1 font-medium text-foreground">
              {siteConfig.dataContact}
            </span>
          </p>
          <p>
            Cette page constitue une base éditoriale et doit être complétée
            avant publication selon les outils effectivement mis en place.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
