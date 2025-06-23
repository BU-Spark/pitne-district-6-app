'use client';

import React, { useState, useEffect } from 'react';
import styles from './NewsletterArchive.module.css';
import { FiExternalLink } from 'react-icons/fi';
import { FaBuilding, FaFacebook, FaNewspaper, FaRoad } from 'react-icons/fa';
import { FiAlertCircle, FiMapPin } from 'react-icons/fi';
import { MdEmail } from 'react-icons/md';
import { fetchNewsletters, Newsletter } from '../../utils/strapi.api';

const keyLinks = [
  {
    href: 'https://newsletters.boston.gov/subscribe',
    icon: <MdEmail size={16} />,
    label: 'City of Boston Newsletters',
  },
  {
    href: 'https://www.facebook.com/groups/2553951258022030/',
    icon: <FaFacebook size={16} />,
    label: 'West Roxbury Association',
  },
  {
    href: 'https://www.bostonplans.org/neighborhoods/jamaica-plain/at-a-glance',
    icon: <FaBuilding size={16} />,
    label: 'JP Housing Developments',
  },
  {
    href: 'https://www.boston.gov/departments/city-council#newsletter',
    icon: <MdEmail size={16} />,
    label: 'Boston City Council Newsletter',
  },
  {
    href: 'https://www.facebook.com/groups/639547626202086/',
    icon: <FaFacebook size={16} />,
    label: 'West Roxbury Connect',
  },
  {
    href: 'https://www.bostonplans.org/neighborhoods/west-roxbury/at-a-glance',
    icon: <FaBuilding size={16} />,
    label: 'West Roxbury Housing Developments',
  },
  {
    href: 'https://newsletters.boston.gov/subscribe?category=My%20Neighborhood',
    icon: <MdEmail size={16} />,
    label: 'ONS JP & West Roxbury Newsletters',
  },
  {
    href: 'https://www.facebook.com/groups/jamaicaplainma/',
    icon: <FaFacebook size={16} />,
    label: 'Jamaica Plain Facebook Page',
  },
  {
    href: 'https://jamaicaplaingazette.com/',
    icon: <FaNewspaper size={16} />,
    label: 'Jamaica Plain Gazette',
  },
  {
    href: 'https://www.boston.gov/departments/emergency-management/city-boston-alerts-and-notifications',
    icon: <FiAlertCircle size={16} />,
    label: 'City of Boston Alerts',
  },
  {
    href: 'https://www.facebook.com/groups/2678131715738649/',
    icon: <FaFacebook size={16} />,
    label: 'Parkway Respectful Discourse',
  },
  {
    href: 'https://jamaicaplainnews.com/',
    icon: <FaNewspaper size={16} />,
    label: 'Jamaica Plain News',
  },
  {
    href: 'https://www.boston.gov/departments/public-works/roadway-resurfacing-boston',
    icon: <FaRoad size={16} />,
    label: 'Street Resurfacing List',
  },

  {
    href: 'https://www.boston.gov/departments/transportation/making-neighborhood-streets-safer',
    icon: <FiMapPin size={16} />,
    label: 'Speed Hump Eligibility Map',
  },

  {
    href: 'https://bulletinnewspapers.weebly.com/',
    icon: <FaNewspaper size={16} />,
    label: 'The Bulletin – WR/Roslindale',
  },
];

const keyLinksSortedByGroup = [
  {
    href: 'https://newsletters.boston.gov/subscribe',
    icon: <MdEmail size={16} />,
    label: 'City of Boston Newsletters',
    group: 'email',
  },
  {
    href: 'https://www.boston.gov/departments/city-council#newsletter',
    icon: <MdEmail size={16} />,
    label: 'Boston City Council Newsletter',
    group: 'email',
  },
  {
    href: 'https://newsletters.boston.gov/subscribe?category=My%20Neighborhood',
    icon: <MdEmail size={16} />,
    label: 'ONS JP & West Roxbury Newsletters',
    group: 'email',
  },
  {
    href: 'https://www.facebook.com/groups/2553951258022030/',
    icon: <FaFacebook size={16} />,
    label: 'West Roxbury Association',
    group: 'facebook',
  },
  {
    href: 'https://www.facebook.com/groups/639547626202086/',
    icon: <FaFacebook size={16} />,
    label: 'West Roxbury Connect',
    group: 'facebook',
  },
  {
    href: 'https://www.facebook.com/groups/jamaicaplainma/',
    icon: <FaFacebook size={16} />,
    label: 'Jamaica Plain Facebook Page',
    group: 'facebook',
  },
  {
    href: 'https://www.facebook.com/groups/2678131715738649/',
    icon: <FaFacebook size={16} />,
    label: 'Parkway Respectful Discourse',
    group: 'facebook',
  },
  {
    href: 'https://www.bostonplans.org/neighborhoods/jamaica-plain/at-a-glance',
    icon: <FaBuilding size={16} />,
    label: 'JP Housing Developments',
    group: 'building',
  },
  {
    href: 'https://www.bostonplans.org/neighborhoods/west-roxbury/at-a-glance',
    icon: <FaBuilding size={16} />,
    label: 'West Roxbury Housing Developments',
    group: 'building',
  },
  {
    href: 'https://jamaicaplaingazette.com/',
    icon: <FaNewspaper size={16} />,
    label: 'Jamaica Plain Gazette',
    group: 'newspaper',
  },
  {
    href: 'https://jamaicaplainnews.com/',
    icon: <FaNewspaper size={16} />,
    label: 'Jamaica Plain News',
    group: 'newspaper',
  },
  {
    href: 'https://bulletinnewspapers.weebly.com/',
    icon: <FaNewspaper size={16} />,
    label: 'The Bulletin – WR/Roslindale',
    group: 'newspaper',
  },
  {
    href: 'https://www.boston.gov/departments/emergency-management/city-boston-alerts-and-notifications',
    icon: <FiAlertCircle size={16} />,
    label: 'City of Boston Alerts',
    group: 'alert',
  },
  {
    href: 'https://www.boston.gov/departments/public-works/roadway-resurfacing-boston',
    icon: <FaRoad size={16} />,
    label: 'Street Resurfacing List',
    group: 'road',
  },
  {
    href: 'https://www.boston.gov/departments/transportation/making-neighborhood-streets-safer',
    icon: <FiMapPin size={16} />,
    label: 'Speed Hump Eligibility Map',
    group: 'map',
  },
];

const NewsletterArchive = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const loadNewsletters = async () => {
      try {
        const fetched = await fetchNewsletters();
        console.log('Fetched newsletters:', fetched);
        setNewsletters(fetched);

        // Set the first available PDF as selected by default
        if (fetched.length > 0) {
          const firstNewsletter = fetched[0];
          if (firstNewsletter.english_pdf && firstNewsletter.english_pdf.length > 0) {
            setSelectedPdf(firstNewsletter.english_pdf[0].url);
          } else if (firstNewsletter.spanish_pdf && firstNewsletter.spanish_pdf.length > 0) {
            setSelectedPdf(firstNewsletter.spanish_pdf[0].url);
          }
        }
      } catch (error) {
        console.error('Error loading newsletters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNewsletters();
  }, []);

  const handlePdfSelect = (pdfUrl: string) => {
    setSelectedPdf(pdfUrl);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className={styles.newsSection}>
      <div className={styles.keyLinksContainer}>
        <div className={styles.keyLinksTitleRow}>
          <h3>Key Links</h3>
          <div className={styles.keyLinksLine}></div>
        </div>

        <div className={styles.keyLinksGrid}>
          {(isMobile ? keyLinksSortedByGroup : keyLinks).map(({ href, icon, label }) => (
            <a key={label} href={href} className={styles.keyLink} aria-label={label}>
              {icon} {label}
            </a>
          ))}
        </div>
      </div>

      <div className={styles.newsWrapper}>
        <div className={styles.leftCard}>
          <div className={styles.viewerAndArchive}>
            <div className={styles.archiveList}>
              <h3>Newsletter Archive</h3>
              {isLoading ? (
                <p>Loading newsletters...</p>
              ) : (
                <ul>
                  {newsletters.map((newsletter) => {
                    const hasEnglish = newsletter.english_pdf && newsletter.english_pdf.length > 0;
                    const hasSpanish = newsletter.spanish_pdf && newsletter.spanish_pdf.length > 0;

                    return (
                      <li key={newsletter.id} className={styles.archiveItem}>
                        <span className={styles.monthLabel}>{newsletter.month_year}</span>
                        <div className={styles.buttonGroup}>
                          <button
                            className={styles.archiveButton}
                            disabled={!hasEnglish}
                            onClick={() => hasEnglish && handlePdfSelect(newsletter.english_pdf![0].url)}
                          >
                            English
                          </button>
                          <button
                            className={`${styles.archiveButton} ${!hasSpanish ? styles.empty : ''}`}
                            disabled={!hasSpanish}
                            onClick={() => hasSpanish && handlePdfSelect(newsletter.spanish_pdf![0].url)}
                          >
                            {hasSpanish ? 'Spanish' : ''}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className={styles.pdfViewer}>
              {selectedPdf && (
                <button
                  className={styles.openNewTabButton}
                  onClick={() => window.open(selectedPdf, '_blank', 'noopener noreferrer')}
                >
                  <FiExternalLink size={25} />
                </button>
              )}
              {selectedPdf ? (
                <iframe src={selectedPdf} title="Newsletter PDF" className={styles.pdfIframe} />
              ) : (
                <div className={styles.pdfPlaceholder}>
                  <p>Select a newsletter to view</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterArchive;
