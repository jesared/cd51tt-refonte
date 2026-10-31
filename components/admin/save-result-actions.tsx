import Link from "next/link";
import { CheckCircle2, Edit3, ExternalLink, List, Plus } from "lucide-react";

type SaveResultActionsProps = {
  message: string;
  publicHref?: string | null;
  editHref?: string | null;
  createHref?: string | null;
  listHref?: string;
};

export function SaveResultActions({
  message,
  publicHref,
  editHref,
  createHref,
  listHref,
}: SaveResultActionsProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 shadow-sm dark:text-emerald-200 lg:flex-row lg:items-center lg:justify-between"
    >
      <span className="flex items-center gap-2 font-semibold">
        <CheckCircle2 aria-hidden="true" className="size-5 shrink-0" />
        {message}
      </span>
      <div className="flex flex-wrap gap-2">
        {publicHref ? (
          <Link
            href={publicHref}
            target="_blank"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 px-3 font-medium text-emerald-900 transition hover:bg-emerald-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 dark:text-emerald-100"
          >
            <ExternalLink className="size-4" />
            Voir la page publique
          </Link>
        ) : null}
        {editHref ? (
          <Link
            href={editHref}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 px-3 font-medium text-emerald-900 transition hover:bg-emerald-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 dark:text-emerald-100"
          >
            <Edit3 className="size-4" />
            Modifier encore
          </Link>
        ) : null}
        {createHref ? (
          <Link
            href={createHref}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 px-3 font-medium text-emerald-900 transition hover:bg-emerald-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 dark:text-emerald-100"
          >
            <Plus className="size-4" />
            Créer un autre
          </Link>
        ) : null}
        {listHref ? (
          <Link
            href={listHref}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 px-3 font-medium text-emerald-900 transition hover:bg-emerald-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/60 dark:text-emerald-100"
          >
            <List className="size-4" />
            Retour à la liste
          </Link>
        ) : null}
      </div>
    </div>
  );
}
