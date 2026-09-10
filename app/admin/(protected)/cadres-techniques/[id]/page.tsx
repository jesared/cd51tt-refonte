import { notFound } from "next/navigation";

import { PeopleMemberForm } from "@/components/admin/people-member-form";
import { requireAdministratorSession } from "@/lib/admin-auth";
import { getAdminTechnicalStaffMemberById } from "@/lib/admin-people";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Modifier un cadre technique",
  description: "Edition d'un cadre technique.",
  path: "/admin/cadres-techniques",
});

type AdminEditTechnicalStaffPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    error?: string;
    saved?: string;
  };
};

export default async function AdminEditTechnicalStaffPage({
  params,
  searchParams,
}: AdminEditTechnicalStaffPageProps) {
  await requireAdministratorSession("/admin");

  const member = await getAdminTechnicalStaffMemberById(params.id);

  if (!member) {
    notFound();
  }

  return (
    <PeopleMemberForm
      kind="technical"
      mode="edit"
      member={member}
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
      saved={searchParams?.saved === "1"}
    />
  );
}
