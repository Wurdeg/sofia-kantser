import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ru', 'en', 'ro'] as const,
  defaultLocale: 'ru',
  // 'as-needed': ru без префикса (дефолт), en и ro с префиксом /en, /ro
  localePrefix: 'as-needed'
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
