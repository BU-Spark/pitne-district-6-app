'use client';

import React, { useState, useEffect } from 'react';
import { Poll, fetchActivePoll } from '../../utils/strapi.api';
import PollModal from '../PollModal/PollModal';
import styles from './PollButton.module.css';
import { FaPoll } from 'react-icons/fa';

const PollButton: React.FC<{ isFooterVisible: boolean }> = ({ isFooterVisible }) => {
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const loadActivePoll = async () => {
      try {
        const poll = await fetchActivePoll();
        setActivePoll(poll);
      } catch (error) {
        console.error('Error loading active poll:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivePoll();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading || !activePoll) {
    return null;
  }

  // Dynamic bottomOffset based on screen size + footer visibility
  let bottomOffset = '20px'; // default desktop

  if (windowWidth <= 768) {
    // mobile & tablet
    bottomOffset = isFooterVisible ? '135px' : '20px';
  } else {
    // desktop
    bottomOffset = isFooterVisible ? '85px' : '20px';
  }

  return (
    <>
      <button
        className={styles.pollButton}
        onClick={handleOpenModal}
        aria-label="Open poll"
        title="Take our community poll"
        style={{ bottom: bottomOffset }}
      >
        <FaPoll size={32} />
        <span className={styles.pollText}>Poll</span>
        <div className={styles.pulse}></div>
      </button>

      {isModalOpen && <PollModal poll={activePoll} onClose={handleCloseModal} />}
    </>
  );
};

export default PollButton;
