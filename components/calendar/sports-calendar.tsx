"use client";

import type { EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

type SportsCalendarEventStatus = "published" | "draft";

export type SportsCalendarEvent = {
  id: string;
  competitionTitle: string;
  date: string;
  title: string;
  type: string;
  location: string;
  status: SportsCalendarEventStatus;
};

type SportsCalendarProps = {
  events: SportsCalendarEvent[];
};

const typeColors: Record<string, string> = {
  Journée: "#0ea5e9",
  Convocation: "#8b5cf6",
  Inscription: "#f59e0b",
  Résultat: "#10b981",
};

function toCalendarEvents(events: SportsCalendarEvent[]): EventInput[] {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.date,
    allDay: true,
    backgroundColor: typeColors[event.type] ?? "#0ea5e9",
    borderColor: typeColors[event.type] ?? "#0ea5e9",
    textColor: "#ffffff",
    extendedProps: {
      competitionTitle: event.competitionTitle,
      location: event.location,
      status: event.status,
      type: event.type,
    },
  }));
}

export function SportsCalendar({ events }: SportsCalendarProps) {
  return (
    <div className="admin-calendar-shell">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="fr"
        firstDay={1}
        height="auto"
        events={toCalendarEvents(events)}
        dayMaxEvents={3}
        nowIndicator
        eventDisplay="block"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,listMonth",
        }}
        buttonText={{
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          list: "Liste",
        }}
        eventContent={(eventInfo) => (
          <div className="min-w-0 px-1 py-0.5">
            <p className="truncate text-xs font-semibold">
              {eventInfo.event.title}
            </p>
            <p className="truncate text-[11px] opacity-85">
              {eventInfo.event.extendedProps.competitionTitle}
            </p>
          </div>
        )}
      />
    </div>
  );
}
