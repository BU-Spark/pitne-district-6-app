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

// Mockup photos data for development/testing without backend
const photos = [
  { id: 1, title: 'Clean-up', image: 'https://picsum.photos/400/300?random=1' },
  { id: 2, title: 'Town Hall', image: 'https://picsum.photos/400/500?random=2' },
  { id: 3, title: 'Concert', image: 'https://picsum.photos/400/350?random=3' },
  { id: 4, title: 'Market', image: 'https://picsum.photos/400/600?random=4' },
  { id: 5, title: 'Art Fair', image: 'https://picsum.photos/400/450?random=5' },
  { id: 6, title: 'Yoga', image: 'https://picsum.photos/400/400?random=6' },
  { id: 7, title: 'Community Garden', image: 'https://picsum.photos/400/420?random=7' },
  { id: 8, title: 'Book Club', image: 'https://picsum.photos/400/360?random=8' },
  { id: 9, title: 'Film Screening', image: 'https://picsum.photos/400/480?random=9' },
  { id: 10, title: 'Festival', image: 'https://picsum.photos/400/390?random=10' },
  { id: 11, title: 'Workshop', image: 'https://picsum.photos/400/410?random=11' },
  { id: 12, title: 'Food Drive', image: 'https://picsum.photos/400/430?random=12' },
];

const HomePage = () => {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [loadedImages, setLoadedImages] = useState<{ [key: number]: boolean }>({});

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const openZoom = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsZoomed(true);
  };

  const closeZoom = () => {
    setIsZoomed(false);
  };

  const showPrev = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev! + photos.length - 1) % photos.length);
    }
  };

  const showNext = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev! + 1) % photos.length);
    }
  };

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
          {/* Mockup Masonry grid with photos */}
          <div className={styles.masonryWrapper}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={styles.myMasonryGrid}
              columnClassName={styles.myMasonryGridColumn}
            >
              {/* Render mockup photos inside Masonry */}
              {photos.map(({ id, title, image }, index) => (
                <div key={id} className={styles.photoCard}>
                  <Image
                    src={image}
                    alt={title}
                    width={400}
                    height={400}
                    className={`${styles.photo} ${loadedImages[id] ? styles.loaded : ''}`}
                    onLoad={() => handleImageLoad(id)}
                    onClick={() => openZoom(index)}
                    style={{ width: '100%', height: 'auto' }}
                    unoptimized
                  />
                  <div className={styles.caption}>{title}</div>
                </div>
              ))}
            </Masonry>

            {isZoomed && selectedPhotoIndex !== null && (
              <div className={styles.zoomOverlay}>
                <button className={styles.closeBtn} onClick={closeZoom}>
                  ×
                </button>
                <button className={styles.prevBtn} onClick={showPrev}>
                  ‹
                </button>

                <div className={styles.zoomImageWrapper}>
                  <Image
                    src={photos[selectedPhotoIndex].image}
                    alt={photos[selectedPhotoIndex].title}
                    fill
                    className={styles.zoomedImage}
                    unoptimized
                  />
                </div>

                <button className={styles.nextBtn} onClick={showNext}>
                  ›
                </button>
                <div className={styles.zoomCaption}>{photos[selectedPhotoIndex].title}</div>
              </div>
            )}
          </div>

          {/* <div className={styles.masonryWrapper}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={styles.myMasonryGrid}
              columnClassName={styles.myMasonryGridColumn}
            >
              {flyers.map((flyer) => (
                <div key={flyer.id} className={styles.photoCard}>
                  {flyer.image?.url && (
                    <Image
                      src={
                        flyer.image.url.startsWith('http')
                          ? flyer.image.url
                          : `${process.env.NEXT_PUBLIC_STRAPI_URL}${flyer.image.url}`
                      }
                      alt={flyer.title}
                      width={400}
                      height={400}
                      className={`${styles.photo} ${loadedImages[flyer.id] ? styles.loaded : ''}`}
                      onLoad={() => handleImageLoad(flyer.id)}
                      style={{ width: '100%', height: 'auto' }}
                      unoptimized
                    />
                  )}
                  <div className={styles.caption}>{flyer.title}</div>
                </div>
              ))}
            </Masonry>
          </div> */}
        </section>

        <SubscribeFooter subscribeUrl="https://docs.google.com/forms/d/e/1FAIpQLSddhuc44fUNSUSHSgdvp002jbUbr-svGOCnzocWIXNRqvkrnw/viewform" />
      </div>
    </>
  );
};

export default HomePage;
