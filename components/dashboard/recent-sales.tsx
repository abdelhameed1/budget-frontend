'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Sale, StrapiResponse } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export function RecentSales() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  
  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales', 'recent'],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Sale[]>>('/sales?populate=product&sort=saleDate:desc&pagination[limit]=5');
      return data.data;
    },
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('recentSales')}</h2>
        <Link 
          href={`/${locale}/sales`}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {t('viewAll') || 'View All'}
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : !sales || sales.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t('noData')}</div>
      ) : (
        <div className="space-y-3">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{sale.invoiceNumber}</p>
                  <p className="text-sm text-gray-600">
                    {sale.customer || 'N/A'} • {formatDate(sale.saleDate, locale)}
                  </p>
                </div>
                <div className="text-end">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(sale.totalRevenue, locale === 'ar' ? 'ج.م' : 'EGP')}
                  </p>
                  <p className="text-sm text-green-600">
                    +{formatCurrency(sale.grossProfit, locale === 'ar' ? 'ج.م' : 'EGP')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
