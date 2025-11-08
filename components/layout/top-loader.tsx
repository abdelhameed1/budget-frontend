'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: 'ease',
  speed: 500,
});

export function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Complete the progress bar when route changes
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    // Single click handler for all navigation triggers
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check for anchor/link clicks (including Next.js Link components)
      const anchor = target.closest('a');
      if (anchor && anchor.href) {
        const currentUrl = window.location.href;
        const targetUrl = anchor.href;
        
        // Only start progress if navigating to a different page
        // and not opening in a new tab
        if (currentUrl !== targetUrl && !anchor.target && !event.ctrlKey && !event.metaKey) {
          NProgress.start();
        }
        return;
      }

      // Check for button clicks that trigger navigation
      const button = target.closest('button');
      if (button) {
        // Check for data-navigate attribute (language switcher, etc.)
        if (button.hasAttribute('data-navigate')) {
          NProgress.start();
          return;
        }
        
        // Also detect common navigation patterns
        const buttonText = button.textContent?.toLowerCase() || '';
        const buttonRole = button.getAttribute('role');
        
        if (buttonText.includes('english') || 
            buttonText.includes('العربية') || 
            buttonRole === 'menuitem') {
          NProgress.start();
        }
      }
    };

    // Add event listener with capture phase to catch events early
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}
