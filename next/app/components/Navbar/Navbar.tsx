'use client';

import styles from '../../home/HomePage.module.css';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
      <div className={styles.logoSection}>
        <Link href="/" className={styles.cityName}>
          DISTRICT 6
        </Link>
        <span className={styles.divider}></span>
        <a href="https://www.boston.gov/departments/city-council/benjamin-j-weber" className={styles.mayor}>
          Councilor Benjamin Weber
        </a>
      </div>

      {/* Boston Logo in Center */}
      <div className={`${styles.bostonLogo} ${isScrolled ? styles.bostonLogoScrolled : ''}`}>
        <Image src="/icons/boston_logo.png" alt="City of Boston Logo" width={110} height={110} priority />
      </div>

      <nav className={styles.nav}>
        <Link href="/resources">RESOURCES</Link>
        <Link href="/events">EVENTS</Link>
        <Link href="/map">LOCATIONS</Link>
        <Link href="/about">ABOUT US</Link>
        <span className={styles.searchIcon}>
          <Search size={18} strokeWidth={4} />
        </span>
      </nav>
    </header>
  );
}
