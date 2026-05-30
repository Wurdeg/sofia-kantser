'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { trackLangSwitch } from '@/lib/fbpixel';
import styles from './LangToggle.module.css';

export default function LangToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: string) => {
    if (next === locale || isPending) return;
    trackLangSwitch(next);
    startTransition(() => {
      router.replace(pathname, { locale: next as 'ru' | 'en' | 'ro' });
    });
  };

  return (
    <button
      className={styles.toggle}
      data-lang={locale}
      aria-label="Language"
      type="button"
    >
      {routing.locales.map((l) => (
        <span
          key={l}
          className={`${styles.opt} ${l === locale ? styles.active : ''}`}
          data-lang={l}
          onClick={() => switchTo(l)}
        >
          {l.toUpperCase()}
        </span>
      ))}
    </button>
  );
}
