import { Newspaper, RadioTower, Sparkles } from "lucide-react";

import { ArticleList } from "@/components/actualites/article-list";
import { PageIntro } from "@/components/shared/page-intro";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { createPageMetadata } from "@/lib/metadata";
import { newsArticles } from "@/lib/mock-data";
import { routeCopy } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Actualités",
  description:
    "Toutes les actualités du comité, des clubs et des actions sportives du territoire.",
  path: "/actualites",
});

export default function ActualitesPage() {
  const intro = routeCopy["/actualites"];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <SectionCard
          eyebrow="Publications"
          title="Annonces, temps forts et informations officielles"
          description="La page rassemble les informations publiées par le comité pour donner de la visibilité à la saison et à la vie des clubs."
          icon={Newspaper}
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Annonces officielles</Badge>
            <Badge variant="secondary">Formation</Badge>
            <Badge variant="secondary">Jeunes</Badge>
            <Badge variant="secondary">Vie des clubs</Badge>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Repères"
          title="Une lecture claire pour tous les publics"
          description="Le classement des contenus permet d'identifier rapidement ce qui relève d'une annonce importante, d'une information pratique ou d'un temps fort."
          icon={RadioTower}
        >
          <div className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Hiérarchie claire entre l&apos;information prioritaire et les
              publications secondaires.
            </p>
            <p>
              Catégories lisibles et présentation sobre pour conserver un ton
              institutionnel.
            </p>
          </div>
        </SectionCard>
      </section>

      <SectionCard
        eyebrow="Fil d'actualité"
        title="Publications récentes"
        description="Les dernières informations à relayer auprès des clubs, des licenciés et des partenaires."
        icon={Sparkles}
      >
        <ArticleList articles={newsArticles} />
      </SectionCard>
    </div>
  );
}
