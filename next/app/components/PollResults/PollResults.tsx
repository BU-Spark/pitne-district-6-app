'use client';

import React, { useState, useEffect } from 'react';
import { PollResultsResponse, PollResult, fetchPollResults } from '../../utils/strapi.api';
import styles from './PollResults.module.css';
import { Users } from 'lucide-react';

interface PollResultsProps {
  pollDocumentId: string;
  userChoice?: string;
}

const PollResults: React.FC<PollResultsProps> = ({ pollDocumentId, userChoice }) => {
  const [results, setResults] = useState<PollResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animateResults, setAnimateResults] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const pollResults = await fetchPollResults(pollDocumentId);
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
  }, [pollDocumentId]);

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

              {/* Regional Breakdown */}
              {result.votes > 0 && (
                <div className={styles.regionalBreakdown}>
                  <div className={styles.regionalTitle}>Regional Distribution:</div>
                  <div className={styles.regionalStats}>
                    {result.regionalBreakdown.map((regional, regionalIndex) => (
                      <div
                        key={regional.region}
                        className={styles.regionalItem}
                        style={{
                          animationDelay: `${index * 100 + regionalIndex * 50 + 200}ms`,
                        }}
                      >
                        <div className={styles.regionalHeader}>
                          <span className={styles.regionName}>{regional.region}</span>
                          <span className={styles.regionalPercentage}>{regional.percentage}%</span>
                        </div>
                        <div className={styles.regionalBarContainer}>
                          <div
                            className={styles.regionalBar}
                            style={{
                              width: animateResults ? `${regional.percentage}%` : '0%',
                              backgroundColor: regional.region === 'Jamaica Plain' ? '#10b981' : '#f59e0b',
                            }}
                          />
                        </div>
                        <div className={styles.regionalVoteCount}>
                          {regional.votes} {regional.votes === 1 ? 'vote' : 'votes'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
