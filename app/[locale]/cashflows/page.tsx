'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Plus, CheckCircle, X } from 'lucide-react';
import { useCashflows, useMarkCashflowAsPaid } from '@/lib/hooks/useCashflows';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CashflowsPage() {
  const locale = useLocale();
  const t = useTranslations('cashflows');
  const tCommon = useTranslations('common');
  const { data: cashflows, isLoading } = useCashflows();
  const markAsPaid = useMarkCashflowAsPaid();

  const [markPaidModalOpen, setMarkPaidModalOpen] = useState(false);
  const [selectedCashflow, setSelectedCashflow] = useState<any>(null);

  const openMarkPaidModal = (cashflow: any) => {
    setSelectedCashflow(cashflow);
    setMarkPaidModalOpen(true);
  };

  const handleMarkAsPaid = async () => {
    if (!selectedCashflow) return;
    try {
      await markAsPaid.mutateAsync(selectedCashflow.documentId);
      setMarkPaidModalOpen(false);
      setSelectedCashflow(null);
      alert(tCommon('success'));
    } catch (error) {
      alert(tCommon('error'));
    }
  };

  // Helper function to get translated category
  const getCategoryLabel = (category: string) => {
    return t(`categories.${category}`);
  };

  // Helper function to get translated type
  const getTypeLabel = (type: string) => {
    return t(`types.${type}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('subtitle')}</p>
        </div>
        <Link
          href={`/${locale}/cashflows/new`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('newEntry')}
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">{tCommon('loading')}</div>
      ) : !cashflows || cashflows.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">{tCommon('noData')}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tCommon('date')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('type')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('category')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('description')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('amount')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tCommon('status')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tCommon('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {cashflows.map((cf) => (
                <tr key={cf.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{formatDate(cf.transactionDate, locale)}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{getTypeLabel(cf.type)}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{getCategoryLabel(cf.category)}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{cf.description}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{formatCurrency(cf.amount, locale === 'ar' ? 'ج.م' : 'EGP')}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${cf.isPaid ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                      }`}>
                      {cf.isPaid ? t('paid') : t('pending')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {!cf.isPaid && (
                      <button
                        onClick={() => openMarkPaidModal(cf)}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title={t('markAsPaid')}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mark as Paid Dialog */}
      {markPaidModalOpen && selectedCashflow && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
          onClick={() => setMarkPaidModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t('markAsPaid')}
              </h3>
              <button
                onClick={() => setMarkPaidModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t('confirmMarkPaid')}
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('description')}:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{selectedCashflow.description}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('amount')}:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(selectedCashflow.amount, locale === 'ar' ? 'ج.م' : 'EGP')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleMarkAsPaid}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('markAsPaid')}
              </button>
              <button
                onClick={() => setMarkPaidModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {tCommon('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
