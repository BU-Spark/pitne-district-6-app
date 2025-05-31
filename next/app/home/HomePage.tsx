import styles from './HomePage.module.css';
import Navbar from '../components/Navbar/Navbar';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.overlay}>
          <div className={styles.heroText}>
            <span className={styles.welcome}>Welcome to</span>
            <span className={styles.district}>DISTRICT 6</span>
          </div>
          <div className={styles.photoCredit}>Photo by Korri Crowley (2025)</div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className={styles.dateSection}>
        <h2>Upcoming Events</h2>
      </section>
    </div>
  );
}
