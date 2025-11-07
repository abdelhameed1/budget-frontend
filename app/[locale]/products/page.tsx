'use client';

import { useTranslations } from 'next-intl';
import { useProducts } from '@/lib/hooks/useProducts';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { data: products, isLoading } = useProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('productList')}</p>
        </div>
        <Link
          href={`/${locale}/products/new`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('createProduct')}
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">{tCommon('loading')}</div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">{tCommon('noData')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.id}`}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.sku}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.isActive ? tCommon('active') : tCommon('inactive')}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('category')}:</span>
                  <span className="font-medium">{t(`categories.${product.category}`)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('lifecycleStage')}:</span>
                  <span className="font-medium">{t(`lifecycleStages.${product.lifecycleStage}`)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('targetPrice')}:</span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(product.targetSellingPrice, locale === 'ar' ? 'ج.م' : 'EGP')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
