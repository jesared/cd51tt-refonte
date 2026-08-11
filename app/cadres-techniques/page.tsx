import { ClipboardList, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getPublicTechnicalStaffMembers } from "@/lib/admin-people";
import { getCloudinaryCircleAvatarUrl } from "@/lib/cloudinary-url";
import { createPageMetadata } from "@/lib/metadata";
import { technicalStaffMembers } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Cadres techniques",
  description: "Les cadres techniques du Comité Marne de tennis de table.",
  path: "/cadres-techniques",
});

export const dynamic = "force-dynamic";

export default async function CadresTechniquesPage() {
  const staffMembers =
    (await getPublicTechnicalStaffMembers()) ?? technicalStaffMembers;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <ClipboardList className="size-4" />
            Encadrement
          </div>
          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Cadres techniques
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Les cadres techniques référencés par le comité.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge variant="secondary">{staffMembers.length} cadres</Badge>
          <Badge variant="outline">Technique</Badge>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {staffMembers.map((member) => (
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
                      {member.role ?? "Cadre technique"}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {member.area ?? "Technique"}
                </Badge>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                <Users className="size-4" />
                Mission
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {member.mission ??
                  "Informations complémentaires à ajouter prochainement."}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
