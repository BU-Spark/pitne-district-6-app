'use client';
import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import Image from 'next/image';
import Navbar from '../components/Navbar/Navbar';
import SubscribeFooter from '../components/SubscribeFooter/SubscribeFooter';
import NewsletterArchive from '../components/NewsletterArchive/NewsletterArchive';
import Masonry from 'react-masonry-css';
import { ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { fetchFlyers, Flyer } from '../utils/strapi.api';

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  640: 2,
  480: 1,
};

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
  const [imageAnimationClass, setImageAnimationClass] = useState<string>('in-right');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Combine photos and flyers for zoom functionality
  const allPhotos = [
    ...photos,
    ...flyers
      .filter((flyer) => flyer.image && Array.isArray(flyer.image) && flyer.image.length > 0)
      .map((flyer) => ({
        id: flyer.id + 1000,
        title: flyer.title,
        image: flyer.image![0].url.startsWith('http')
          ? flyer.image![0].url
          : `${process.env.NEXT_PUBLIC_STRAPI_URL}${flyer.image![0].url}`,
      })),
  ];

  const openZoom = (index: number) => {
    setSelectedPhotoIndex(index);
    setImageAnimationClass('in-right');
    setIsZoomed(true);
  };

  const closeZoom = () => {
    setIsZoomed(false);
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
            <div className={styles.masonryWrapper}>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className={styles.myMasonryGrid}
                columnClassName={styles.myMasonryGridColumn}
              >
                {flyers.map((flyer, index) => (
                  <div key={flyer.id} className={styles.photoCard}>
                    {flyer.image && Array.isArray(flyer.image) && flyer.image.length > 0 && (
                      <Image
                        src={
                          flyer.image[0].url.startsWith('http')
                            ? flyer.image[0].url
                            : `${process.env.NEXT_PUBLIC_STRAPI_URL}${flyer.image[0].url}`
                        }
                        alt={flyer.title}
                        width={400}
                        height={400}
                        className={`${styles.photo} ${loadedImages[flyer.id] ? styles.loaded : ''}`}
                        onLoad={() => handleImageLoad(flyer.id)}
                        onClick={() => openZoom(photos.length + index)}
                        style={{ width: '100%', height: 'auto' }}
                        unoptimized
                      />
                    )}
                  </div>
                ))}
              </Masonry>

              {isZoomed && selectedPhotoIndex !== null && allPhotos[selectedPhotoIndex] && (
                <div className={styles.zoomOverlay}>
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
          </div>
        </section>

        <SubscribeFooter subscribeUrl="https://docs.google.com/forms/d/e/1FAIpQLSddhuc44fUNSUSHSgdvp002jbUbr-svGOCnzocWIXNRqvkrnw/viewform" />
      </div>
    </>
  );
};

export default HomePage;
