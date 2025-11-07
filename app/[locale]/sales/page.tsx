'use client';

import { useTranslations } from 'next-intl';
import { useSales } from '@/lib/hooks/useSales';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SalesPage() {
  const t = useTranslations('sales');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { data: sales, isLoading } = useSales();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('salesList')}</p>
        </div>
        <Link
          href={`/${locale}/sales/new`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('createSale')}
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">{tCommon('loading')}</div>
      ) : !sales || sales.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">{tCommon('noData')}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('invoiceNumber')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tCommon('date')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('customer')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tCommon('quantity')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('totalRevenue')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('grossProfit')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('paymentStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <Link 
                      href={`/${locale}/sales/${sale.id}`}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {sale.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{formatDate(sale.saleDate, locale)}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{sale.customer || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{sale.quantity}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {formatCurrency(sale.totalRevenue, locale === 'ar' ? 'ج.م' : 'EGP')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${sale.grossProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(sale.grossProfit, locale === 'ar' ? 'ج.م' : 'EGP')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      sale.paymentStatus === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      sale.paymentStatus === 'partial' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                    }`}>
                      {t(`paymentStatuses.${sale.paymentStatus}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
