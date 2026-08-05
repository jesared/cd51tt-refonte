import { PeopleMemberForm } from "@/components/admin/people-member-form";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Nouveau cadre technique",
  description: "Ajout d'un cadre technique.",
  path: "/admin/cadres-techniques/nouveau",
});

type AdminNewTechnicalStaffPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function AdminNewTechnicalStaffPage({
  searchParams,
}: AdminNewTechnicalStaffPageProps) {
  return (
    <PeopleMemberForm
      kind="technical"
      mode="create"
      errorMessage={
        searchParams?.error ? decodeURIComponent(searchParams.error) : null
      }
    />
  );
}
