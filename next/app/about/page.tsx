'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar/Navbar';
import { fetchCouncilMembers, CouncilMember } from '../utils/strapi.api';
import styles from './AboutPage.module.css';
import { FaInstagram } from 'react-icons/fa';

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
      const baseUrl = 'http://localhost:1337';
      const imageUrl = member.Image.url;

      const normalizedImageUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;

      const url = `${baseUrl}/${normalizedImageUrl}`;

      console.log('Image URL for', member.Name, ':', url);
      return url;
    }
    return null;
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* About District 6 Section */}
        <section className={styles.aboutSection}>
          <div className={styles.aboutContent}>
            <h1 className={styles.mainTitle}>About District 6</h1>
            {/* Link cards */}
            <div className={styles.linkButtons}>
              <a
                href="https://www.bostonplans.org/getattachment/ebd89ac2-3046-4ebd-879b-0cf2b67c8ee8/"
                target="_blank"
                rel="noopener noreferrer"
              >
                🗺️ <strong>City Council District 6 Map</strong>
                <br />
              </a>
              <a
                href="https://boston.maps.arcgis.com/apps/webappviewer/index.html?id=72a95777f7e842eaae3671c0d67acce0&find=129668"
                target="_blank"
                rel="noopener noreferrer"
              >
                🧭 <strong>Wards & Precincts Interactive Map</strong>
              </a>
            </div>

            <div className={styles.aboutText}>
              <p>
                District 6 is comprised of Jamaica Plain, West Roxbury, Egleston Square in Roxbury, Back of the Hill,
                and one Roslindale precinct (which includes the Arnold Arboretum). Jamaica Plain has the largest tree
                canopy, including the Arnold Arboretum, Jamaica Pond, and Olmsted Park. Established in the 1630s within
                the Town of Roxbury, the name Jamaica Plain is said to be derived from{' '}
                <a
                  href="https://www.jphs.org/jp-history/2005/4/10/how-jamaica-plain-got-its-name.html#gsc.tab=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  title=" Rev. John Eliot’s 1689 deed"
                >
                  Rev. John Eliot’s 1689 deed
                </a>
                . Today, Jamaica Plain is home to around 80,000 residents, including about 8,000 Dominicans. In 2018,
                Hyde Square and Jackson Square were named{' '}
                <a
                  href="https://www.boston.gov/departments/arts-and-culture/latin-quarter-cultural-district"
                  target="_blank"
                  rel="noopener noreferrer"
                  title=" Boston’s Latin Quarter Cultural District"
                >
                  Boston’s Latin Quarter Cultural District
                </a>{' '}
                (
                <a
                  href="https://www.wbur.org/news/2018/02/28/boston-latin-quarter"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WBUR coverage: Boston's Latin Quarter designation"
                >
                  see news coverage
                </a>
                ). JP also has a vibrant LGBTQIA+ population—one of the highest in Boston (13.9% of its population as of
                2017). (
                <a
                  href="https://www.wbur.org/news/2020/02/26/boston-neighborhood-field-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WBUR’s Field Guide to Boston"
                >
                  WBUR’s Field Guide to Boston
                </a>
                ,{' '}
                <a
                  href="https://www.boston.gov/sites/default/files/embed/file/2017-12/bphc_demographics_data_brief.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Boston Public Health Commission Demographics Data Brief (PDF)"
                >
                  BPHC Demographics Data Brief
                </a>
                )
              </p>

              <p>
                West Roxbury was historically a favored neighborhood for Irish-American families and was comprised
                mostly of affordable single-family homes. In 1851, West Roxbury seceded from Roxbury but was
                incorporated into Boston in 1868. Today, Centre Street is home to more diverse neighbors and businesses,
                making the area more attractive to young families. West Roxbury also has the highest concentration of
                senior citizens in Boston—18.2% as of 2024. (
                <a
                  href="https://www.bostonplans.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="City of Boston Planning Department"
                >
                  City of Boston Planning Department
                </a>
                ,{' '}
                <a
                  href="https://www.wbur.org/news/2020/02/26/boston-neighborhood-field-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WBUR’s Field Guide to Boston"
                >
                  WBUR’s Field Guide to Boston
                </a>
                )
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className={styles.teamSection}>
          <div className={styles.teamContent}>
            <h2 className={styles.sectionTitle}>
              Meet the Team{' '}
              <a
                href="https://www.instagram.com/ben4district6/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={styles.instagramIcon}
              >
                <FaInstagram />
              </a>
            </h2>

            {councilMembers
              .filter((member) => member.Role.toLowerCase() === 'councilor')
              .map((member) => (
                <div key={member.id} className={styles.wideMemberCard}>
                  <div className={styles.wideMemberImage}>
                    {getImageUrl(member) ? (
                      <Image
                        src={getImageUrl(member)!}
                        alt={member.Name}
                        width={300}
                        height={300}
                        className={styles.wideAvatar}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>👤</div>
                    )}
                  </div>
                  <div className={styles.wideMemberInfo}>
                    <h3 className={styles.memberName}>{member.Name}</h3>
                    <p className={styles.memberRole}>{member.Role}</p>
                    {member.Position && <p className={styles.memberPosition}>{member.Position}</p>}
                    {member.Description && <p className={styles.memberDescription}>{member.Description}</p>}
                  </div>
                </div>
              ))}

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
                {councilMembers
                  .filter((member) => member.Role.toLowerCase() !== 'councilor')
                  .map((member) => (
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
