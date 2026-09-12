"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type ContactMailFormProps = {
  recipientEmail: string;
};

function buildMailtoUrl({
  recipientEmail,
  name,
  email,
  subject,
  message,
}: {
  recipientEmail: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const body = [
    message,
    "",
    "---",
    `Nom : ${name}`,
    `Email : ${email}`,
    "Envoyé depuis le site CD51TT.",
  ].join("\n");

  return `mailto:${recipientEmail}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function ContactMailForm({ recipientEmail }: ContactMailFormProps) {
  const [status, setStatus] = useState<"idle" | "ready">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      return;
    }

    window.location.href = buildMailtoUrl({
      recipientEmail,
      name,
      email,
      subject: `Demande depuis le site CD51TT - ${subject}`,
      message,
    });
    setStatus("ready");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Nom</span>
          <input
            name="name"
            required
            autoComplete="name"
            className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-medium">Objet</span>
        <input
          name="subject"
          required
          placeholder="Question compétition, document, club..."
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          className="rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          Le bouton ouvre votre logiciel de messagerie avec le message préparé.
        </p>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          Préparer l&apos;email
          <Send className="size-4" />
        </button>
      </div>

      {status === "ready" ? (
        <p className="rounded-xl border border-border bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
          Votre message est prêt dans votre messagerie. Vérifiez-le puis envoyez
          l&apos;email.
        </p>
      ) : null}
    </form>
  );
}
