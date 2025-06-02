'use client';

import { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, EventMountArg } from '@fullcalendar/core';
import styles from './EventCalendar.module.css';

const GOOGLE_CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || 'maja.mishevska@gmail.com';
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY || 'AIzaSyCf8g-I9J2eGojPv4HTUdJYxihk4eO8Zj0';

export default function EventCalendar() {
  const calendarRef = useRef<FullCalendar>(null);

  const handleEventClick = (info: EventClickArg) => {
    // Prevent default navigation
    info.jsEvent.preventDefault();

    // Open event in a new window/tab
    if (info.event.url) {
      window.open(info.event.url, '_blank');
    }
  };

  const handleDateClick = (info: { dateStr: string }) => {
    // You can add functionality for when a date is clicked
    console.log('Date clicked:', info.dateStr);
  };

  return (
    <div className={styles.calendarWrapper}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, googleCalendarPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
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
          // Add custom classes based on event properties
          const classes = ['custom-event'];
          if (info.event.allDay) {
            classes.push('all-day-event');
          }
          return classes;
        }}
        eventDidMount={(info: EventMountArg) => {
          // Add tooltip or additional styling
          info.el.setAttribute('title', info.event.title || 'Event');
        }}
      />
    </div>
  );
}
