"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

type DeleteConfirmationFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  message?: string;
};

export function DeleteConfirmationForm({
  action,
  children,
  message = "Confirmer la suppression ? Cette action est définitive.",
}: DeleteConfirmationFormProps) {
  const [pending, setPending] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(message)) {
      event.preventDefault();
      setPending(false);
      return;
    }

    setPending(true);
  }

  return (
    <form
      action={action}
      aria-busy={pending}
      className="admin-delete-form"
      data-pending={pending}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}
