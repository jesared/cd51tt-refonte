import { PeopleMemberForm } from "@/components/admin/people-member-form";
import { requireAdministratorSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Nouveau membre",
  description: "Ajout d'un membre du comité.",
  path: "/admin/comite/nouveau",
});

type AdminNewCommitteeMemberPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function AdminNewCommitteeMemberPage({
  searchParams,
}: AdminNewCommitteeMemberPageProps) {
  await requireAdministratorSession("/admin");

  return (
    <PeopleMemberForm
      kind="committee"
      mode="create"
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
