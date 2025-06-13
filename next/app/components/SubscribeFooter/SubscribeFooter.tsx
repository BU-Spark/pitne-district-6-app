'use client';

import React, { useState } from 'react';
import styles from './SubscribeFooter.module.css';

type SubscribeFooterProps = {
  subscribeUrl: string;
};

const SubscribeFooter: React.FC<SubscribeFooterProps> = ({ subscribeUrl }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p className={styles.text}>Stay connected — sign up for the District 6 newsletter.</p>
        <a href={subscribeUrl} target="_blank" rel="noopener noreferrer" className={styles.button}>
          Subscribe
        </a>
      </div>
      <button className={styles.close} onClick={() => setVisible(false)}>
        &times;
      </button>
    </footer>
  );
};

export default SubscribeFooter;
