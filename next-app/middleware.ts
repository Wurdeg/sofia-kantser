import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Все маршруты кроме API, _next, файлов с расширением
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
