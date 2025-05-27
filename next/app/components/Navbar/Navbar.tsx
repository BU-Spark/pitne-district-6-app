import styles from '../../home/HomePage.module.css';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <span className={styles.cityName}>DISTRICT 6</span>
        <span className={styles.divider}></span>
        <a
          href="https://www.boston.gov/departments/city-council/benjamin-j-weber"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mayor}
        >
          Councilor Benjamin Weber
        </a>
      </div>
      <nav className={styles.nav}>
        <Link href="/resources">RESOURCES</Link>
        <Link href="/events">EVENTS</Link>
        <Link href="/map">LOCATIONS</Link>
        <Link href="/about">ABOUT US</Link>
        <span className={styles.searchIcon}>🔍</span>
      </nav>
    </header>
  );
}
