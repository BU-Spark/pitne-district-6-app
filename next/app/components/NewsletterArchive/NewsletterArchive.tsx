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

const NewsletterArchive = () => {
  return (
    <section className={styles.newsSection}>
      <div className={styles.newsWrapper}>
        {/* Left 3/4: Archive + PDF viewer (switched order) */}
        <div className={styles.leftCard}>
          <div className={styles.viewerAndArchive}>
            {/* Archive List first */}
            <div className={styles.archiveList}>
              <h3>Newsletter Archive</h3>
              <ul>
                {months.map(({ name, eng, esp }) => (
                  <li key={name} className={styles.archiveItem}>
                    <span className={styles.monthLabel}>{name} 2024</span>
                    <div className={styles.buttonGroup}>
                      {eng ? (
                        <button
                          className={styles.archiveButton}
                          role="button"
                          aria-label={`${name} 2024 newsletter in English`}
                        >
                          English
                        </button>
                      ) : (
                        <button className={styles.archiveButton} disabled style={{ visibility: 'hidden' }}>
                          English
                        </button>
                      )}
                      {esp ? (
                        <button
                          className={styles.archiveButton}
                          role="button"
                          aria-label={`${name} 2024 newsletter in Spanish`}
                        >
                          Spanish
                        </button>
                      ) : (
                        <button className={styles.archiveButton} disabled style={{ visibility: 'hidden' }}>
                          Spanish
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* PDF Viewer below */}
            <div className={styles.pdfViewer}>
              <button
                className={styles.openNewTabButton}
                aria-label="Open newsletter in new tab"
                onClick={() =>
                  window.open(
                    'https://myemail.constantcontact.com/District-6-Newsletter.html?soid=1140955148580&aid=NPruGTxG870',
                    '_blank',
                    'noopener noreferrer'
                  )
                }
              >
                <FiExternalLink size={18} />
              </button>
              <iframe
                src="https://myemail.constantcontact.com/District-6-Newsletter.html?soid=1140955148580&aid=NPruGTxG870"
                title="Newsletter PDF"
                className={styles.pdfIframe}
              />
            </div>
          </div>
        </div>

        {/* Right 1/4: Scrollable related links */}
        <div className={styles.rightCard}>
          <h3>Key Links</h3>
          <div className={styles.scrollArea}>
            <ul>
              {/* All Newsletters */}
              <li>
                <a href="https://newsletters.boston.gov/subscribe" aria-label="City of Boston Newsletters">
                  <MdEmail size={16} /> City of Boston Newsletters
                </a>
              </li>
              <li>
                <a
                  href="https://www.boston.gov/departments/city-council#newsletter"
                  aria-label="Boston City Council Newsletter"
                >
                  <MdEmail size={16} /> Boston City Council Newsletter
                </a>
              </li>
              <li>
                <a
                  href="https://newsletters.boston.gov/subscribe?category=My%20Neighborhood"
                  aria-label="ONS JP & West Roxbury Newsletters"
                >
                  <MdEmail size={16} /> ONS JP & West Roxbury Newsletters
                </a>
              </li>

              {/* Alerts */}
              <li>
                <a
                  href="https://www.boston.gov/departments/emergency-management/city-boston-alerts-and-notifications"
                  aria-label="City of Boston Alerts"
                >
                  <FiAlertCircle size={16} /> City of Boston Alerts
                </a>
              </li>

              {/* News */}
              <li>
                <a href="https://jamaicaplainnews.com/" aria-label="Jamaica Plain News">
                  <FaNewspaper size={16} /> Jamaica Plain News
                </a>
              </li>
              <li>
                <a href="https://jamaicaplaingazette.com/" aria-label="Jamaica Plain Gazette">
                  <FaNewspaper size={16} /> Jamaica Plain Gazette
                </a>
              </li>
              <li>
                <a
                  href="https://bulletinnewspapers.weebly.com/"
                  aria-label="The Bulletin newspaper for WR and Roslindale"
                >
                  <FaNewspaper size={16} /> The Bulletin – WR/Roslindale
                </a>
              </li>

              {/* Facebook groups */}
              <li>
                <a href="https://www.facebook.com/groups/jamaicaplainma/" aria-label="Jamaica Plain Facebook group">
                  <FaFacebook size={16} /> Jamaica Plain Facebook Page
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/groups/639547626202086/"
                  aria-label="West Roxbury Connect Facebook group"
                >
                  <FaFacebook size={16} /> West Roxbury Connect
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/groups/2553951258022030/"
                  aria-label="West Roxbury Civic Association Facebook group"
                >
                  <FaFacebook size={16} /> West Roxbury Association
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/groups/2678131715738649/"
                  aria-label="Parkway Area Respectful Discourse Facebook group"
                >
                  <FaFacebook size={16} /> Parkway Respectful Discourse
                </a>
              </li>

              {/* Housing/Development */}
              <li>
                <a
                  href="https://www.bostonplans.org/neighborhoods/jamaica-plain/at-a-glance"
                  aria-label="Planning alerts for Jamaica Plain"
                >
                  <FaBuilding size={16} /> JP Housing Developments
                </a>
              </li>
              <li>
                <a
                  href="https://www.bostonplans.org/neighborhoods/west-roxbury/at-a-glance"
                  aria-label="Planning alerts for West Roxbury"
                >
                  <FaBuilding size={16} /> West Roxbury Housing Developments
                </a>
              </li>

              {/* Street & Traffic */}
              <li>
                <a
                  href="https://www.boston.gov/departments/public-works/roadway-resurfacing-boston"
                  aria-label="Roadway resurfacing plans"
                >
                  <FaRoad size={16} /> Street Resurfacing List
                </a>
              </li>
              <li>
                <a
                  href="https://www.boston.gov/departments/transportation/making-neighborhood-streets-safer"
                  aria-label="Speed hump eligibility map"
                >
                  <FiMapPin size={16} /> Speed Hump Eligibility Map
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterArchive;
