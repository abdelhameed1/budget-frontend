'use client';

import { useTranslations } from 'next-intl';
import { useBatches } from '@/lib/hooks/useBatches';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export function RecentBatches() {
  const t = useTranslations('dashboard');
  const tBatch = useTranslations('batches');
  const locale = useLocale();
  const { data: batches, isLoading } = useBatches();

  const recentBatches = batches?.slice(0, 5) || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('recentBatches')}</h2>
        <Link 
          href={`/${locale}/batches`}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {t('viewAll') || 'View All'}
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : recentBatches.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t('noData')}</div>
      ) : (
        <div className="space-y-3">
          {recentBatches.map((batch) => (
            <Link
              key={batch.id}
              href={`/${locale}/batches/${batch.id}`}
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{batch.batchNumber}</p>
                  <p className="text-sm text-gray-600">
                    {typeof batch.product === 'object' && batch.product !== null ? batch.product.name : 'N/A'}
                  </p>
                </div>
                <div className="text-end">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(batch.costPerUnit, locale === 'ar' ? 'ج.م' : 'EGP')}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    batch.status === 'completed' ? 'bg-green-100 text-green-800' :
                    batch.status === 'in_production' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tBatch(`status.${batch.status}`)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
