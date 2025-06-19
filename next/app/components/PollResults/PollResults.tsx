'use client';

import React, { useState, useEffect } from 'react';
import { PollResultsResponse, fetchPollResults } from '../../utils/strapi.api';
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

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.question}>{results.poll.Question}</div>

      <div className={styles.totalVotes}>
        <Users size={16} />
        <span>
          {results.totalVotes} {results.totalVotes === 1 ? 'vote' : 'votes'}
        </span>
      </div>

      <div className={styles.resultsGrid}>
        {results.results.map((result, index) => {
          const isUserChoice = userChoice === result.choice;
          const totalVotesForChoice = result.votes;

          return (
            <div key={index} className={`${styles.resultItem} ${isUserChoice ? styles.userChoice : ''}`}>
              <div className={styles.choiceHeader}>
                <span className={styles.choiceText}>{result.choice}</span>
                <span className={styles.percentage}>{result.percentage}%</span>
              </div>

              <div className={styles.barContainer}>
                <div
                  className={`${styles.progressBar} ${isUserChoice ? styles.userBar : ''}`}
                  style={{
                    width: animateResults ? `${result.percentage}%` : '0%',
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              </div>

              {/* VOTE COUNT + USER CHOICE IN SAME ROW */}
              <div className={styles.voteRow}>
                <div className={styles.voteCount}>
                  {result.votes} {result.votes === 1 ? 'vote' : 'votes'}
                </div>
                {isUserChoice && (
                  <div className={styles.userIndicatorInline}>
                    <span>Your choice</span>
                  </div>
                )}
              </div>

              {/* REGIONAL BREAKDOWN */}
              <div className={styles.regionalBreakdown}>
                <div className={styles.regionalLabel}>Regional Breakdown</div>
                <div className={styles.regionalBarContainer}>
                  {result.regionalBreakdown
                    .filter((regional) => regional.votes > 0)
                    .map((regional) => {
                      const widthPercent = totalVotesForChoice > 0 ? (regional.votes / totalVotesForChoice) * 100 : 0;

                      return (
                        <div
                          key={regional.region}
                          className={styles.regionalBar}
                          style={{
                            width: `${widthPercent}%`,
                            backgroundColor:
                              regional.region === 'Jamaica Plain'
                                ? 'var(--color-optimistic-blue)'
                                : regional.region === 'West Roxbury'
                                  ? 'var(--color-alt-gray)'
                                  : 'var(--color-charles-blue)',
                          }}
                          title={`${regional.region}, ${regional.votes} ${regional.votes === 1 ? 'vote' : 'votes'} (${widthPercent.toFixed(1)}%)`}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className={styles.footer}>
        <p className={styles.thanksMessage}>Thank you for participating in the community poll!</p>
      </div> */}
    </div>
  );
};

export default PollResults;
