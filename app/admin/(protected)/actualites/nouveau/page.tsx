import { NewsArticleForm } from "@/components/admin/news-article-form";
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
  return (
    <NewsArticleForm
      mode="create"
      errorMessage={searchParams?.error ? decodeURIComponent(searchParams.error) : null}
    />
  );
}
