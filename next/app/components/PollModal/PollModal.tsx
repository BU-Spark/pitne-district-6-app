'use client';

import React, { useState } from 'react';
import { Poll, submitPollResponse } from '../../utils/strapi.api';
import styles from './PollModal.module.css';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface PollModalProps {
  poll: Poll;
  onClose: () => void;
  onSubmitted: () => void;
}

const PollModal: React.FC<PollModalProps> = ({ poll, onClose, onSubmitted }) => {
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedChoice || !email) {
      setSubmitStatus({
        type: 'error',
        message: 'Please select an option and enter your email address.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await submitPollResponse(poll.id, email, selectedChoice);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message,
        });

        // Close modal after success
        setTimeout(() => {
          onSubmitted();
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message,
        });
      }
    } catch (error) {
      console.error('Poll submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close poll">
          <X size={24} />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Community Poll</h2>
          <p className={styles.question}>{poll.Question}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.choicesSection}>
            <h3 className={styles.choicesTitle}>Select your choice:</h3>
            <div className={styles.choices}>
              {poll.choices.map((choice, index) => (
                <label key={index} className={styles.choiceLabel}>
                  <input
                    type="radio"
                    name="pollChoice"
                    value={choice}
                    checked={selectedChoice === choice}
                    onChange={(e) => setSelectedChoice(e.target.value)}
                    className={styles.choiceInput}
                  />
                  <span className={styles.choiceText}>{choice}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.emailSection}>
            <label htmlFor="email" className={styles.emailLabel}>
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={styles.emailInput}
              required
            />
          </div>

          {submitStatus.type && (
            <div className={`${styles.statusMessage} ${styles[submitStatus.type]}`}>
              {submitStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{submitStatus.message}</span>
            </div>
          )}

          <button type="submit" disabled={isSubmitting || !selectedChoice || !email} className={styles.submitButton}>
            {isSubmitting ? 'Submitting...' : 'Submit Vote'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PollModal;
