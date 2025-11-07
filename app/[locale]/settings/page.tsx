'use client';

import { useTranslations } from 'next-intl';
import { useOverheadRates } from '@/lib/hooks/useSettings';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { data: rates, isLoading } = useOverheadRates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t('overheadRates')}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('overheadRates')}</h2>
          <Link
            href={`/${locale}/settings/overhead-rates/new`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {t('createRate')}
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">{tCommon('loading')}</div>
        ) : !rates || rates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{tCommon('noData')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('rateName')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('rateType')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('ratePerUnit')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('ratePerHour')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('applicableStage')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('effectiveFrom')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tCommon('status')}</th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tCommon('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {rates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{rate.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        rate.rateType === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                        rate.rateType === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                        rate.rateType === 'low' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                      }`}>
                        {t(`rateTypes.${rate.rateType}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {formatCurrency(rate.ratePerUnit, locale === 'ar' ? 'ج.م' : 'EGP')}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {formatCurrency(rate.ratePerHour, locale === 'ar' ? 'ج.م' : 'EGP')}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {t(`stages.${rate.applicableStage}`)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {formatDate(rate.effectiveFrom, locale)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        rate.isActive 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                      }`}>
                        {rate.isActive ? tCommon('active') : tCommon('inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${locale}/settings/overhead-rates/${rate.id}`}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
