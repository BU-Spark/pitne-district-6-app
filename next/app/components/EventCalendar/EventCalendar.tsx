'use client';

import { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
// Removed listPlugin import
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, EventMountArg, EventApi } from '@fullcalendar/core';
import styles from './EventCalendar.module.css';

const GOOGLE_CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || 'maja.mishevska@gmail.com';
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY || 'AIzaSyCf8g-I9J2eGojPv4HTUdJYxihk4eO8Zj0';

export default function EventCalendar() {
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
      return start.toLocaleDateString('en-US', formatOptions);
    } else {
      const dateStr = start.toLocaleDateString('en-US', formatOptions);
      const startTime = start.toLocaleTimeString('en-US', timeOptions);
      const endTime = end ? end.toLocaleTimeString('en-US', timeOptions) : '';
      return `${dateStr} from ${startTime}${endTime ? ` to ${endTime}` : ''}`;
    }
  };

  const handleAddEventToCalendar = (event: EventApi) => {
    const startDate = new Date(event.start!);
    const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour if no end time

    // Format dates for Google Calendar URL
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title || 'Event')}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent(event.extendedProps?.description || 'Event from District 6 Calendar')}&location=${encodeURIComponent(event.extendedProps?.location || '')}`;

    window.open(googleCalendarUrl, '_blank');
    setShowEventPopup(false);
  };

  const handleEventClick = (info: EventClickArg) => {
    info.jsEvent.preventDefault();

    // Get click position for popup
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
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, /* listPlugin removed */ googleCalendarPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay', // removed listWeek here
        }}
        views={{
          dayGridMonth: {
            titleFormat: { year: 'numeric', month: 'long' },
          },
          timeGridWeek: {
            titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
          },
          timeGridDay: {
            titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
          },
        }}
        googleCalendarApiKey={GOOGLE_API_KEY}
        events={{
          googleCalendarId: GOOGLE_CALENDAR_ID,
          className: 'google-calendar-event',
        }}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        height="auto"
        aspectRatio={1.8}
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        nowIndicator={true}
        weekNumbers={false}
        eventDisplay="block"
        displayEventTime={true}
        allDaySlot={true}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        expandRows={true}
        stickyHeaderDates={true}
        fixedWeekCount={false}
        showNonCurrentDates={false}
        eventClassNames={(info: { event: { allDay: boolean } }) => {
          const classes = ['custom-event'];
          if (info.event.allDay) {
            classes.push('all-day-event');
          }
          return classes;
        }}
        eventDidMount={(info: EventMountArg) => {
          info.el.setAttribute('title', info.event.title || 'Event');
        }}
      />

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
              <p className={styles.eventDate}>
                <span className={styles.dateIcon}>📅</span>
                {formatEventDate(selectedEvent)}
              </p>

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
                📅 Add to My Calendar
              </button>

              {selectedEvent.url && (
                <button className={styles.viewDetailsButton} onClick={() => window.open(selectedEvent.url, '_blank')}>
                  🔗 View Details
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
