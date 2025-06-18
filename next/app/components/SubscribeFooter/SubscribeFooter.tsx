'use client';

import React, { useState } from 'react';
import styles from './SubscribeFooter.module.css';
import { X } from 'lucide-react';

type SubscribeFooterProps = {
  subscribeUrl: string;
  onFooterToggle: (visible: boolean) => void;
};

const SubscribeFooter: React.FC<SubscribeFooterProps> = ({ subscribeUrl, onFooterToggle }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    onFooterToggle(false);
  };

  if (!visible) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p className={styles.text}>Stay connected — sign up for the District 6 newsletter.</p>
        <a href={subscribeUrl} target="_blank" rel="noopener noreferrer" className={styles.button}>
          Subscribe
        </a>
      </div>
      <button className={styles.close} onClick={handleClose} aria-label="Close">
        <X size={24} />
      </button>
    </footer>
  );
};

export default SubscribeFooter;
