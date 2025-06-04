'use client';

import { useState } from 'react';
import styles from './EventsPage.module.css';
import Navbar from '../components/Navbar/Navbar';
import EventCalendar from '../components/EventCalendar/EventCalendar';

const GOOGLE_CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || 'maja.mishevska@gmail.com';

export default function EventsPage() {
  const [showSubscriptionOptions, setShowSubscriptionOptions] = useState(false);

  const handleAddToGoogleCalendar = () => {
    // Google Calendar subscription URL
    const subscriptionUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(GOOGLE_CALENDAR_ID)}`;
    window.open(subscriptionUrl, '_blank');
  };

  const handleGetCalendarURL = () => {
    // Public calendar URL for other calendar apps
    const publicUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/public/basic.ics`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(publicUrl)
      .then(() => {
        alert('Calendar URL copied to clipboard! You can paste this into your calendar app to subscribe to updates.');
      })
      .catch(() => {
        // Fallback: show the URL in a prompt
        prompt('Copy this URL to subscribe to the calendar in your preferred app:', publicUrl);
      });
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.calendarSection}>
        <div className={styles.calendarContainer}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h2 className={styles.sectionTitle}>Event Calendar</h2>
              <p className={styles.sectionDescription}>
                View all upcoming community events, meetings, and activities in District 6.
              </p>
            </div>
            <div className={styles.calendarActions}>
              <button
                className={styles.subscribeButton}
                onClick={() => setShowSubscriptionOptions(!showSubscriptionOptions)}
              >
                📅 Subscribe to Calendar
              </button>

              {showSubscriptionOptions && (
                <div className={styles.subscriptionDropdown}>
                  <button className={styles.subscriptionOption} onClick={handleAddToGoogleCalendar}>
                    <span className={styles.optionIcon}>🔗</span>
                    Add to Google Calendar
                  </button>
                  <button className={styles.subscriptionOption} onClick={handleGetCalendarURL}>
                    <span className={styles.optionIcon}>📋</span>
                    Copy Calendar URL
                  </button>
                  <div className={styles.subscriptionNote}>
                    Subscribe to get automatic updates when new events are added!
                  </div>
                </div>
              )}
            </div>
          </div>
          <EventCalendar />
        </div>
      </section>
    </div>
  );
}
