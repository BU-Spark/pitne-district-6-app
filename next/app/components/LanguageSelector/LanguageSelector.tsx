'use client';

import React, { useState, useEffect } from 'react';
import styles from './LanguageSelector.module.css';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

const fullLabels: Record<string, string> = {
  en: 'ENGLISH',
  es: 'Español',
};

const shortLabels: Record<string, string> = {
  en: 'ENG',
  es: 'ESP',
};

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google?: {
      translate: {
        TranslateElement: TranslateElementConstructor;
      };
    };
  }

  interface TranslateElementConstructor {
    new (
      options: {
        pageLanguage: string;
        includedLanguages?: string;
        layout: unknown;
        autoDisplay?: boolean;
      },
      containerId: string
    ): void;

    InlineLayout: {
      SIMPLE: unknown;
    };
  }
}

// Utility functions for robust cookie management
const setCookie = (name: string, value: string, options: { path?: string; domain?: string; expires?: string } = {}) => {
  let cookieString = `${name}=${value}`;

  if (options.path) cookieString += `; path=${options.path}`;
  if (options.domain) cookieString += `; domain=${options.domain}`;
  if (options.expires) cookieString += `; expires=${options.expires}`;

  document.cookie = cookieString;
};

const deleteCookie = (name: string, options: { path?: string; domain?: string } = {}) => {
  const expireDate = new Date(0).toUTCString();
  setCookie(name, '', { ...options, expires: expireDate });
};

const clearAllGoogleTranslateCookies = () => {
  // Clear various Google Translate cookies with different path/domain combinations
  const cookieNames = ['googtrans', 'goog-gt-sl', 'goog-gt-tl', 'googtrans=/auto/es', 'googtrans=/en/es'];
  const paths = ['/', ''];
  const domains = [window.location.hostname, `.${window.location.hostname}`, ''];

  cookieNames.forEach((cookieName) => {
    paths.forEach((path) => {
      domains.forEach((domain) => {
        deleteCookie(cookieName, { path, domain });
      });
    });
  });

  // Additional cleanup - clear all cookies that start with 'googtrans'
  document.cookie.split(';').forEach((cookie) => {
    const cookiePair = cookie.trim().split('=');
    if (cookiePair[0] && cookiePair[0].includes('googtrans')) {
      deleteCookie(cookiePair[0], { path: '/' });
      deleteCookie(cookiePair[0], { path: '', domain: window.location.hostname });
      deleteCookie(cookiePair[0], { path: '', domain: `.${window.location.hostname}` });
    }
  });
};

export default function LanguageSelector({ setLanguage }: { setLanguage?: (lang: string) => void }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateDeviceType = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  // Initialize Google Translate
  useEffect(() => {
    if (isInitialized) return;

    // Create hidden Google Translate element
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.visibility = 'hidden';
    document.body.appendChild(container);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,es',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );

        // Hide Google Translate UI elements
        setTimeout(() => {
          const style = document.createElement('style');
          style.textContent = `
            .goog-te-banner-frame,
            .goog-te-menu-frame,
            #goog-gt-tt,
            .goog-te-ftab-float,
            .goog-te-balloon-frame {
              display: none !important;
            }
            .goog-text-highlight {
              background: none !important;
              box-shadow: none !important;
            }
          `;
          document.head.appendChild(style);
        }, 1000);
      }
    };

    // Load Google Translate script
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      window.googleTranslateElementInit();
    }

    setIsInitialized(true);
  }, [isInitialized]);

  // Load saved language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('selected-language') || 'en';
    setCurrentLanguage(savedLang);

    // Apply saved language if it's Spanish
    if (savedLang === 'es') {
      setTimeout(() => {
        setCookie('googtrans', '/en/es', { path: '/' });
      }, 2000);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    if (langCode === currentLanguage) return;

    setCurrentLanguage(langCode);
    localStorage.setItem('selected-language', langCode);

    if (setLanguage) {
      setLanguage(langCode);
    }

    if (langCode === 'es') {
      // Set Google Translate cookie for Spanish with robust cookie setting
      setCookie('googtrans', '/en/es', { path: '/' });

      // For production environments, also try setting with domain
      if (window.location.hostname !== 'localhost') {
        setCookie('googtrans', '/en/es', { path: '/', domain: window.location.hostname });
      }

      setTimeout(() => window.location.reload(), 100);
    } else {
      // Enhanced reset to English with multiple fallback methods
      clearAllGoogleTranslateCookies();

      // Force set to English explicitly
      setCookie('googtrans', '/auto/en', { path: '/' });

      // Additional cleanup for production
      if (window.location.hostname !== 'localhost') {
        setCookie('googtrans', '/auto/en', { path: '/', domain: window.location.hostname });
        setCookie('googtrans', '/auto/en', { path: '/', domain: `.${window.location.hostname}` });
      }

      // Clear any remaining translation state
      setTimeout(() => {
        clearAllGoogleTranslateCookies();
        window.location.reload();
      }, 100);
    }
  };

  return (
    <div className={`${styles.languageSelector} notranslate`}>
      {languages.map((language) => (
        <button
          key={language.code}
          className={`${styles.languageButton} ${language.code === currentLanguage ? styles.active : ''} notranslate`}
          onClick={() => changeLanguage(language.code)}
          title={language.name}
        >
          <span className={`${styles.flag} notranslate`}>{language.flag}</span>
          <span className={`${styles.langCode} notranslate`}>
            {(isMobile ? shortLabels : fullLabels)[language.code].toUpperCase()}
          </span>
        </button>
      ))}
    </div>
  );
}
