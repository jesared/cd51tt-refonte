import { Building2, Handshake, Search } from "lucide-react";

import { ClubsList } from "@/components/clubs/clubs-list";
import { PageIntro } from "@/components/shared/page-intro";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { createPageMetadata } from "@/lib/metadata";
import { clubs } from "@/lib/mock-data";
import { routeCopy } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Clubs",
  description:
    "L'annuaire départemental des clubs pour orienter les pratiquants et valoriser le réseau affilié.",
  path: "/clubs",
});

export default function ClubsPage() {
  const intro = routeCopy["/clubs"];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <SectionCard
          eyebrow="Annuaire"
          title="Trouver un club en quelques secondes"
          description="Les informations essentielles sont mises en avant pour aider les familles, les joueurs et les nouveaux pratiquants à identifier la structure la plus adaptée."
          icon={Search}
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Jeunes</Badge>
            <Badge variant="secondary">Loisir</Badge>
            <Badge variant="secondary">Compétition</Badge>
            <Badge variant="secondary">Sport santé</Badge>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Services"
          title="Une porte d'entrée utile pour les pratiquants comme pour les dirigeants"
          description="L'annuaire peut aussi relayer les services d'accompagnement, les relais territoriaux et les contacts utiles du comité."
          icon={Handshake}
        >
          <p className="text-sm leading-6 text-muted-foreground">
            Le réseau des clubs y gagne en lisibilité et le territoire se
            présente de manière plus claire aux futurs licenciés.
          </p>
        </SectionCard>
      </section>

      <SectionCard
        eyebrow="Réseau départemental"
        title="Clubs affiliés"
        description="Une présentation simple du maillage départemental et des structures qui font vivre la discipline."
        icon={Building2}
      >
        <ClubsList clubs={clubs} />
      </SectionCard>
    </div>
  );
}
