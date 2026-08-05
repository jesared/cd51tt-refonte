import { notFound } from "next/navigation";

import { NewsArticleForm } from "@/components/admin/news-article-form";
import { getAdminNewsArticleById } from "@/lib/admin-news";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Modifier une actualite",
  description: "Édition d'un article dans l'administration du comité.",
  path: "/admin/actualites/[id]",
});

type AdminEditArticlePageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    error?: string;
  };
};

export default async function AdminEditArticlePage({
  params,
  searchParams,
}: AdminEditArticlePageProps) {
  const article = await getAdminNewsArticleById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <NewsArticleForm
      mode="edit"
      article={article}
      errorMessage={searchParams?.error ? decodeURIComponent(searchParams.error) : null}
    />
  );
}
