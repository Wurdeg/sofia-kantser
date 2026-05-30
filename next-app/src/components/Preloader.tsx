'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Preloader.module.css';

const MIN_DURATION = 2400;

export default function Preloader() {
  const t = useTranslations();
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    document.body.classList.add('loading');
    const start = performance.now();

    const hide = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_DURATION - elapsed);
      setTimeout(() => {
        setDone(true);
        document.body.classList.remove('loading');
        setTimeout(() => setRemoved(true), 1000);
      }, remaining);
    };

    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);

    return () => {
      window.removeEventListener('load', hide);
      document.body.classList.remove('loading');
    };
  }, []);

  if (removed) return null;

  return (
    <div className={`${styles.preloader} ${done ? styles.done : ''}`} aria-hidden="true">
      <div className={styles.content}>
        <div className={styles.mark}>AI AI Content</div>
        <div className={styles.logo}>
          Sofia <em>Kantser</em>
        </div>
        <div className={styles.line} />
        <div className={styles.caption}>{t('preloader.caption')}</div>
      </div>
    </div>
  );
}
