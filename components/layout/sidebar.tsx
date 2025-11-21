'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Warehouse,
  PieChart,
  FileText,
  Settings,
  Banknote,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { key: 'dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { key: 'investments', icon: Users, href: '/investments' },
  { key: 'products', icon: Package, href: '/products' },
  { key: 'batches', icon: Layers, href: '/batches' },
  //{ key: 'inventory', icon: Warehouse, href: '/inventory' },
  { key: 'cashflows', icon: Banknote, href: '/cashflows' },
  // { key: 'budgets', icon: PieChart, href: '/budgets' },
  //{ key: 'reports', icon: FileText, href: '/reports' },
  { key: 'settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-e border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('appName')}
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const href = `/${locale}${item.href}`;
          const isActive = pathname === href;

          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
