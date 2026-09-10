import { notFound } from "next/navigation";

import { NewsArticleForm } from "@/components/admin/news-article-form";
import { requireEditorSession } from "@/lib/admin-auth";
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
    saved?: string;
  };
};

export default async function AdminEditArticlePage({
  params,
  searchParams,
}: AdminEditArticlePageProps) {
  const [article, session] = await Promise.all([
    getAdminNewsArticleById(params.id),
    requireEditorSession("/admin/actualites"),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <NewsArticleForm
      mode="edit"
      article={article}
      canPublish={session.role === "ADMIN" || session.role === "EDITOR"}
      errorMessage={searchParams?.error ? decodeURIComponent(searchParams.error) : null}
      saved={searchParams?.saved === "1"}
    />
  );
}
