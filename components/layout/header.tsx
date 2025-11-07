'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';

export function Header() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    
    // Remove the current locale prefix and add the new one
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    // Save locale preference to cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    
    router.push(newPath);
    router.refresh();
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {/* Page title will be set by individual pages */}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={toggleLocale}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Globe className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {locale === 'ar' ? 'English' : 'العربية'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
