'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar/Navbar';
import { fetchCouncilMembers, CouncilMember } from '../utils/strapi.api';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCouncilMembers = async () => {
      try {
        setLoading(true);
        const members = await fetchCouncilMembers();
        setCouncilMembers(members);
        setError(null);
      } catch (err) {
        console.error('Failed to load council members:', err);
        setError('Failed to load team members. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCouncilMembers();
  }, []);

  const getImageUrl = (member: CouncilMember) => {
    if (member.Image?.url) {
      // Handle both relative and absolute URLs
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      return member.Image.url.startsWith('http') ? member.Image.url : `${baseUrl}${member.Image.url}`;
    }
    return null; // No image available
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* About District 6 Section */}
        <section className={styles.aboutSection}>
          <div className={styles.aboutContent}>
            <h1 className={styles.mainTitle}>About District 6</h1>
            <div className={styles.aboutText}>
              <p>
                District 6 encompasses vibrant neighborhoods including South End, Back Bay, Beacon Hill, North End, West
                End, and Downtown. Our district is home to a diverse community of residents, businesses, and visitors
                who make Boston a world-class city.
              </p>
              <p>
                We are committed to creating a more equitable, sustainable, and prosperous Boston for all. Our work
                focuses on affordable housing, economic development, public safety, transportation, education, and
                environmental sustainability.
              </p>
              <p>
                District 6 is not just the heart of Boston&apos;s downtown core – it&apos;s a thriving residential
                community where families live, work, and play. From the historic brownstones of Back Bay to the bustling
                markets of the North End, our district celebrates both our rich history and our bright future.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className={styles.teamSection}>
          <div className={styles.teamContent}>
            <h2 className={styles.sectionTitle}>Meet the Team</h2>
            <p className={styles.sectionDescription}>
              Our dedicated team works tirelessly to serve the residents and businesses of District 6. Get to know the
              people who are committed to making our community stronger every day.
            </p>

            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading team members...</p>
              </div>
            ) : error ? (
              <div className={styles.errorContainer}>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className={styles.retryButton}>
                  Try Again
                </button>
              </div>
            ) : (
              <div className={styles.teamGrid}>
                {councilMembers.map((member) => (
                  <div key={member.id} className={styles.memberCard}>
                    <div className={styles.memberImage}>
                      {getImageUrl(member) ? (
                        <Image
                          src={getImageUrl(member)!}
                          alt={member.Name}
                          width={200}
                          height={200}
                          className={styles.avatar}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>👤</div>
                      )}
                    </div>
                    <div className={styles.memberInfo}>
                      <h3 className={styles.memberName}>{member.Name}</h3>
                      <p className={styles.memberRole}>{member.Role}</p>
                      {member.Position && <p className={styles.memberPosition}>{member.Position}</p>}
                      {member.Description && <p className={styles.memberDescription}>{member.Description}</p>}
                      <div className={styles.memberContact}>
                        {member.Email && (
                          <a href={`mailto:${member.Email}`} className={styles.contactLink}>
                            📧 {member.Email}
                          </a>
                        )}
                        {member.Phone && (
                          <a href={`tel:${member.Phone}`} className={styles.contactLink}>
                            📞 {member.Phone}
                          </a>
                        )}
                        {member.Wesbite && (
                          <a
                            href={member.Wesbite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactLink}
                          >
                            🌐 Website
                          </a>
                        )}
                        {member.Location && <p className={styles.memberLocation}>📍 {member.Location}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
