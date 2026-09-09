"use client";

import { useId, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, EyeOff, X } from "lucide-react";

type PublicationConfirmationFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  itemName: string;
  isPublished: boolean;
  incompleteReasons?: string[];
};

export function PublicationConfirmationForm({
  action,
  children,
  itemName,
  isPublished,
  incompleteReasons = [],
}: PublicationConfirmationFormProps) {
  const titleId = useId();
  const descriptionId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const shouldConfirm = isPublished || incompleteReasons.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!shouldConfirm || confirmedRef.current) {
      setPending(true);
      return;
    }

    event.preventDefault();
    setOpen(true);
  }

  function handleCancel() {
    confirmedRef.current = false;
    setOpen(false);
  }

  function handleConfirm() {
    confirmedRef.current = true;
    formRef.current?.requestSubmit();
  }

  const dialog = open
    ? createPortal(
        <div
          aria-describedby={descriptionId}
          aria-labelledby={titleId}
          aria-modal="true"
          className="fixed inset-0 z-[100] grid min-h-dvh place-items-center bg-background/80 p-4 backdrop-blur-sm"
          role="alertdialog"
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-2 text-amber-700 dark:text-amber-300">
                <AlertTriangle className="size-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <h2 id={titleId} className="text-lg font-semibold">
                  {isPublished
                    ? "Dépublier ce contenu ?"
                    : "Publier un contenu incomplet ?"}
                </h2>
                <p
                  id={descriptionId}
                  className="text-sm leading-6 text-muted-foreground"
                >
                  {isPublished
                    ? "Il ne sera plus visible sur le site public. Vous pourrez le republier plus tard."
                    : "Ce contenu sera visible sur le site public malgré les points à compléter."}
                </p>
                <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium">
                  {itemName}
                </div>
                {!isPublished && incompleteReasons.length > 0 ? (
                  <ul className="list-inside list-disc rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm leading-6 text-muted-foreground">
                    {incompleteReasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                onClick={handleCancel}
                disabled={pending}
              >
                <X className="size-4" />
                Annuler
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
                onClick={handleConfirm}
                disabled={pending}
              >
                {isPublished ? (
                  <EyeOff className="size-4" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                {pending
                  ? "Mise à jour..."
                  : isPublished
                    ? "Dépublier"
                    : "Publier quand même"}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <form
        ref={formRef}
        action={action}
        aria-busy={pending}
        onSubmit={handleSubmit}
      >
        {children}
      </form>
      {dialog}
    </>
  );
}
