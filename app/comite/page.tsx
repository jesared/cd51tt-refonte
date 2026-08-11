import Link from "next/link";
import { ArrowRight, Landmark, UserRoundCheck, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getPublicCommitteeMembers,
  getPublicTechnicalStaffMembers,
} from "@/lib/admin-people";
import { getCloudinaryCircleAvatarUrl } from "@/lib/cloudinary-url";
import { createPageMetadata } from "@/lib/metadata";
import { actualCommitteeMembers, technicalStaffMembers } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Comité",
  description:
    "Les responsables et domaines d'intervention du Comité Marne de tennis de table.",
  path: "/comite",
});

export const dynamic = "force-dynamic";

export default async function ComitePage() {
  const committeeMembers =
    (await getPublicCommitteeMembers()) ?? actualCommitteeMembers;
  const staffMembers =
    (await getPublicTechnicalStaffMembers()) ?? technicalStaffMembers;
  const areas = Array.from(
    new Set(committeeMembers.map((member) => member.area)),
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Landmark className="size-4" />
            Gouvernance
          </div>
          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Comité
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Les interlocuteurs du comité et leurs domaines d&apos;action.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge variant="secondary">
            {committeeMembers.length} responsables
          </Badge>
          {areas.map((area) => (
            <Badge key={area} variant="outline">
              {area}
            </Badge>
          ))}
        </div>
      </section>

      <section className="interactive-card flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <UserRoundCheck className="size-4" />
            Encadrement
          </div>
          <h2 className="text-xl font-semibold tracking-tight">
            Cadres techniques
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Retrouvez les {staffMembers.length} cadres techniques du comité.
          </p>
        </div>
        <Link
          href="/cadres-techniques"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Voir les cadres
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {committeeMembers.map((member) => (
          <article
            key={member.name}
            className="interactive-card flex min-h-72 flex-col justify-between rounded-lg border border-border bg-card p-5 hover:bg-accent"
          >
            <div>
              <div className="flex items-start justify-between gap-5">
                <div className="flex min-w-0 items-center gap-4">
                  <Avatar className="size-20 border border-border bg-background sm:size-24">
                    {member.imageUrl ? (
                      <AvatarImage
                        src={getCloudinaryCircleAvatarUrl(member.imageUrl)}
                        alt={member.name}
                      />
                    ) : null}
                    <AvatarFallback className="text-lg font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h2 className="font-semibold leading-6">{member.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {member.area}
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                <Users className="size-4" />
                Mission
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {member.mission}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
