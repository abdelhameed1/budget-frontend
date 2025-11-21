'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useInvestmentDashboard } from '@/lib/hooks/useOwners';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

export default function InvestmentsPage() {
  const locale = useLocale();
  const t = useTranslations('investments');
  const tCommon = useTranslations('common');
  const { data: stats, isLoading } = useInvestmentDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">{tCommon('loading')}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">{tCommon('noData')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t('subtitle')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalCapital')}</h3>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(stats.totalCapital, locale === 'ar' ? 'ج.م' : 'EGP')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('costsIncurred')}</h3>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(stats.totalCostsIncurred, locale === 'ar' ? 'ج.م' : 'EGP')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('remainingCapital')}</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {formatCurrency(stats.remainingCapital, locale === 'ar' ? 'ج.م' : 'EGP')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('utilizationRate')}</h3>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {Number(stats.utilizationRate ?? 0).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('costBreakdown')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('materials')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(stats.costBreakdown.materials, locale === 'ar' ? 'ج.م' : 'EGP')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('labor')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(stats.costBreakdown.labor, locale === 'ar' ? 'ج.م' : 'EGP')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('fixedOverhead')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(stats.costBreakdown.overheadFixed, locale === 'ar' ? 'ج.م' : 'EGP')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('variableOverhead')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(stats.costBreakdown.overheadVariable, locale === 'ar' ? 'ج.م' : 'EGP')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('other')}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(stats.costBreakdown.other, locale === 'ar' ? 'ج.م' : 'EGP')}
            </p>
          </div>
        </div>
      </div>

      {/* Owner Summaries */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('title')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('owner')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('totalInvested')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('allocatedCosts')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('remainingBudget')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('utilizationPercent')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {stats.ownerSummaries.map((summary) => {
                if (!summary) return null;
                const rawUtil = summary.utilizationPercentage ?? 0;
                const utilization = Number.isFinite(Number(rawUtil)) ? Number(rawUtil) : 0;
                const utilizationClamped = Math.min(Math.max(utilization, 0), 100);

                return (
                <tr key={summary.owner.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">
                    {summary.owner.ownerName}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {formatCurrency(summary.totalInvested, locale === 'ar' ? 'ج.م' : 'EGP')}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {formatCurrency(summary.allocatedCosts, locale === 'ar' ? 'ج.م' : 'EGP')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      summary.remainingBudget >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatCurrency(summary.remainingBudget, locale === 'ar' ? 'ج.م' : 'EGP')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                        <div 
                          className={`h-2 rounded-full ${
                            utilization > 90 
                              ? 'bg-red-600' 
                              : utilization > 70 
                              ? 'bg-yellow-600' 
                              : 'bg-green-600'
                          }`}
                          style={{ width: `${utilizationClamped}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {utilization.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
