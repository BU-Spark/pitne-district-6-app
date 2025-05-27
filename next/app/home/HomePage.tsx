import styles from './HomePage.module.css';
import Navbar from '../components/Navbar/Navbar';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            WELCOME TO <br />
            DISTRICT 6
          </h1>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className={styles.dateSection}>
        <h2>Upcoming Events</h2>
      </section>
    </div>
  );
}
