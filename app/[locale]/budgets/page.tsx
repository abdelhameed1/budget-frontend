'use client';

import { useTranslations } from 'next-intl';
import { useBudgets } from '@/lib/hooks/useBudgets';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function BudgetsPage() {
  const t = useTranslations('budgets');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { data: budgets, isLoading } = useBudgets();

  const calculateVariance = (budgeted: number, actual: number) => {
    return actual - budgeted;
  };

  const calculateVariancePercent = (budgeted: number, actual: number) => {
    if (budgeted === 0) return 0;
    return ((actual - budgeted) / budgeted) * 100;
  };

  const isVarianceFavorable = (budgeted: number, actual: number, isRevenue: boolean) => {
    const variance = actual - budgeted;
    return isRevenue ? variance > 0 : variance < 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('budgetList')}</p>
        </div>
        <Link
          href={`/${locale}/budgets/new`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('createBudget')}
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">{tCommon('loading')}</div>
      ) : !budgets || budgets.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">{tCommon('noData')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {budgets.map((budget) => {
            const revenueVariance = calculateVariance(budget.budgetedRevenue, budget.actualRevenue);
            const revenueVariancePercent = calculateVariancePercent(budget.budgetedRevenue, budget.actualRevenue);
            const isRevenueFavorable = isVarianceFavorable(budget.budgetedRevenue, budget.actualRevenue, true);

            const totalBudgetedCosts = budget.budgetedDirectMaterial + budget.budgetedDirectLabor + 
                                      budget.budgetedFixedOverhead + budget.budgetedVariableOverhead;
            const totalActualCosts = budget.actualDirectMaterial + budget.actualDirectLabor + 
                                    budget.actualFixedOverhead + budget.actualVariableOverhead;
            const costVariance = calculateVariance(totalBudgetedCosts, totalActualCosts);
            const isCostFavorable = isVarianceFavorable(totalBudgetedCosts, totalActualCosts, false);

            return (
              <Link
                key={budget.id}
                href={`/${locale}/budgets/${budget.id}`}
                className="block bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{budget.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {formatDate(budget.startDate, locale)} - {formatDate(budget.endDate, locale)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    budget.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    budget.status === 'closed' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                  }`}>
                    {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Revenue */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('revenue')}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('budgeted')}:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(budget.budgetedRevenue, locale === 'ar' ? 'ج.م' : 'EGP')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('actual')}:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(budget.actualRevenue, locale === 'ar' ? 'ج.م' : 'EGP')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-1 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">{t('variance')}:</span>
                        <div className="flex items-center gap-1">
                          {isRevenueFavorable ? (
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                          <span className={`font-medium ${
                            isRevenueFavorable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {formatCurrency(Math.abs(revenueVariance), locale === 'ar' ? 'ج.م' : 'EGP')}
                            {' '}({revenueVariancePercent.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Costs */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{tCommon('total')} {t('budgeted')}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('budgeted')}:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(totalBudgetedCosts, locale === 'ar' ? 'ج.م' : 'EGP')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('actual')}:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(totalActualCosts, locale === 'ar' ? 'ج.م' : 'EGP')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-1 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">{t('variance')}:</span>
                        <div className="flex items-center gap-1">
                          {isCostFavorable ? (
                            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                          )}
                          <span className={`font-medium ${
                            isCostFavorable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {formatCurrency(Math.abs(costVariance), locale === 'ar' ? 'ج.م' : 'EGP')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Units */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('units')}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('budgeted')}:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{budget.budgetedUnits}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{t('actual')}:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{budget.actualUnits}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm pt-1 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">{t('variance')}:</span>
                        <span className={`font-medium ${
                          budget.actualUnits >= budget.budgetedUnits 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {budget.actualUnits - budget.budgetedUnits}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
