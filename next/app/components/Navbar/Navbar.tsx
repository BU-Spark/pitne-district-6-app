'use client';

import styles from '../../home/HomePage.module.css';
import Link from 'next/link';
import { Search, Menu, X, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchCouncilor, CouncilMember } from '../../utils';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: TranslateElementConstructor;
      };
    };
  }

  interface TranslateElementConstructor {
    new (
      options: {
        pageLanguage: string;
        layout: unknown;
      },
      containerId: string
    ): void;

    InlineLayout: {
      SIMPLE: unknown;
    };
  }
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [councilor, setCouncilor] = useState<CouncilMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [translateLoaded, setTranslateLoaded] = useState(false);

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

  useEffect(() => {
    // Check if Google Translate is already loaded
    if (document.querySelector('script[src*="translate.google.com"]')) {
      return;
    }

    const addGoogleTranslateScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;

      script.onload = () => {
        setTranslateLoaded(true);
      };

      document.body.appendChild(script);
    };

    // Define the callback globally
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );

        // Additional cleanup after widget loads
        setTimeout(() => {
          // Remove Google's top banner if it appears
          const banner = document.querySelector('.goog-te-banner-frame');
          if (banner) {
            banner.remove();
          }

          // Add custom class for better styling control
          const widget = document.querySelector('#google_translate_element .goog-te-gadget');
          if (widget) {
            widget.classList.add('custom-translate-widget');
          }
        }, 1000);
      }
    };

    addGoogleTranslateScript();

    return () => {
      // Remove the global callback when component unmounts
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit = (() => {}) as () => void;
      }
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getCouncilorDisplay = () => {
    if (loading) return 'Loading...';
    if (councilor) return `Councilor ${councilor.Name}`;
    return 'Councilor Benjamin Weber'; // Fallback
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
            {getCouncilorDisplay()}
          </a>
        </div>

        {/* Boston Logo in Center */}
        <div className={`${styles.bostonLogo} ${isScrolled ? styles.bostonLogoScrolled : ''}`}>
          <Image src="/icons/boston_city_logo.png" alt="City of Boston Logo" width={110} height={110} priority />
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link href="/resources">RESOURCES</Link>
          <Link href="/events">EVENTS</Link>
          <Link href="/locations">LOCATIONS</Link>
          <Link href="/about">ABOUT US</Link>
          <span className={styles.searchIcon}>
            <Search size={18} strokeWidth={4} />
          </span>

          {/* Enhanced Translate Widget Container */}
          <div className={`${styles.translateWidget} ${styles.translateWidgetCompact}`}>
            {!translateLoaded && (
              <div className={styles.translatePlaceholder}>
                <Globe size={16} />
                <span>Translate</span>
              </div>
            )}
            <div id="google_translate_element"></div>
          </div>
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
              <Image src="/icons/boston_city_logo.png" alt="City of Boston Logo" width={120} height={120} priority />
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
              <Link href="/locations" onClick={closeMobileMenu}>
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
