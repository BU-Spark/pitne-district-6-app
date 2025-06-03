import React, { useEffect, useState } from 'react';
import './GoogleTranslate.css';
import { defaultStyle } from './googleTranslateStyling';

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

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

const GoogleTranslate: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState('en');
  const [isTranslateReady, setIsTranslateReady] = useState(false);

  // Function to hide the Google Translate banner iframe
  function hideGoogleTranslateBanner() {
    const intervalId = setInterval(() => {
      const bannerFrame = document.querySelector<HTMLIFrameElement>(
        '#goog-gt-banner-frame, iframe.goog-te-banner-frame'
      );
      if (bannerFrame) {
        bannerFrame.style.display = 'none';
        clearInterval(intervalId);
      }
    }, 300);
  }

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      const container = document.getElementById('google_translate_element');
      if (!container) {
        console.error('google_translate_element container not found');
        return;
      }

      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: languages.map((l) => l.code).join(','),
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );

        setTimeout(() => {
          setIsTranslateReady(true);

          // Apply your styling function here:
          defaultStyle(true, '', 'Language', '', '#FFFFFF', '', '', '14px');

          // Hide the annoying Google Translate banner
          hideGoogleTranslateBanner();
        }, 1000);
      } else {
        console.error('Google Translate library not available on window');
      }
    };

    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => console.error('Failed to load Google Translate script');
      document.body.appendChild(script);
    }

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    if (!isTranslateReady) {
      console.warn('Translate widget not ready yet. Please wait...');
      return;
    }

    const tryChange = (attempt = 0) => {
      const frame = document.querySelector('iframe.goog-te-menu-frame');
      if (!frame) {
        if (attempt < 10) {
          setTimeout(() => tryChange(attempt + 1), 300);
        } else {
          console.error('Google Translate iframe not found after multiple attempts');
        }
        return;
      }

      const innerDoc =
        (frame as HTMLIFrameElement).contentDocument || (frame as HTMLIFrameElement).contentWindow?.document;
      if (!innerDoc) {
        if (attempt < 10) {
          setTimeout(() => tryChange(attempt + 1), 300);
        } else {
          console.error('Cannot access Google Translate iframe document');
        }
        return;
      }

      const langLinks = innerDoc.querySelectorAll<HTMLAnchorElement>('a.goog-te-menu2-item');
      for (const link of langLinks) {
        if (link.href.includes(`?hl=${langCode}`)) {
          link.click();
          setSelectedLang(langCode);
          return;
        }
      }

      if (attempt < 10) {
        setTimeout(() => tryChange(attempt + 1), 300);
      } else {
        console.error(`Language link for code ${langCode} not found inside iframe.`);
      }
    };

    tryChange();
  };

  return (
    <div className="custom-google-translate">
      {/* Show the default Google widget normally */}
      <div id="google_translate_element" />

      {/* Hidden language selector dropdown */}
      <select
        value={selectedLang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="custom-translate-select"
        aria-label="Select language"
        style={{ display: 'none' }}
      >
        {languages.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GoogleTranslate;
