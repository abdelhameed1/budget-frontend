'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCreateProduct } from '@/lib/hooks/useProducts';
import { useCategories } from '@/lib/hooks/useCategories';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const t = useTranslations('products');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Fallback label if translation key is missing
  const selectCategoryLabel = locale === 'ar' ? 'اختر النوع' : 'Select product category';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as string, // Changed to string for documentId
    targetSellingPrice: '' as string | number,
    standardMaterialCost: '' as string | number,
    standardLaborCost: '' as string | number,
    standardOverheadCost: '' as string | number,
    lifecycleStage: 'development' as 'development' | 'launch' | 'growth' | 'maturity' | 'decline',
    developmentCost: '' as string | number,
    expectedLifetimeSales: '' as string | number,
    isActive: true,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category || undefined,
        lifecycleStage: formData.lifecycleStage,
        isActive: formData.isActive,
        notes: formData.notes || undefined,
      };

      // Parse numeric fields (allow empty during edit, validate on submit)
      const n = (v: string | number) => (v === '' ? undefined : typeof v === 'number' ? v : parseFloat(v));
      const targetPrice = n(formData.targetSellingPrice);
      if (targetPrice === undefined || Number.isNaN(targetPrice)) {
        // Respect required validation
        return alert(t('hints.targetPrice'));
      }
      payload.targetSellingPrice = targetPrice;

      const material = n(formData.standardMaterialCost);
      const labor = n(formData.standardLaborCost);
      const overhead = n(formData.standardOverheadCost);
      const devCost = n(formData.developmentCost);
      const expectedSales = n(formData.expectedLifetimeSales);

      if (material !== undefined && !Number.isNaN(material)) payload.standardMaterialCost = material;
      if (labor !== undefined && !Number.isNaN(labor)) payload.standardLaborCost = labor;
      if (overhead !== undefined && !Number.isNaN(overhead)) payload.standardOverheadCost = overhead;
      if (devCost !== undefined && !Number.isNaN(devCost)) payload.developmentCost = devCost;
      if (expectedSales !== undefined && !Number.isNaN(expectedSales)) payload.expectedLifetimeSales = expectedSales;

      await createProduct.mutateAsync(payload);
      router.push(`/${locale}/products`);
    } catch (error) {
      alert(tCommon('error'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? value :
        type === 'checkbox' ? (e.target as HTMLInputElement).checked :
          // category is now a string (documentId), so no parseInt needed
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
              {t('category')} *
            </label>
            <select
              name="category"
              value={formData.category || ''}
              onChange={handleChange}
              required
              disabled={categoriesLoading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">{categoriesLoading ? tCommon('loading') : selectCategoryLabel}</option>
              {categories?.map((category) => (
                <option key={category.documentId || category.id} value={category.documentId}>
                  {locale === 'ar' ? category.nameAr : category.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.category')}</p>
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

          {/* <div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>{t('sku')}:</strong> {t('hints.skuAuto')}
              </p>
            </div>
          </div> */}

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
