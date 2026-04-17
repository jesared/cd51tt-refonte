import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  LayoutTemplate,
  Network,
  Newspaper,
  ShieldCheck,
} from "lucide-react";

import { ArticleList } from "@/components/actualites/article-list";
import { ClubsList } from "@/components/clubs/clubs-list";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ffttApiReadiness } from "@/lib/fftt/client";
import { createPageMetadata } from "@/lib/metadata";
import {
  clubs,
  competitions,
  newsArticles,
  siteMetrics,
} from "@/lib/mock-data";
import { siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Accueil",
  description:
    "Le site officiel du comité départemental de tennis de table de la Marne pour suivre l'actualité, les compétitions, les clubs et les ressources utiles.",
  path: "/",
});

const highlightCards = [
  {
    title: "Information officielle",
    description:
      "Retrouvez au même endroit les annonces, documents et informations diffusés par le comité.",
    icon: LayoutTemplate,
  },
  {
    title: "Accompagnement des clubs",
    description:
      "Une lecture simple pour aider les dirigeants, bénévoles, licenciés et familles à trouver rapidement l'essentiel.",
    icon: Network,
  },
  {
    title: "Vie sportive",
    description:
      "Le calendrier, les épreuves et les temps forts de la saison sont présentés avec une hiérarchie claire.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="surface-panel px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div className="space-y-5">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {siteConfig.season}
            </Badge>
            <div className="space-y-4">
              <h2 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Le site officiel du tennis de table marnais pour suivre la
                saison, orienter les clubs et diffuser l&apos;information utile.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                Le comité départemental rassemble ici les actualités, les
                compétitions, les ressources administratives et les informations
                pratiques pour accompagner les acteurs du territoire tout au
                long de la saison.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/actualites"
                className={buttonVariants({ variant: "default", size: "lg" })}
              >
                Explorer l&apos;actualité
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/clubs"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Découvrir les clubs
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {siteMetrics.slice(0, 2).map((metric) => (
              <div
                key={metric.label}
                className="rounded-[1.35rem] border border-border bg-card p-5"
              >
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {metric.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {highlightCards.map((card) => (
          <SectionCard
            key={card.title}
            title={card.title}
            description={card.description}
            icon={card.icon}
          >
            <p className="text-sm leading-6 text-muted-foreground">
              Une présentation homogène pour mieux informer les clubs, les
              licenciés et les partenaires institutionnels.
            </p>
          </SectionCard>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <SectionCard
          eyebrow="Vue rapide"
          title="Indicateurs de saison"
          description="Quelques repères pour lire en un coup d'oeil l'activité départementale."
          icon={CalendarRange}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {siteMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-border bg-muted p-5"
              >
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="mt-3 text-2xl font-semibold">{metric.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Services numériques"
          title="Connexion fédérale en préparation"
          description="Les données FFTT pourront enrichir à terme les pages sportives et les informations diffusées par le comité."
          icon={ShieldCheck}
        >
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-muted px-4 py-3">
              <span>Source des données</span>
              <Badge
                variant={ffttApiReadiness.hasApiKey ? "default" : "secondary"}
              >
                {ffttApiReadiness.hasApiKey ? "Connexion active" : "Mode local"}
              </Badge>
            </div>
            <div className="rounded-2xl border border-border bg-muted px-4 py-3">
              <p className="font-medium text-foreground">Service prévu</p>
              <p className="mt-1">{ffttApiReadiness.baseUrl}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted px-4 py-3">
              <p className="font-medium text-foreground">Ressources concernées</p>
              <p className="mt-1">
                {ffttApiReadiness.configuredEndpoints.join(" · ")}
              </p>
            </div>
          </div>
        </SectionCard>
      </section>

      <SectionCard
        eyebrow="Actualités"
        title="À la une"
        description="Les informations prioritaires du moment pour les clubs, les licenciés et les familles."
        icon={Newspaper}
      >
        <ArticleList articles={newsArticles.slice(0, 3)} />
      </SectionCard>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <SectionCard
          eyebrow="Compétitions"
          title="Temps forts du calendrier"
          description="Une lecture synthétique des rendez-vous sportifs à retenir sur la saison."
          icon={CalendarRange}
        >
          <div className="space-y-4">
            {competitions.map((competition) => (
              <div
                key={competition.title}
                className="rounded-3xl border border-border bg-muted p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-medium">{competition.title}</h3>
                  <Badge variant="secondary">{competition.status}</Badge>
                  <Badge variant="outline">{competition.format}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {competition.summary}
                </p>
                <p className="mt-3 text-sm font-medium text-foreground">
                  {competition.period}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Annuaire"
          title="Clubs mis en avant"
          description="Un aperçu du réseau départemental pour orienter rapidement les pratiquants."
          icon={Network}
        >
          <ClubsList clubs={clubs.slice(0, 4)} />
        </SectionCard>
      </section>
    </div>
  );
}
