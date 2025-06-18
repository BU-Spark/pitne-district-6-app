'use client';

import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, EventApi } from '@fullcalendar/core';
import { FiPlus, FiEye, FiCalendar, FiMapPin } from 'react-icons/fi';
import styles from './EventCalendar.module.css';

const GOOGLE_CALENDAR_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || 'maja.mishevska@gmail.com';
const GOOGLE_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY || 'AIzaSyCf8g-I9J2eGojPv4HTUdJYxihk4eO8Zj0';

/* ─── Simple i18n helpers ───────────────────────────────────────────── */
const dictionary = {
  en: {
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      list: 'List',
    },
    weekDays: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },
  es: {
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista',
    },
    weekDays: [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ],
    monthNames: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
  },
};

function createCustomLocale(lang: 'en' | 'es') {
  const dict = dictionary[lang];
  return {
    code: lang,
    week: { dow: 0, doy: 6 },
    buttonText: dict.buttonText,
    monthNames: dict.monthNames,
    monthNamesShort: dict.monthNames.map((m) => m.slice(0, 3)),
    dayNames: dict.weekDays,
    dayNamesShort: dict.weekDays.map((d) => d.slice(0, 3)),
  };
}

/* ─── Component ─────────────────────────────────────────────────────── */
type Props = { lang: 'en' | 'es' };

export default function EventCalendar({ lang }: Props) {
  const calendarRef = useRef<FullCalendar>(null);

  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [showEventPopup, setShowEventPopup] = useState(false);

  /* ── Helpers ── */
  const formatEventDate = (event: EventApi) => {
    const start = new Date(event.start!);
    const end = event.end ? new Date(event.end) : null;

    const fullDate: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const shortDate: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const fmtTime = (d: Date) =>
      d.toLocaleTimeString(lang, {
        hour: 'numeric',
        minute: d.getMinutes() ? '2-digit' : undefined,
        hour12: true,
      }).toLowerCase();

    if (event.allDay) {
      return end && start.toDateString() !== end.toDateString()
        ? `${start.toLocaleDateString(lang, fullDate)} - ${end.toLocaleDateString(
            lang,
            fullDate,
          )}`
        : start.toLocaleDateString(lang, fullDate);
    }

    if (end) {
      if (start.toDateString() === end.toDateString()) {
        /* same-day event */
        return `${start.toLocaleDateString(lang, fullDate)}, ${fmtTime(start)} - ${fmtTime(
          end,
        )}`;
      }
      /* multi-day, timed event */
      return `${start.toLocaleDateString(lang, shortDate)}, ${fmtTime(
        start,
      )} - ${end.toLocaleDateString(lang, shortDate)}, ${fmtTime(end)}`;
    }

    /* no explicit end */
    return `${start.toLocaleDateString(lang, fullDate)}, ${fmtTime(start)}`;
  };

  const handleAddToCalendar = (event: EventApi) => {
    const start = new Date(event.start!);
    const end = event.end ? new Date(event.end) : new Date(start.getTime() + 3600 * 1000);
    const iso = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title || 'Event',
    )}&dates=${iso(start)}/${iso(end)}&details=${encodeURIComponent(
      event.extendedProps?.description || 'Event from District 6 Calendar',
    )}&location=${encodeURIComponent(event.extendedProps?.location || '')}`;

    window.open(url, '_blank');
    setShowEventPopup(false);
  };

  /* ── Event handlers ── */
  const handleEventClick = (info: EventClickArg) => {
    info.jsEvent.preventDefault(); // keep calendar selection
    setSelectedEvent(info.event);
    setShowEventPopup(true);
  };

  const handleDateClick = (info: { dateStr: string }) => {
    console.log('Date clicked:', info.dateStr);
    setShowEventPopup(false);
  };

  const handleClosePopup = () => {
    setShowEventPopup(false);
    setSelectedEvent(null);
  };

  /* ── Render ── */
  return (
    <div className={styles.calendarWrapper}>
      <div className="notranslate">
        <FullCalendar
          key={lang}
          plugins={[dayGridPlugin, timeGridPlugin, googleCalendarPlugin, interactionPlugin]}
          ref={calendarRef}
          initialView="dayGridMonth"
          locale={createCustomLocale(lang)}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="auto"
          selectable
          editable={false}
          slotMinTime="05:00:00"
          slotMaxTime="24:00:00"
          events={{
            googleCalendarId: GOOGLE_CALENDAR_ID,
            className: 'gcal-event',
          }}
          googleCalendarApiKey={GOOGLE_API_KEY}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
        />
      </div>

      {/* ── Popup ── */}
      {showEventPopup && selectedEvent && (
        <>
          <div className={styles.popupOverlay} onClick={handleClosePopup} />
          <div className={styles.eventPopup}>
            <div className={styles.popupHeader}>
              <h3 className={styles.eventTitle}>{selectedEvent.title}</h3>
              <button className={styles.closeButton} onClick={handleClosePopup}>
                ×
              </button>
            </div>

            <div className={styles.eventDetails}>
              <p className={styles.eventDate}>
                <FiCalendar className={styles.icon} />
                <span className={styles.textWrap}>{formatEventDate(selectedEvent)}</span>
              </p>

              {selectedEvent.extendedProps?.location && (
                <p className={styles.eventLocation}>
                  <FiMapPin className={styles.icon} />
                  <span className={styles.textWrap}>{selectedEvent.extendedProps.location}</span>
                </p>
              )}

              {selectedEvent.extendedProps?.description && (
                <p className={styles.eventDescription}>
                  {selectedEvent.extendedProps.description}
                </p>
              )}
            </div>

            <div className={styles.popupActions}>
              <button
                className={styles.addToCalendarButton}
                onClick={() => handleAddToCalendar(selectedEvent)}
              >
                <FiPlus style={{ marginRight: 3, fontSize: 20 }} />
                Add to Calendar
              </button>

              {selectedEvent.url && (
                <button
                  className={styles.viewDetailsButton}
                  onClick={() => window.open(selectedEvent.url as string, '_blank')}
                >
                  <FiEye style={{ marginRight: 3, fontSize: 20 }} />
                  View Details
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}