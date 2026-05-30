import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Preloader from '@/components/Preloader';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';

// TODO Phase 2: import { Ticker, ForWho, Results, Gift, About, Portfolio, Students, Reviews, Pricing, FinalCTA, Footer }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Hero />
        {/*
          TODO Phase 2 - migrate remaining sections from index.html:
          <Ticker />
          <ForWho />
          <Results />
          <Gift />
          <About />
          <Portfolio />
          <Students />
          <Reviews />
          <Pricing />
          <FinalCTA />
        */}
      </main>
      {/* <Footer /> */}
    </>
  );
}
