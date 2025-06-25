'use client';

import React, { useState, useEffect } from 'react';
import styles from './SubscribeFooter.module.css';
import { X } from 'lucide-react';
import { fetchLink } from '../../utils';

type SubscribeFooterProps = {
  onFooterToggle: (visible: boolean) => void;
};

const SubscribeFooter: React.FC<SubscribeFooterProps> = ({ onFooterToggle }) => {
  const [visible, setVisible] = useState(true);
  const [subscribeUrl, setSubscribeUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadLink = async () => {
      try {
        const url = await fetchLink('District 6 Subscribe to Newsletter Link');
        setSubscribeUrl(url);
      } catch (error) {
        console.error('Failed to load newsletter link:', error);
      }
    };

    loadLink();
  }, []);

  const handleClose = () => {
    setVisible(false);
    onFooterToggle(false);
  };

  if (!visible || !subscribeUrl) return null;

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
