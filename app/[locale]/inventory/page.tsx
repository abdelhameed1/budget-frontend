'use client';

import { useTranslations } from 'next-intl';
import { useInventory } from '@/lib/hooks/useInventory';
import { AlertTriangle } from 'lucide-react';
import { useLocale } from 'next-intl';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function InventoryPage() {
  const t = useTranslations('inventory');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { data: inventory, isLoading } = useInventory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t('inventoryList')}</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">{tCommon('loading')}</div>
      ) : !inventory || inventory.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">{tCommon('noData')}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tCommon('products')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('quantityOnHand')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('quantitySold')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('unitCost')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('totalValue')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('valuationMethod')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('location')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.quantityOnHand <= 10 && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.product?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.product?.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${
                      item.quantityOnHand <= 10 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {item.quantityOnHand}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{item.quantitySold}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {formatCurrency(item.unitCost, locale === 'ar' ? 'ج.م' : 'EGP')}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {formatCurrency(item.totalValue, locale === 'ar' ? 'ج.م' : 'EGP')}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                    {t(`valuationMethods.${item.valuationMethod}`)}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{item.location || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
