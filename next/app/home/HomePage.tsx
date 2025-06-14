'use client';
import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import Image from 'next/image';
import Navbar from '../components/Navbar/Navbar';
import SubscribeFooter from '../components/SubscribeFooter/SubscribeFooter';
import Masonry from 'react-masonry-css';
import { fetchFlyers, Flyer } from '../utils/strapi.api';

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  640: 2,
  480: 1,
};

const HomePage = () => {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const loadFlyers = async () => {
      const fetched = await fetchFlyers();
      setFlyers(fetched);
    };
    loadFlyers();
  }, []);

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.overlay}>
            <div className={styles.heroText}>
              <span className={styles.welcome}>Welcome to</span>
              <span className={styles.district}>DISTRICT 6</span>
            </div>
            <div className={styles.photoCredit}>Photo by Korri Crowley (2025)</div>
          </div>
        </section>

        <section className={styles.dateSection}>
          <h2>Upcoming Events</h2>
          <div className={styles.masonryWrapper}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={styles.myMasonryGrid}
              columnClassName={styles.myMasonryGridColumn}
            >
              {flyers.map((flyer) => (
                <div key={flyer.id} className={styles.photoCard}>
                  {flyer.Image?.url && (
                    <Image
                      src={
                        flyer.Image.url.startsWith('http')
                          ? flyer.Image.url
                          : `${process.env.NEXT_PUBLIC_STRAPI_URL}${flyer.Image.url}`
                      }
                      alt={flyer.Title}
                      width={400}
                      height={400}
                      className={`${styles.photo} ${loadedImages[flyer.id] ? styles.loaded : ''}`}
                      onLoad={() => handleImageLoad(flyer.id)}
                      style={{ width: '100%', height: 'auto' }}
                      unoptimized
                    />
                  )}
                  <div className={styles.caption}>{flyer.Title}</div>
                </div>
              ))}
            </Masonry>
          </div>
        </section>

        <SubscribeFooter subscribeUrl="https://docs.google.com/forms/d/e/1FAIpQLSddhuc44fUNSUSHSgdvp002jbUbr-svGOCnzocWIXNRqvkrnw/viewform" />
      </div>
    </>
  );
};

export default HomePage;
