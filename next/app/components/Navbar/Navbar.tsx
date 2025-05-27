import styles from '../../home/HomePage.module.css';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <span className={styles.cityName}>DISTRICT 6</span>
        <span className={styles.divider}></span>
        <span className={styles.mayor}> Counselor Benjamin Weber</span>
      </div>
      <nav className={styles.nav}>
        <a href="#">RESOURCES</a>
        <a href="#">EVENTS</a>
        <a href="#">LOCATIONS</a>
        <a href="#">ABOUT US</a>
        <span className={styles.searchIcon}>🔍</span>
      </nav>
    </header>
  );
}
