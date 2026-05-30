'use client';

import { trackCtaStart } from '@/lib/fbpixel';
import styles from './Hero.module.css';

export default function HeroCTA({ label }: { label: string }) {
  return (
    <a
      href="#pricing"
      className={styles.cta}
      onClick={() => trackCtaStart('hero')}
    >
      {label}
    </a>
  );
}
