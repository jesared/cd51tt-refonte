"use client";

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
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
