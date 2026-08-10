"use client";

import { useEffect, useRef } from "react";
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

const mobileCalendarQuery = "(max-width: 639px)";

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
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileCalendarQuery);

    function syncCalendarView() {
      const calendarApi = calendarRef.current?.getApi();
      const nextView = mediaQuery.matches ? "listMonth" : "dayGridMonth";

      if (calendarApi && calendarApi.view.type !== nextView) {
        calendarApi.changeView(nextView);
      }
    }

    syncCalendarView();
    mediaQuery.addEventListener("change", syncCalendarView);

    return () => mediaQuery.removeEventListener("change", syncCalendarView);
  }, []);

  return (
    <div className="admin-calendar-shell">
      <FullCalendar
        ref={calendarRef}
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
          <div className="min-w-0 px-1.5 py-1">
            <p className="truncate text-[11px] font-semibold leading-4 sm:text-xs">
              {eventInfo.event.title}
            </p>
            <p className="hidden truncate text-[11px] leading-4 opacity-85 sm:block">
              {eventInfo.event.extendedProps.competitionTitle}
            </p>
          </div>
        )}
      />
    </div>
  );
}
