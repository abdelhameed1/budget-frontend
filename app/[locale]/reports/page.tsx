'use client';

import { useTranslations } from 'next-intl';
import { useZakatRecords } from '@/lib/hooks/useReports';
import { FileText, DollarSign, TrendingUp, Package, Calculator } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const t = useTranslations('reports');
  const tZakat = useTranslations('zakat');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { data: zakatRecords, isLoading } = useZakatRecords();

  const reportTypes = [
    {
      title: t('profitability'),
      description: 'Revenue, costs, and profit analysis',
      icon: TrendingUp,
      href: `/${locale}/reports/profitability`,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    },
    {
      title: t('costAnalysis'),
      description: 'Detailed cost breakdown and trends',
      icon: DollarSign,
      href: `/${locale}/reports/cost-analysis`,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      title: t('salesReport'),
      description: 'Sales performance and customer insights',
      icon: FileText,
      href: `/${locale}/reports/sales`,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    {
      title: t('inventoryReport'),
      description: 'Stock levels and valuation',
      icon: Package,
      href: `/${locale}/reports/inventory`,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t('generateReport')}</p>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Link
              key={report.title}
              href={report.href}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg ${report.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Zakat & Sadaqat Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{tZakat('title')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tZakat('zakatDetails')}</p>
            </div>
          </div>
          <Link
            href={`/${locale}/reports/zakat/calculate`}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Calculator className="w-5 h-5" />
            {tZakat('calculateZakat')}
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">{tCommon('loading')}</div>
        ) : !zakatRecords || zakatRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No Zakat calculations yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tZakat('type')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tZakat('gregorianYear')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tZakat('calculationDate')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tZakat('calculatedAmount')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tZakat('paidAmount')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tCommon('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {zakatRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4">
                      <Link
                        href={`/${locale}/reports/zakat/${record.id}`}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        {tZakat(`types.${record.type}`)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{record.gregorianYear}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{formatDate(record.calculationDate, locale)}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {formatCurrency(record.calculatedAmount, locale === 'ar' ? 'ج.م' : 'EGP')}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {formatCurrency(record.paidAmount, locale === 'ar' ? 'ج.م' : 'EGP')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        record.status === 'fully_paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                        record.status === 'partially_paid' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                      }`}>
                        {tZakat(`statuses.${record.status}`)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
