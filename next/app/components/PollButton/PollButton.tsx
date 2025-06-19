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
  const bottomOffset = isFooterVisible ? '85px' : '20px';

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
