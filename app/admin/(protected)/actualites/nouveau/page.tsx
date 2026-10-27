import { NewsArticleForm } from "@/components/admin/news-article-form";
import { requireEditorSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";
import { getPublishedCompetitionItems } from "@/lib/admin-competitions";

export const metadata = createPageMetadata({
  title: "Nouvelle info",
  description: "Ajout d'une information au fil de la page d'accueil.",
  path: "/admin/actualites/nouveau",
});

type AdminNewArticlePageProps = {
  searchParams?: {
    error?: string;
  };
};

export default async function AdminNewArticlePage({
  searchParams,
}: AdminNewArticlePageProps) {
  const [session, competitions] = await Promise.all([
    requireEditorSession("/admin/actualites"),
    getPublishedCompetitionItems(),
  ]);

  return (
    <NewsArticleForm
      mode="create"
      canPublish={session.role === "ADMIN" || session.role === "EDITOR"}
      targetOptions={(competitions ?? []).map((competition) => ({
        value: `/competitions/${competition.id}`,
        label: `Compétitions → ${competition.title}`,
      }))}
      errorMessage={searchParams?.error ? decodeURIComponent(searchParams.error) : null}
    />
  );
}
