"use client";

import { useId, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

type DeleteConfirmationFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  itemName: string;
  message?: string;
};

export function DeleteConfirmationForm({
  action,
  children,
  itemName,
  message = "Confirmer la suppression ? Cette action est définitive.",
}: DeleteConfirmationFormProps) {
  const titleId = useId();
  const descriptionId = useId();
  const confirmedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!confirmedRef.current) {
      event.preventDefault();
      setOpen(true);
      return;
    }

    setPending(true);
  }

  function handleCancel() {
    confirmedRef.current = false;
    setOpen(false);
  }

  function handleConfirm() {
    confirmedRef.current = true;
  }

  return (
    <>
      <form
        action={action}
        aria-busy={pending}
        className="admin-delete-form"
        data-pending={pending}
        onSubmit={handleSubmit}
      >
        {children}

        {open ? (
          <div
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            aria-modal="true"
            className="fixed inset-0 z-[100] grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
            role="alertdialog"
          >
            <div className="w-full max-w-md rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-2 text-destructive">
                  <AlertTriangle className="size-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <h2 id={titleId} className="text-lg font-semibold">
                    Supprimer cet élément ?
                  </h2>
                  <p id={descriptionId} className="text-sm leading-6 text-muted-foreground">
                    {message}
                  </p>
                  <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium">
                    {itemName}
                  </div>
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
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-destructive px-4 text-sm font-medium text-destructive-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
                  onClick={handleConfirm}
                  disabled={pending}
                >
                  <Trash2 className="size-4" />
                  {pending ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </form>
    </>
  );
}
