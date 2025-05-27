import styles from '../../home/HomePage.module.css';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <span className={styles.cityName}>District 6</span>
        <span className={styles.mayor}>| Counselor Benjamin Weber</span>
      </div>
      <nav className={styles.nav}>
        <a href="#">Resources</a>
        <a href="#">Events</a>
        <a href="#">Locations</a>
        <a href="#">About Us</a>
        <span className={styles.searchIcon}>🔍</span>
      </nav>
    </header>
  );
}
