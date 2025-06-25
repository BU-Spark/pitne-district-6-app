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
        document.cookie = 'googtrans=/en/es; path=/';
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

    setCurrentLanguage(langCode);
    localStorage.setItem('selected-language', langCode);

    if (langCode === 'es') {
      // Set Google Translate cookie for Spanish
      document.cookie = 'googtrans=/en/es; path=/';
      window.location.reload();
    } else {
      // Reset to English
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.location.reload();
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
