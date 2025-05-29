'use client';

import styles from '../../home/HomePage.module.css';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
        {/* Desktop Layout */}
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

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link href="/resources">RESOURCES</Link>
          <Link href="/events">EVENTS</Link>
          <Link href="/map">LOCATIONS</Link>
          <Link href="/about">ABOUT US</Link>
          <span className={styles.searchIcon}>
            <Search size={18} strokeWidth={4} />
          </span>
        </nav>

        {/* Mobile Hamburger Button */}
        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={closeMobileMenu}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            {/* Boston Logo at Top */}
            <div className={styles.mobileMenuLogo}>
              <Image src="/icons/boston_logo.png" alt="City of Boston Logo" width={120} height={120} priority />
            </div>

            {/* Mobile Navigation Links */}
            <nav className={styles.mobileNav}>
              <Link href="/" onClick={closeMobileMenu}>
                HOME
              </Link>
              <Link href="/resources" onClick={closeMobileMenu}>
                RESOURCES
              </Link>
              <Link href="/events" onClick={closeMobileMenu}>
                EVENTS
              </Link>
              <Link href="/map" onClick={closeMobileMenu}>
                LOCATIONS
              </Link>
              <Link href="/about" onClick={closeMobileMenu}>
                ABOUT US
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
