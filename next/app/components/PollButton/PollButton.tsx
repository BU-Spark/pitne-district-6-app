'use client';

import React, { useState, useEffect } from 'react';
import { Poll, fetchActivePoll } from '../../utils/strapi.api';
import PollModal from '../PollModal/PollModal';
import styles from './PollButton.module.css';
import { MessageSquare } from 'lucide-react';

const PollButton: React.FC = () => {
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const handlePollSubmitted = () => {
    // Hide the poll button after successful submission
    setActivePoll(null);
    setIsModalOpen(false);
  };

  // Don't render if no active poll or still loading
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
      >
        <MessageSquare size={24} />
        <span className={styles.pollText}>Poll</span>
        <div className={styles.pulse}></div>
      </button>

      {isModalOpen && <PollModal poll={activePoll} onClose={handleCloseModal} onSubmitted={handlePollSubmitted} />}
    </>
  );
};

export default PollButton;
