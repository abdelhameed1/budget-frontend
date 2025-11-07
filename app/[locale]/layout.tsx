import { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Providers>
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
