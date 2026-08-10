import Link from "next/link";
import { ExternalLink, List, Plus } from "lucide-react";

type SaveResultActionsProps = {
  message: string;
  publicHref?: string | null;
  createHref?: string | null;
  listHref?: string;
};

export function SaveResultActions({
  message,
  publicHref,
  createHref,
  listHref,
}: SaveResultActionsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 lg:flex-row lg:items-center lg:justify-between">
      <span>{message}</span>
      <div className="flex flex-wrap gap-2">
        {publicHref ? (
          <Link
            href={publicHref}
            target="_blank"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-emerald-500/25 px-3 font-medium text-emerald-800 transition hover:bg-emerald-500/10 dark:text-emerald-200"
          >
            <ExternalLink className="size-4" />
            Voir la page publique
          </Link>
        ) : null}
        {createHref ? (
          <Link
            href={createHref}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-emerald-500/25 px-3 font-medium text-emerald-800 transition hover:bg-emerald-500/10 dark:text-emerald-200"
          >
            <Plus className="size-4" />
            Créer un autre
          </Link>
        ) : null}
        {listHref ? (
          <Link
            href={listHref}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-emerald-500/25 px-3 font-medium text-emerald-800 transition hover:bg-emerald-500/10 dark:text-emerald-200"
          >
            <List className="size-4" />
            Retour liste
          </Link>
        ) : null}
      </div>
    </div>
  );
}
