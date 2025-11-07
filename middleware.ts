import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'ar',
  
  // Always use locale prefix
  localePrefix: 'always',
  
  // Detect locale from cookie
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  
  // Get the locale from the pathname
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split('/')[1];
  
  // If locale is valid, store it in a cookie
  if (locales.includes(locale as any)) {
    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
  }
  
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
