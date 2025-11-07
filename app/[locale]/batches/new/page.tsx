'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCreateBatch } from '@/lib/hooks/useBatches';
import { useProducts } from '@/lib/hooks/useProducts';
import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface DirectCostInput {
  costType: 'material' | 'labor';
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  supplier?: string;
  purchaseDate?: string;
  invoiceNumber?: string;
}

export default function NewBatchPage() {
  const t = useTranslations('batches');
  const tCosts = useTranslations('costs');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const createBatch = useCreateBatch();
  const { data: products } = useProducts();

  const [formData, setFormData] = useState({
    batchNumber: '',
    product: '',
    plannedQuantity: 0,
    actualQuantity: 0,
    status: 'planned' as 'planned' | 'in_production' | 'quality_check' | 'completed' | 'cancelled',
    startDate: new Date().toISOString().split('T')[0],
    productionHours: 0,
    productionDays: 0,
    notes: '',
  });

  const [directCosts, setDirectCosts] = useState<DirectCostInput[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const batchData = {
        ...formData,
        product: parseInt(formData.product),
      };
      await createBatch.mutateAsync(batchData);
      router.push(`/${locale}/batches`);
    } catch (error) {
      alert(tCommon('error'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const addDirectCost = () => {
    setDirectCosts(prev => [...prev, {
      costType: 'material',
      description: '',
      quantity: 0,
      unit: '',
      unitCost: 0,
      supplier: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      invoiceNumber: '',
    }]);
  };

  const removeDirectCost = (index: number) => {
    setDirectCosts(prev => prev.filter((_, i) => i !== index));
  };

  const updateDirectCost = (index: number, field: keyof DirectCostInput, value: any) => {
    setDirectCosts(prev => prev.map((cost, i) => 
      i === index ? { ...cost, [field]: value } : cost
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/batches`}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('createBatch')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('batchDetails')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Batch Information */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('sections.batchInfo')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('sections.batchInfoHint')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('batchNumber')} *
              </label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                required
                placeholder="B-001"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.batchNumber')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('product')} *
              </label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">Select a product</option>
                {products?.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.product')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('plannedQuantity')} *
              </label>
              <input
                type="number"
                name="plannedQuantity"
                value={formData.plannedQuantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.plannedQuantity')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('actualQuantity')}
              </label>
              <input
                type="number"
                name="actualQuantity"
                value={formData.actualQuantity}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.actualQuantity')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {tCommon('status')} *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="planned">{t('status.planned')}</option>
                <option value="in_production">{t('status.in_production')}</option>
                <option value="quality_check">{t('status.quality_check')}</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.status')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('startDate')}
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.startDate')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('productionHours')}
              </label>
              <input
                type="number"
                name="productionHours"
                value={formData.productionHours}
                onChange={handleChange}
                min="0"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.productionHours')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('productionDays')}
              </label>
              <input
                type="number"
                name="productionDays"
                value={formData.productionDays}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('hints.productionDays')}</p>
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
        </div>

        {/* Direct Costs (Optional - can be added later) */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{t('sections.directCostsSection')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('sections.directCostsHint')}</p>
            </div>
            <button
              type="button"
              onClick={addDirectCost}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('addCost')}
            </button>
          </div>

          {directCosts.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No direct costs added yet. You can add them later after creating the batch.
            </p>
          ) : (
            <div className="space-y-4">
              {directCosts.map((cost, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Cost #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeDirectCost(index)}
                      className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {tCosts('costType')}
                      </label>
                      <select
                        value={cost.costType}
                        onChange={(e) => updateDirectCost(index, 'costType', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="material">{tCosts('types.material')}</option>
                        <option value="labor">{tCosts('types.labor')}</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {tCommon('description')}
                      </label>
                      <input
                        type="text"
                        value={cost.description}
                        onChange={(e) => updateDirectCost(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {tCommon('quantity')}
                      </label>
                      <input
                        type="number"
                        value={cost.quantity}
                        onChange={(e) => updateDirectCost(index, 'quantity', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {tCosts('unit')}
                      </label>
                      <input
                        type="text"
                        value={cost.unit}
                        onChange={(e) => updateDirectCost(index, 'unit', e.target.value)}
                        placeholder="kg, meter, hour"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {tCosts('unitCost')}
                      </label>
                      <input
                        type="number"
                        value={cost.unitCost}
                        onChange={(e) => updateDirectCost(index, 'unitCost', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Cost:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {(cost.quantity * cost.unitCost).toFixed(2)} {locale === 'ar' ? 'ج.م' : 'EGP'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={createBatch.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {createBatch.isPending ? tCommon('loading') : tCommon('save')}
          </button>
          <Link
            href={`/${locale}/batches`}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {tCommon('cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}
