'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Plus } from 'lucide-react';
import { useCashflows } from '@/lib/hooks/useCashflows';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function CashflowsPage() {
  const locale = useLocale();
  const { data: cashflows, isLoading } = useCashflows();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Cash Flow</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">All cash movements</p>
        </div>
        <Link
          href={`/${locale}/cashflows/new`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : !cashflows || cashflows.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No data</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {cashflows.map((cf) => (
                <tr key={cf.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{formatDate(cf.transactionDate, locale)}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100 capitalize">{cf.type}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{cf.category}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{cf.description}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{formatCurrency(cf.amount, locale === 'ar' ? 'ج.م' : 'EGP')}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      cf.isPaid ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                    }`}>
                      {cf.isPaid ? 'Paid' : 'Pending'}
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
