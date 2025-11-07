'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { MetricCard } from '@/components/dashboard/metric-card';
import { RecentBatches } from '@/components/dashboard/recent-batches';
import { RecentSales } from '@/components/dashboard/recent-sales';
import { useDashboardStats } from '@/lib/hooks/useDashboard';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">{tCommon('loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t('overview')}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={t('totalRevenue')}
          value={formatCurrency(stats?.totalRevenue || 0, locale === 'ar' ? 'ج.م' : 'EGP')}
          trend="+0%"
          trendUp={true}
        />
        <MetricCard
          title={t('totalCosts')}
          value={formatCurrency(stats?.totalCosts || 0, locale === 'ar' ? 'ج.م' : 'EGP')}
          trend="+0%"
          trendUp={false}
        />
        <MetricCard
          title={t('grossProfit')}
          value={formatCurrency(stats?.grossProfit || 0, locale === 'ar' ? 'ج.م' : 'EGP')}
          trend="+0%"
          trendUp={true}
        />
        <MetricCard
          title={t('profitMargin')}
          value={`${(stats?.profitMargin || 0).toFixed(1)}%`}
          trend="+0%"
          trendUp={true}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBatches />
        <RecentSales />
      </div>
    </div>
  );
}
