"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Save, X } from "lucide-react";

type UnsavedChangesGuardProps = {
  message?: string;
};

function getFormSnapshot(form: HTMLFormElement) {
  const fields = Array.from(
    form.elements,
  ).filter(
    (element): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement,
  );

  return JSON.stringify(
    fields.map((field) => {
      if (field instanceof HTMLInputElement && field.type === "file") {
        return [field.name, Array.from(field.files ?? []).map((file) => file.name)];
      }

      if (field instanceof HTMLInputElement && field.type === "checkbox") {
        return [field.name, field.checked];
      }

      if (field instanceof HTMLInputElement && field.type === "radio") {
        return [field.name, field.value, field.checked];
      }

      return [field.name, field.value];
    }),
  );
}

export function UnsavedChangesGuard({
  message = "Vous avez des modifications non enregistrées.",
}: UnsavedChangesGuardProps) {
  const router = useRouter();
  const titleId = useId();
  const descriptionId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const initialSnapshotRef = useRef("");
  const pendingHrefRef = useRef<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const form = rootRef.current?.closest("form") ?? null;

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const currentForm = form;

    formRef.current = currentForm;
    initialSnapshotRef.current = getFormSnapshot(currentForm);

    function refreshDirtyState() {
      if (!formRef.current) {
        return;
      }

      setDirty(getFormSnapshot(formRef.current) !== initialSnapshotRef.current);
    }

    function handleSubmit() {
      initialSnapshotRef.current = getFormSnapshot(currentForm);
      setDirty(false);
    }

    currentForm.addEventListener("input", refreshDirtyState);
    currentForm.addEventListener("change", refreshDirtyState);
    currentForm.addEventListener("submit", handleSubmit);

    return () => {
      currentForm.removeEventListener("input", refreshDirtyState);
      currentForm.removeEventListener("change", refreshDirtyState);
      currentForm.removeEventListener("submit", handleSubmit);
    };
  }, []);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dirty]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!dirty || event.defaultPrevented) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("a[href]");

      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      if (link.target || link.hasAttribute("download")) {
        return;
      }

      const destination = new URL(link.href, window.location.href);

      if (
        destination.origin !== window.location.origin ||
        destination.href === window.location.href ||
        destination.hash
      ) {
        return;
      }

      event.preventDefault();
      pendingHrefRef.current = `${destination.pathname}${destination.search}${destination.hash}`;
      setConfirmOpen(true);
    }

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [dirty]);

  function handleStay() {
    pendingHrefRef.current = null;
    setConfirmOpen(false);
  }

  function handleLeave() {
    const href = pendingHrefRef.current;

    if (!href) {
      setConfirmOpen(false);
      return;
    }

    setDirty(false);
    setConfirmOpen(false);
    router.push(href);
  }

  return (
    <div ref={rootRef}>
      {dirty ? (
        <div className="sticky top-4 z-20 flex flex-col gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 shadow-sm dark:text-amber-200 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2 font-medium">
            <AlertTriangle className="size-4" />
            {message}
          </span>
          <span className="inline-flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
            <Save className="size-3.5" />
            Enregistrez avant de quitter cette page.
          </span>
        </div>
      ) : null}

      {confirmOpen ? (
        <div
          aria-describedby={descriptionId}
          aria-labelledby={titleId}
          aria-modal="true"
          className="fixed inset-0 z-[100] grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
          role="alertdialog"
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-2 text-amber-700 dark:text-amber-200">
                <AlertTriangle className="size-5" />
              </div>
              <div className="space-y-2">
                <h2 id={titleId} className="text-lg font-semibold">
                  Quitter sans enregistrer ?
                </h2>
                <p id={descriptionId} className="text-sm leading-6 text-muted-foreground">
                  Les modifications de ce formulaire seront perdues si vous
                  changez de page maintenant.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                onClick={handleStay}
              >
                <X className="size-4" />
                Rester
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                onClick={handleLeave}
              >
                Quitter sans enregistrer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
