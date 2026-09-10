"use client";

import type { FormEvent, ReactNode } from "react";

type ConfirmableActionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  className?: string;
  message: string;
};

export function ConfirmableActionForm({
  action,
  children,
  className,
  message,
}: ConfirmableActionFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
