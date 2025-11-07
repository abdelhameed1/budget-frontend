'use client';

import { useTranslations } from 'next-intl';
import { useBatches, useCalculateBatchCosts, useCompleteBatch } from '@/lib/hooks/useBatches';
import { Plus, Calculator, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function BatchesPage() {
  const t = useTranslations('batches');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { data: batches, isLoading } = useBatches();
  const calculateCosts = useCalculateBatchCosts();
  const completeBatch = useCompleteBatch();

  const handleCalculateCosts = async (batchId: number) => {
    try {
      await calculateCosts.mutateAsync(batchId);
      alert(tCommon('success'));
    } catch (error) {
      alert(tCommon('error'));
    }
  };

  const handleCompleteBatch = async (batchId: number) => {
    if (confirm(t('confirmComplete') || 'Are you sure you want to complete this batch?')) {
      try {
        await completeBatch.mutateAsync(batchId);
        alert(tCommon('success'));
      } catch (error) {
        alert(tCommon('error'));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('batchList')}</p>
        </div>
        <Link
          href={`/${locale}/batches/new`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('createBatch')}
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">{tCommon('loading')}</div>
      ) : !batches || batches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">{tCommon('noData')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">{t('batchNumber')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">{t('product')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">{t('plannedQuantity')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">{t('costPerUnit')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">{tCommon('status')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">{tCommon('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link 
                      href={`/${locale}/batches/${batch.id}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {batch.batchNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{batch.product?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-900">{batch.plannedQuantity}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {batch.costPerUnit > 0 
                      ? formatCurrency(batch.costPerUnit, locale === 'ar' ? 'ج.م' : 'EGP')
                      : '-'
                    }
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      batch.status === 'completed' ? 'bg-green-100 text-green-800' :
                      batch.status === 'in_production' ? 'bg-blue-100 text-blue-800' :
                      batch.status === 'quality_check' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {t(`status.${batch.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {batch.status !== 'completed' && (
                        <button
                          onClick={() => handleCalculateCosts(batch.id)}
                          disabled={calculateCosts.isPending}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={t('calculateCosts')}
                        >
                          <Calculator className="w-4 h-4" />
                        </button>
                      )}
                      {batch.status === 'quality_check' && (
                        <button
                          onClick={() => handleCompleteBatch(batch.id)}
                          disabled={completeBatch.isPending}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={t('completeBatch')}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
