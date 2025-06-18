'use client';

import React, { useState } from 'react';
import { Poll, submitPollResponse } from '../../utils/strapi.api';
import PollResults from '../PollResults/PollResults';
import styles from './PollModal.module.css';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface PollModalProps {
  poll: Poll;
  onClose: () => void;
}

const PollModal: React.FC<PollModalProps> = ({ poll, onClose }) => {
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [region, setRegion] = useState<'Jamaica Plain' | 'West Roxbury' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedChoice || !email || !address || !region) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields: choice, email, address, and region.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await submitPollResponse(
        poll.documentId,
        email,
        selectedChoice,
        address,
        region as 'Jamaica Plain' | 'West Roxbury'
      );

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message,
        });

        // Show results after a brief success message
        setTimeout(() => {
          setShowResults(true);
        }, 1500);
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

        {showResults ? (
          <PollResults pollDocumentId={poll.documentId} userChoice={selectedChoice} />
        ) : (
          <>
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

              <div className={styles.addressSection}>
                <label htmlFor="address" className={styles.addressLabel}>
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className={styles.addressInput}
                  required
                />
              </div>

              <div className={styles.regionSection}>
                <h3 className={styles.regionTitle}>Select your region:</h3>
                <div className={styles.regionChoices}>
                  <label className={styles.regionLabel}>
                    <input
                      type="radio"
                      name="region"
                      value="Jamaica Plain"
                      checked={region === 'Jamaica Plain'}
                      onChange={(e) => setRegion(e.target.value as 'Jamaica Plain' | 'West Roxbury')}
                      className={styles.regionInput}
                    />
                    <span className={styles.regionText}>Jamaica Plain</span>
                  </label>
                  <label className={styles.regionLabel}>
                    <input
                      type="radio"
                      name="region"
                      value="West Roxbury"
                      checked={region === 'West Roxbury'}
                      onChange={(e) => setRegion(e.target.value as 'Jamaica Plain' | 'West Roxbury')}
                      className={styles.regionInput}
                    />
                    <span className={styles.regionText}>West Roxbury</span>
                  </label>
                </div>
              </div>

              {submitStatus.type && (
                <div className={`${styles.statusMessage} ${styles[submitStatus.type]}`}>
                  {submitStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !selectedChoice || !email || !address || !region}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Vote'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PollModal;
