/**
 * Facebook Pixel helper.
 * Если NEXT_PUBLIC_FB_PIXEL_ID не задан - все функции no-op.
 */

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean };
    _fbq?: unknown;
  }
}

const safe = (...args: unknown[]) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  try {
    window.fbq(...args);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error('[fbpixel]', e);
  }
};

export const pageview = () => safe('track', 'PageView');

export const event = (name: string, params?: Record<string, unknown>) =>
  safe('track', name, params);

export const customEvent = (name: string, params?: Record<string, unknown>) =>
  safe('trackCustom', name, params);

// Конкретные события - удобные обёртки

export const trackCtaStart = (location: string) =>
  event('InitiateCheckout', {
    content_category: 'course',
    content_name: `cta_${location}`,
    value: 250,
    currency: 'EUR'
  });

export const trackPlanClick = (tier: 'base' | 'standard' | 'vip') => {
  const priceMap = { base: 250, standard: 490, vip: 990 };
  event('InitiateCheckout', {
    content_category: 'plan',
    content_name: `plan_${tier}`,
    value: priceMap[tier],
    currency: 'EUR'
  });
};

export const trackGiftOpen = () =>
  event('Lead', { content_name: 'gift_opened' });

export const trackAccordionOpen = (num: 1 | 2 | 3) =>
  event('ViewContent', {
    content_category: 'curriculum',
    content_name: `result_${num}`
  });

export const trackPricingView = () =>
  event('AddToCart', {
    content_category: 'pricing_view'
  });

export const trackLangSwitch = (locale: string) =>
  event('CustomizeProduct', {
    content_category: 'lang_switch',
    content_name: locale
  });
