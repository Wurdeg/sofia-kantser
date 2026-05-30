'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LangToggle from './LangToggle';
import { trackCtaStart } from '@/lib/fbpixel';
import styles from './Nav.module.css';

export default function Nav() {
  const t = useTranslations();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/#hero" className={styles.logo}>
          <span className={styles.mark}>
            <span className={styles.markText}>sk</span>
          </span>
          <span className={styles.text}>
            <span className={styles.name}>Sofia Kantser</span>
            <span className={styles.sub}>AI AI Content</span>
          </span>
        </Link>

        <ul className={styles.links}>
          <li>
            <a href="#hero">{t('nav.brand')}</a>
          </li>
          <li>
            <a href="#results">{t('nav.cases')}</a>
          </li>
        </ul>

        <a
          href="#pricing"
          className={styles.cta}
          onClick={() => trackCtaStart('nav')}
        >
          {t('nav.cta')}
        </a>

        <LangToggle />
      </div>
    </nav>
  );
}
