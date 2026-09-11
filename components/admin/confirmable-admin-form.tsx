"use client";

import { useId, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

type ConfirmableAdminFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  className?: string;
  currentHasImage?: boolean;
  contentLabel?: string;
  contentType?: "competition" | "news" | "document" | "calendar";
};

type Confirmation = {
  title: string;
  message: string;
  tone: "warning" | "danger";
};

function isProvidedFile(value: FormDataEntryValue | null) {
  return value instanceof File && value.size > 0 && Boolean(value.name);
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getMissingCompetitionFields(formData: FormData) {
  const missingFields = [
    ["title", "titre"],
    ["registrationDeadline", "date limite d’inscription"],
    ["location", "lieu"],
    ["manager", "responsable"],
  ]
    .filter(([key]) => !getString(formData, key))
    .map(([, label]) => label);

  if (!isProvidedFile(formData.get("imageUpload")) && !getString(formData, "imageUrl")) {
    missingFields.push("image");
  }

  return missingFields;
}

function getMissingNewsFields(formData: FormData) {
  return [
    ["title", "titre"],
    ["excerpt", "extrait"],
    ["content", "contenu"],
  ]
    .filter(([key]) => !getString(formData, key))
    .map(([, label]) => label)
    .concat(
      !isProvidedFile(formData.get("imageUpload")) && !getString(formData, "imageUrl")
        ? ["image"]
        : [],
    );
}

function getMissingDocumentFields(formData: FormData) {
  return [
    ["title", "titre"],
    ["description", "description"],
    ["category", "catégorie"],
    ["format", "format"],
  ]
    .filter(([key]) => !getString(formData, key))
    .map(([, label]) => label)
    .concat(
      !isProvidedFile(formData.get("fileUpload")) && !getString(formData, "fileUrl")
        ? ["fichier ou lien"]
        : [],
    );
}

function getMissingCalendarFields(formData: FormData) {
  return [
    ["competitionId", "compétition liée"],
    ["title", "libellé"],
    ["date", "date"],
    ["location", "lieu"],
  ]
    .filter(([key]) => !getString(formData, key))
    .map(([, label]) => label);
}

function getMissingFields(
  formData: FormData,
  contentType: NonNullable<ConfirmableAdminFormProps["contentType"]>,
) {
  if (contentType === "news") {
    return getMissingNewsFields(formData);
  }

  if (contentType === "document") {
    return getMissingDocumentFields(formData);
  }

  if (contentType === "calendar") {
    return getMissingCalendarFields(formData);
  }

  return getMissingCompetitionFields(formData);
}

function getConfirmations(
  formData: FormData,
  currentHasImage: boolean,
  contentType: NonNullable<ConfirmableAdminFormProps["contentType"]>,
) {
  const confirmations: Confirmation[] = [];
  const hasNewImage = isProvidedFile(formData.get("imageUpload"));
  const removesImage = getString(formData, "removeImage") === "on";
  const publishesContent = formData.get("published") === "on";
  const missingFields = getMissingFields(formData, contentType);

  if (currentHasImage && hasNewImage) {
    confirmations.push({
      title: "Remplacer l’image ?",
      message:
        "La nouvelle image remplacera l’image actuellement affichée après enregistrement.",
      tone: "warning",
    });
  }

  if (currentHasImage && removesImage) {
    confirmations.push({
      title: "Supprimer l’image ?",
      message:
        "La compétition restera enregistrée, mais elle n’aura plus d’image visible.",
      tone: "danger",
    });
  }

  if (publishesContent && missingFields.length > 0) {
    confirmations.push({
      title: "Publier malgré des infos incomplètes ?",
      message: `À compléter idéalement avant publication : ${missingFields.join(", ")}.`,
      tone: "warning",
    });
  }

  return confirmations;
}

export function ConfirmableAdminForm({
  action,
  children,
  className,
  currentHasImage = false,
  contentLabel = "ce contenu",
  contentType = "competition",
}: ConfirmableAdminFormProps) {
  const titleId = useId();
  const descriptionId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);
  const [pending, setPending] = useState(false);
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (confirmedRef.current) {
      setPending(true);
      return;
    }

    const nextConfirmations = getConfirmations(
      new FormData(event.currentTarget),
      currentHasImage,
      contentType,
    );

    if (nextConfirmations.length > 0) {
      event.preventDefault();
      setConfirmations(nextConfirmations);
    }
  }

  function handleCancel() {
    confirmedRef.current = false;
    setConfirmations([]);
  }

  function handleConfirm() {
    confirmedRef.current = true;
    formRef.current?.requestSubmit();
  }

  const dialog =
    confirmations.length > 0
      ? createPortal(
          <div
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            aria-modal="true"
            className="fixed inset-0 z-[100] grid min-h-dvh place-items-center bg-background/80 p-4 backdrop-blur-sm"
            role="alertdialog"
          >
            <div className="w-full max-w-lg rounded-xl border border-border bg-popover p-5 text-popover-foreground shadow-2xl">
              <div className="flex items-start gap-3">
                <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-2 text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="size-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <h2 id={titleId} className="text-lg font-semibold">
                    Confirmer l’enregistrement
                  </h2>
                  <p
                    id={descriptionId}
                    className="text-sm leading-6 text-muted-foreground"
                  >
                    Vérification avant de modifier {contentLabel}.
                  </p>
                  <div className="grid gap-2">
                    {confirmations.map((confirmation) => (
                      <div
                        key={confirmation.title}
                        className={
                          confirmation.tone === "danger"
                            ? "rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm"
                            : "rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm"
                        }
                      >
                        <p className="font-medium">{confirmation.title}</p>
                        <p className="mt-1 leading-5 text-muted-foreground">
                          {confirmation.message}
                        </p>
                      </div>
                    ))}
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
                  Revenir au formulaire
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
                  onClick={handleConfirm}
                  disabled={pending}
                >
                  <CheckCircle2 className="size-4" />
                  {pending ? "Enregistrement..." : "Confirmer"}
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
        className={className}
        onSubmit={handleSubmit}
      >
        {children}
      </form>
      {dialog}
    </>
  );
}
