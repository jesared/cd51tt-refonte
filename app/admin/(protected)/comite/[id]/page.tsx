import { notFound } from "next/navigation";

import { PeopleMemberForm } from "@/components/admin/people-member-form";
import { getAdminCommitteeMemberById } from "@/lib/admin-people";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Modifier un membre",
  description: "Édition d'un membre du comité.",
  path: "/admin/comite",
});

type AdminEditCommitteeMemberPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    error?: string;
    saved?: string;
  };
};

export default async function AdminEditCommitteeMemberPage({
  params,
  searchParams,
}: AdminEditCommitteeMemberPageProps) {
  const member = await getAdminCommitteeMemberById(params.id);

  if (!member) {
    notFound();
  }

  return (
    <PeopleMemberForm
      kind="committee"
      mode="edit"
      member={member}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
      saved={searchParams?.saved === "1"}
    />
  );
}
