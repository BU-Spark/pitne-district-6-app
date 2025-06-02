'use client';

import styles from './EventsPage.module.css';
import Navbar from '../components/Navbar/Navbar';
import EventCalendar from '../components/EventCalendar/EventCalendar';

export default function EventsPage() {
  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.calendarSection}>
        <div className={styles.calendarContainer}>
          <h2 className={styles.sectionTitle}>Event Calendar</h2>
          <p className={styles.sectionDescription}>
            View all upcoming community events, meetings, and activities in District 6.
          </p>
          <EventCalendar />
        </div>
      </section>
    </div>
  );
}
