import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { trackCtaStart } from '@/lib/fbpixel';
import HeroCTA from './HeroCTA';
import styles from './Hero.module.css';

export default function Hero() {
  const t = useTranslations();

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.badge}>{t('hero.badge')}</div>
          <div className={styles.offer}>
            <h1
              className={styles.title}
              dangerouslySetInnerHTML={{ __html: t.raw('hero.title') as string }}
            />
            <p
              className={styles.sub}
              dangerouslySetInnerHTML={{ __html: t.raw('hero.sub') as string }}
            />
          </div>
          <HeroCTA label={t('cta.start')} />
        </div>
        <div className={styles.photo}>
          <Image
            src="/sofia.jpg"
            alt="Sofia Kantser"
            width={420}
            height={525}
            priority
          />
          <div className={styles.tag}>{t('hero.tag')}</div>
        </div>
      </div>
    </section>
  );
}
