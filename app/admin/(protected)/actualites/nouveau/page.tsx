import { NewsArticleForm } from "@/components/admin/news-article-form";
import { requireEditorSession } from "@/lib/admin-auth";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Nouvelle actualite",
  description: "Création d'un article dans l'administration du comité.",
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
  const session = await requireEditorSession("/admin/actualites");

  return (
    <NewsArticleForm
      mode="create"
      canPublish={session.role === "ADMIN"}
      errorMessage={searchParams?.error ? decodeURIComponent(searchParams.error) : null}
    />
  );
}
