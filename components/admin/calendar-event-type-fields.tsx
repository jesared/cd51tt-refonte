"use client";

import { useState } from "react";
import { CalendarEventType } from "@prisma/client";

const eventTypes = [
  { value: CalendarEventType.JOURNEE, label: "Journée" },
  { value: CalendarEventType.CONVOCATION, label: "Convocation" },
  { value: CalendarEventType.INSCRIPTION, label: "Inscription" },
  { value: CalendarEventType.RESULTAT, label: "Résultat" },
  { value: CalendarEventType.REUNION, label: "Réunion" },
];

type CalendarEventTypeFieldsProps = {
  competitionOptions: Array<{ id: string; title: string }>;
  defaultCompetitionId?: string;
  initialType: CalendarEventType;
};

export function CalendarEventTypeFields({
  competitionOptions,
  defaultCompetitionId,
  initialType,
}: CalendarEventTypeFieldsProps) {
  const [type, setType] = useState(initialType);
  const isMeeting = type === CalendarEventType.REUNION;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="grid gap-2">
        <label htmlFor="type" className="text-sm font-medium">
          Type d’échéance
        </label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(event) => setType(event.target.value as CalendarEventType)}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
        >
          {eventTypes.map((eventType) => (
            <option key={eventType.value} value={eventType.value}>
              {eventType.label}
            </option>
          ))}
        </select>
        <p className="text-xs leading-5 text-muted-foreground">
          {isMeeting
            ? "Une réunion peut être générale ou rattachée à une compétition."
            : "Choisissez la nature de cette échéance."}
        </p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="competitionId" className="text-sm font-medium">
          {isMeeting ? "Compétition associée (facultatif)" : "Compétition concernée"}
        </label>
        <select
          id="competitionId"
          name="competitionId"
          defaultValue={defaultCompetitionId ?? ""}
          required={!isMeeting}
          className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
        >
          <option value="">
            {isMeeting ? "Réunion générale (sans compétition)" : "Choisir une compétition"}
          </option>
          {competitionOptions.map((competition) => (
            <option key={competition.id} value={competition.id}>
              {competition.title}
            </option>
          ))}
        </select>
        <p className="text-xs leading-5 text-muted-foreground">
          {isMeeting
            ? "Laissez « Réunion générale » pour une réunion indépendante, ou choisissez une compétition pour y rattacher la réunion."
            : "Cette échéance sera affichée sur la page de la compétition choisie."}
        </p>
        {competitionOptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune compétition n’est disponible. Vous pouvez tout de même créer une réunion générale.
          </p>
        ) : null}
      </div>
    </div>
  );
}
