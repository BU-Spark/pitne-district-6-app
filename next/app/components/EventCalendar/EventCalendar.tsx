'use client';

import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, EventApi } from '@fullcalendar/core';
import { FiPlus, FiEye } from 'react-icons/fi';
import styles from './EventCalendar.module.css';

const GOOGLE_CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || 'maja.mishevska@gmail.com';
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY || 'AIzaSyCf8g-I9J2eGojPv4HTUdJYxihk4eO8Zj0';

const dictionary = {
  en: {
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      list: 'List',
    },
    weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
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
    weekDays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
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
    week: {
      dow: 0,
      doy: 6,
    },
    buttonText: dict.buttonText,
    monthNames: dict.monthNames,
    monthNamesShort: dict.monthNames.map((m) => m.substring(0, 3)),
    dayNames: dict.weekDays,
    dayNamesShort: dict.weekDays.map((d) => d.substring(0, 3)),
  };
}

type EventCalendarProps = {
  lang: string;
};

export default function EventCalendar({ lang }: EventCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const formatEventDate = (event: EventApi) => {
    const start = new Date(event.start!);
    const end = event.end ? new Date(event.end) : null;

    const formatOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    if (event.allDay) {
      return start.toLocaleDateString(lang, formatOptions);
    } else {
      const dateStr = start.toLocaleDateString(lang, formatOptions);
      const startTime = start.toLocaleTimeString(lang, timeOptions);
      const endTime = end ? end.toLocaleTimeString(lang, timeOptions) : '';
      return `${dateStr} from ${startTime}${endTime ? ` to ${endTime}` : ''}`;
    }
  };

  const handleAddEventToCalendar = (event: EventApi) => {
    const startDate = new Date(event.start!);
    const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 60 * 60 * 1000);

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title || 'Event'
    )}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent(
      event.extendedProps?.description || 'Event from District 6 Calendar'
    )}&location=${encodeURIComponent(event.extendedProps?.location || '')}`;

    window.open(googleCalendarUrl, '_blank');
    setShowEventPopup(false);
  };

  const handleEventClick = (info: EventClickArg) => {
    info.jsEvent.preventDefault();

    const rect = info.el.getBoundingClientRect();
    setPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });

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

  return (
    <div className={styles.calendarWrapper}>
      <div className="notranslate">
        <FullCalendar
          key={lang}
          plugins={[dayGridPlugin, timeGridPlugin, googleCalendarPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={false}
          selectable={true}
          selectMirror={true}
          slotMinTime="05:00:00"
          slotMaxTime="24:00:00"
          weekends={true}
          locale={createCustomLocale(lang === 'es' ? 'es' : 'en')}
          googleCalendarApiKey={GOOGLE_API_KEY}
          events={{
            googleCalendarId: GOOGLE_CALENDAR_ID,
            className: 'gcal-event',
          }}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          ref={calendarRef}
          height="auto"
        />
      </div>

      {/* Event Details Popup */}
      {showEventPopup && selectedEvent && (
        <>
          <div className={styles.popupOverlay} onClick={handleClosePopup} />
          <div
            className={styles.eventPopup}
            style={{
              left: `${popupPosition.x}px`,
              top: `${popupPosition.y}px`,
              transform: 'translateX(-50%) translateY(-100%)',
            }}
          >
            <div className={styles.popupHeader}>
              <h3 className={styles.eventTitle}>{selectedEvent.title}</h3>
              <button className={styles.closeButton} onClick={handleClosePopup}>
                ×
              </button>
            </div>

            <div className={styles.eventDetails}>
              <p className={styles.eventDate}>{formatEventDate(selectedEvent)}</p>

              {selectedEvent.extendedProps?.location && (
                <p className={styles.eventLocation}>
                  <span className={styles.locationIcon}>📍</span>
                  {selectedEvent.extendedProps.location}
                </p>
              )}

              {selectedEvent.extendedProps?.description && (
                <p className={styles.eventDescription}>{selectedEvent.extendedProps.description}</p>
              )}
            </div>

            <div className={styles.popupActions}>
              <button className={styles.addToCalendarButton} onClick={() => handleAddEventToCalendar(selectedEvent)}>
                <FiPlus
                  style={{
                    verticalAlign: 'middle',
                    marginRight: 6,
                    color: 'inherit',
                    fontSize: 20,
                  }}
                />
                Add to Calendar
              </button>

              {selectedEvent.url && (
                <button className={styles.viewDetailsButton} onClick={() => window.open(selectedEvent.url, '_blank')}>
                  <FiEye style={{ verticalAlign: 'middle', marginRight: 6, color: 'inherit', fontSize: 20 }} />
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
