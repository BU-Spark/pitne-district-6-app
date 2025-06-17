'use client';

import React from 'react';
import styles from './NewsletterArchive.module.css';
import { FiExternalLink } from 'react-icons/fi';
import { FaBuilding, FaFacebook, FaNewspaper, FaRoad } from 'react-icons/fa';
import { FiAlertCircle, FiMapPin } from 'react-icons/fi';
import { MdEmail } from 'react-icons/md';

const months = [
  { name: 'January', eng: true, esp: false },
  { name: 'February', eng: true, esp: false },
  { name: 'March', eng: true, esp: false },
  { name: 'April', eng: true, esp: true },
  { name: 'May', eng: true, esp: false },
  { name: 'June', eng: true, esp: true },
  { name: 'July', eng: true, esp: false },
  { name: 'August', eng: true, esp: false },
  { name: 'September', eng: true, esp: false },
  { name: 'October', eng: true, esp: false },
  { name: 'November', eng: true, esp: false },
  { name: 'December', eng: true, esp: false },
];
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

const NewsletterArchive = () => {
  return (
    <section className={styles.newsSection}>
      <div className={styles.keyLinksContainer}>
        <div className={styles.keyLinksTitleRow}>
          <h3>Key Links</h3>
          <div className={styles.keyLinksLine}></div>
        </div>

        <div className={styles.keyLinksGrid}>
          {keyLinks.map(({ href, icon, label }) => (
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
              <ul>
                {months.map(({ name, eng, esp }) => (
                  <li key={name} className={styles.archiveItem}>
                    <span className={styles.monthLabel}>{name} 2024</span>
                    <div className={styles.buttonGroup}>
                      <button className={styles.archiveButton} disabled={!eng}>
                        English
                      </button>
                      <button className={`${styles.archiveButton} ${!esp ? styles.empty : ''}`} disabled={!esp}>
                        {esp ? 'Spanish' : ''}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.pdfViewer}>
              <button
                className={styles.openNewTabButton}
                onClick={() =>
                  window.open(
                    'https://myemail.constantcontact.com/District-6-Newsletter.html?soid=1140955148580&aid=NPruGTxG870',
                    '_blank',
                    'noopener noreferrer'
                  )
                }
              >
                <FiExternalLink size={25} />
              </button>
              <iframe
                src="https://myemail.constantcontact.com/District-6-Newsletter.html?soid=1140955148580&aid=NPruGTxG870"
                title="Newsletter PDF"
                className={styles.pdfIframe}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterArchive;
