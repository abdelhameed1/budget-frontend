'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCreateProduct } from '@/lib/hooks/useProducts';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const createProduct = useCreateProduct();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: 'other' as 'clothing' | 'accessories' | 'home' | 'other',
    targetSellingPrice: 0,
    standardMaterialCost: 0,
    standardLaborCost: 0,
    standardOverheadCost: 0,
    lifecycleStage: 'development' as 'development' | 'launch' | 'growth' | 'maturity' | 'decline',
    developmentCost: 0,
    expectedLifetimeSales: 0,
    isActive: true,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct.mutateAsync(formData);
      router.push(`/${locale}/products`);
    } catch (error) {
      alert(tCommon('error'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/products`}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('createProduct')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('productDetails')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('sections.basicInfo')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('sections.basicInfoHint')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('name')} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.name')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('sku')} *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.sku')}</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {tCommon('description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.description')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('category')} *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="clothing">{t('categories.clothing')}</option>
              <option value="accessories">{t('categories.accessories')}</option>
              <option value="home">{t('categories.home')}</option>
              <option value="other">{t('categories.other')}</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.category')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('lifecycleStage')} *
            </label>
            <select
              name="lifecycleStage"
              value={formData.lifecycleStage}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="development">{t('lifecycleStages.development')}</option>
              <option value="launch">{t('lifecycleStages.launch')}</option>
              <option value="growth">{t('lifecycleStages.growth')}</option>
              <option value="maturity">{t('lifecycleStages.maturity')}</option>
              <option value="decline">{t('lifecycleStages.decline')}</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.lifecycleStage')}</p>
          </div>

          {/* Pricing & Costs */}
          <div className="md:col-span-2 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('sections.pricingCosts')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('sections.pricingCostsHint')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('targetPrice')} *
            </label>
            <input
              type="number"
              name="targetSellingPrice"
              value={formData.targetSellingPrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.targetPrice')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('materialCost')}
            </label>
            <input
              type="number"
              name="standardMaterialCost"
              value={formData.standardMaterialCost}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.materialCost')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('laborCost')}
            </label>
            <input
              type="number"
              name="standardLaborCost"
              value={formData.standardLaborCost}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.laborCost')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('overheadCost')}
            </label>
            <input
              type="number"
              name="standardOverheadCost"
              value={formData.standardOverheadCost}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.overheadCost')}</p>
          </div>

          {/* Development */}
          <div className="md:col-span-2 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('sections.development')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('sections.developmentHint')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('developmentCost')}
            </label>
            <input
              type="number"
              name="developmentCost"
              value={formData.developmentCost}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.developmentCost')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('expectedSales')}
            </label>
            <input
              type="number"
              name="expectedLifetimeSales"
              value={formData.expectedLifetimeSales}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.expectedSales')}</p>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('isActive')}</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ms-6">{t('hints.isActive')}</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {tCommon('notes')}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.notes')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={createProduct.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {createProduct.isPending ? tCommon('loading') : tCommon('save')}
          </button>
          <Link
            href={`/${locale}/products`}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {tCommon('cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}
