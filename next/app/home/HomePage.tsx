'use client';

import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import Image from 'next/image';
import Navbar from '../components/Navbar/Navbar';
import SubscribeFooter from '../components/SubscribeFooter/SubscribeFooter';
import NewsletterArchive from '../components/NewsletterArchive/NewsletterArchive';
import PollButton from '../components/PollButton/PollButton';
import Masonry from 'react-masonry-css';
import { ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
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
  const [imageAnimationClass, setImageAnimationClass] = useState<string>('in-right');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isZoomedFirstOpen, setIsZoomedFirstOpen] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  const allPhotos = flyers
    .filter((flyer) => flyer.image && Array.isArray(flyer.image) && flyer.image.length > 0)
    .map((flyer) => ({
      id: flyer.id,
      title: flyer.title,
      image: flyer.image![0].url.startsWith('http')
        ? flyer.image![0].url
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${flyer.image![0].url}`,
    }));

  const openZoom = (index: number) => {
    setSelectedPhotoIndex(index);
    setImageAnimationClass('in-right');
    setIsZoomed(true);
    setIsZoomedFirstOpen(true);
  };

  const closeZoom = () => {
    setIsZoomed(false);
    setTimeout(() => setIsZoomedFirstOpen(false), 300);
  };

  const showPrev = () => {
    if (selectedPhotoIndex !== null && allPhotos.length > 0) {
      setImageAnimationClass('out-left');
      setTimeout(() => {
        setSelectedPhotoIndex((prev) => (prev! + allPhotos.length - 1) % allPhotos.length);
        setImageAnimationClass('in-left');
      }, 300);
    }
  };

  const showNext = () => {
    if (selectedPhotoIndex !== null && allPhotos.length > 0) {
      setImageAnimationClass('out-right');
      setTimeout(() => {
        setSelectedPhotoIndex((prev) => (prev! + 1) % allPhotos.length);
        setImageAnimationClass('in-right');
      }, 300);
    }
  };

  useEffect(() => {
    const loadFlyers = async () => {
      console.log('Fetching flyers...');
      const fetched = await fetchFlyers();
      console.log('Fetched flyers:', fetched);
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

        <NewsletterArchive />

        <section className={styles.dateSection}>
          <h2>Upcoming Events</h2>
          <div className={styles.masonryWrapper}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={styles.myMasonryGrid}
              columnClassName={styles.myMasonryGridColumn}
            >
              {allPhotos.map((photo, index) => (
                <div key={photo.id} className={styles.photoCard}>
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    width={400}
                    height={400}
                    className={`${styles.photo} ${loadedImages[photo.id] ? styles.loaded : ''}`}
                    onLoad={() => handleImageLoad(photo.id)}
                    onClick={() => openZoom(index)}
                    style={{ width: '100%', height: 'auto' }}
                    unoptimized
                  />
                </div>
              ))}
            </Masonry>

            {isZoomed && selectedPhotoIndex !== null && allPhotos[selectedPhotoIndex] && (
              <div className={`${styles.zoomOverlay} ${isZoomedFirstOpen ? '' : styles.fadeSlideIn}`}>
                <div className={styles.topButtons}>
                  <a
                    className={styles.iconBtn}
                    href={allPhotos[selectedPhotoIndex].image}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download"
                  >
                    <Download size={28} />
                  </a>
                  <button className={styles.iconBtn} onClick={closeZoom} title="Close">
                    <X size={28} />
                  </button>
                </div>
                <button className={styles.prevBtn} onClick={showPrev}>
                  <ChevronLeft size={48} />
                </button>
                <div className={styles.zoomImageWrapper}>
                  <Image
                    src={allPhotos[selectedPhotoIndex].image}
                    alt={allPhotos[selectedPhotoIndex].title}
                    fill
                    className={`${styles.zoomedImage} ${styles[`zoom-animate-${imageAnimationClass}`]}`}
                    unoptimized
                  />
                </div>
                <button className={styles.nextBtn} onClick={showNext}>
                  <ChevronRight size={48} />
                </button>
                <div className={styles.zoomCaption}>{allPhotos[selectedPhotoIndex].title}</div>
              </div>
            )}
          </div>
        </section>

        <SubscribeFooter
          subscribeUrl="https://docs.google.com/forms/d/e/1FAIpQLSddhuc44fUNSUSHSgdvp002jbUbr-svGOCnzocWIXNRqvkrnw/viewform"
          onFooterToggle={(visible: boolean) => setIsFooterVisible(visible)}
        />
      </div>

      <PollButton isFooterVisible={isFooterVisible} />
    </>
  );
};

export default HomePage;
