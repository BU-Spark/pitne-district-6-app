'use client';

import styles from './Navbar.module.css';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import Image from 'next/image';
import { fetchCouncilor, CouncilMember, fetchLink } from '../../utils';

export default function Navbar({ setLanguage }: { setLanguage?: (lang: string) => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [councilor, setCouncilor] = useState<CouncilMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [councilorLink, setCouncilorLink] = useState<string | null>(null);

  useEffect(() => {
    const loadLink = async () => {
      try {
        const url = await fetchLink('Councilor D6 City of Boston Link');
        setCouncilorLink(url);
      } catch (error) {
        console.error('Failed to load councilor link:', error);
      }
    };

    loadLink();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadCouncilor = async () => {
      try {
        const councilorData = await fetchCouncilor();
        setCouncilor(councilorData);
      } catch (error) {
        console.error('Failed to load councilor data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCouncilor();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsAnimatingOut(false);
    }, 300);
  };

  const getCouncilorDisplay = () => {
    if (loading) return 'Loading...';
    if (councilor) return `Councilor ${councilor.Name}`;
    return 'Councilor Benjamin Weber';
  };

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
        {/* Mobile Only */}
        <div className={styles.mobileOnly}>
          <div className={styles.mobileHeaderLeft}>
            <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className={styles.cityName}>
              DISTRICT 6
            </Link>
          </div>
          <div className={styles.mobileHeaderRight}>
            <LanguageSelector setLanguage={setLanguage} />
          </div>
        </div>

        {/* Boston Logo Centered */}
        <div className={`${styles.bostonLogo} ${isScrolled ? styles.bostonLogoScrolled : ''}`}>
          <Image src="/icons/d6_logo.png" alt="D6 Logo" width={110} height={110} priority />
        </div>

        {/* Desktop Only */}
        <div className={styles.desktopOnly}>
          <div className={styles.logoSection}>
            <Link href="/" className={styles.cityName}>
              DISTRICT 6
            </Link>
            <span className={styles.divider}></span>
            <a
              href={councilorLink || 'https://www.boston.gov/departments/city-council/benjamin-j-weber'}
              className={styles.mayor}
              target="_blank"
              rel="noopener noreferrer"
            >
              {getCouncilorDisplay()}
            </a>

            <span className={styles.divider}></span>
            <LanguageSelector setLanguage={setLanguage} />
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Link href="/resources">RESOURCES</Link>
          <Link href="/locations">LOCATIONS</Link>
          <Link href="/events">EVENTS</Link>
          <Link href="/about">ABOUT</Link>
          {/* <span className={styles.searchIcon}>
            <Search size={18} strokeWidth={4} />
          </span> */}
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={closeMobileMenu}>
          <div
            className={`${styles.mobileMenu} ${isAnimatingOut ? styles.slideOut : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.mobileMenuLogo}>
              <Image src="/icons/d6_logo.png" alt="D6 Logo" width={180} height={180} priority />
            </div>
            <nav className={styles.mobileNav}>
              <Link href="/" onClick={closeMobileMenu}>
                HOME
              </Link>
              <Link href="/resources" onClick={closeMobileMenu}>
                RESOURCES
              </Link>
              <Link href="/locations" onClick={closeMobileMenu}>
                LOCATIONS
              </Link>
              <Link href="/events" onClick={closeMobileMenu}>
                EVENTS
              </Link>
              <Link href="/about" onClick={closeMobileMenu}>
                ABOUT
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
