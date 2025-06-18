'use client';

import React, { useState, useEffect } from 'react';
import { PollResultsResponse, PollResult, fetchPollResults } from '../../utils/strapi.api';
import styles from './PollResults.module.css';
import { Users } from 'lucide-react';

interface PollResultsProps {
  pollId: number;
  userChoice?: string;
}

const PollResults: React.FC<PollResultsProps> = ({ pollId, userChoice }) => {
  const [results, setResults] = useState<PollResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animateResults, setAnimateResults] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const pollResults = await fetchPollResults(pollId);
        setResults(pollResults);

        // Trigger animation after a short delay
        setTimeout(() => {
          setAnimateResults(true);
        }, 300);
      } catch (error) {
        console.error('Error loading poll results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [pollId]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading results...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className={styles.error}>
        <p>Unable to load poll results</p>
      </div>
    );
  }

  const maxPercentage = Math.max(...results.results.map((r: PollResult) => r.percentage));

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>Poll Results</h3>
        </div>
        <div className={styles.totalVotes}>
          <Users size={16} />
          <span>
            {results.totalVotes} {results.totalVotes === 1 ? 'vote' : 'votes'}
          </span>
        </div>
      </div>

      <div className={styles.question}>{results.poll.Question}</div>

      <div className={styles.resultsGrid}>
        {results.results.map((result, index) => {
          const isUserChoice = userChoice === result.choice;
          const isWinning = result.percentage === maxPercentage && maxPercentage > 0;

          return (
            <div
              key={index}
              className={`${styles.resultItem} ${isUserChoice ? styles.userChoice : ''} ${isWinning ? styles.winning : ''}`}
            >
              <div className={styles.choiceHeader}>
                <span className={styles.choiceText}>{result.choice}</span>
                <div className={styles.stats}>
                  <span className={styles.percentage}>{result.percentage}%</span>
                  <span className={styles.voteCount}>({result.votes})</span>
                </div>
              </div>

              <div className={styles.barContainer}>
                <div
                  className={`${styles.progressBar} ${isUserChoice ? styles.userBar : ''} ${isWinning ? styles.winningBar : ''}`}
                  style={{
                    width: animateResults ? `${result.percentage}%` : '0%',
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              </div>

              {isUserChoice && (
                <div className={styles.userIndicator}>
                  <span>Your choice</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <p className={styles.thanksMessage}>Thank you for participating in our community poll!</p>
      </div>
    </div>
  );
};

export default PollResults;
