'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCreateSale } from '@/lib/hooks/useSales';
import { useProducts } from '@/lib/hooks/useProducts';
import { useBatches } from '@/lib/hooks/useBatches';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function NewSalePage() {
  const t = useTranslations('sales');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const createSale = useCreateSale();
  const { data: products } = useProducts();
  const { data: batches } = useBatches();

  const [formData, setFormData] = useState({
    saleDate: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    product: '',
    batch: '',
    quantity: 0,
    sellingPricePerUnit: 0,
    customer: '',
    paymentMethod: 'cash' as 'cash' | 'bank_transfer' | 'credit' | 'installment' | 'other',
    paymentStatus: 'paid' as 'paid' | 'partial' | 'pending',
    amountPaid: 0,
    notes: '',
  });

  const [availableBatches, setAvailableBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [calculatedValues, setCalculatedValues] = useState({
    totalRevenue: 0,
    totalCOGS: 0,
    grossProfit: 0,
    grossMarginPercent: 0,
    amountDue: 0,
  });

  // Filter batches by selected product
  useEffect(() => {
    if (formData.product && batches) {
      const filtered = batches.filter(
        batch => {
          const productId = typeof batch.product === 'object' && batch.product !== null 
            ? batch.product.id 
            : batch.product;
          return productId === parseInt(formData.product) && 
                 batch.status === 'completed' &&
                 batch.costPerUnit > 0;
        }
      );
      setAvailableBatches(filtered);
      
      // Reset batch selection if current batch is not in filtered list
      if (formData.batch && !filtered.find(b => b.id === parseInt(formData.batch))) {
        setFormData(prev => ({ ...prev, batch: '' }));
        setSelectedBatch(null);
      }
    } else {
      setAvailableBatches([]);
    }
  }, [formData.product, batches]);

  // Update selected batch
  useEffect(() => {
    if (formData.batch && batches) {
      const batch = batches.find(b => b.id === parseInt(formData.batch));
      setSelectedBatch(batch || null);
    } else {
      setSelectedBatch(null);
    }
  }, [formData.batch, batches]);

  // Calculate values
  useEffect(() => {
    const totalRevenue = formData.quantity * formData.sellingPricePerUnit;
    const costPerUnit = selectedBatch?.costPerUnit || 0;
    const totalCOGS = formData.quantity * costPerUnit;
    const grossProfit = totalRevenue - totalCOGS;
    const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const amountDue = totalRevenue - formData.amountPaid;

    setCalculatedValues({
      totalRevenue,
      totalCOGS,
      grossProfit,
      grossMarginPercent,
      amountDue,
    });
  }, [formData.quantity, formData.sellingPricePerUnit, formData.amountPaid, selectedBatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBatch) {
      alert('Please select a completed batch with calculated costs');
      return;
    }

    try {
      const saleData = {
        ...formData,
        product: parseInt(formData.product),
        batch: parseInt(formData.batch),
        totalRevenue: calculatedValues.totalRevenue,
        costPerUnit: selectedBatch.costPerUnit,
        totalCOGS: calculatedValues.totalCOGS,
        grossProfit: calculatedValues.grossProfit,
        grossMarginPercent: calculatedValues.grossMarginPercent,
        amountDue: calculatedValues.amountDue,
      };
      
      await createSale.mutateAsync(saleData);
      router.push(`/${locale}/sales`);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/sales`}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('createSale')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('saleDetails')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sale Information */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Sale Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('invoiceNumber')} *
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                required
                placeholder="INV-001"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('saleDate')} *
              </label>
              <input
                type="date"
                name="saleDate"
                value={formData.saleDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {tCommon('products')} *
              </label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="">Select a product</option>
                {products?.filter(p => p.isActive).map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Batch (Completed) *
              </label>
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                required
                disabled={!formData.product || availableBatches.length === 0}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50"
              >
                <option value="">Select a batch</option>
                {availableBatches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.batchNumber} - CPU: {formatCurrency(batch.costPerUnit, locale === 'ar' ? 'ج.م' : 'EGP')}
                  </option>
                ))}
              </select>
              {formData.product && availableBatches.length === 0 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  No completed batches available for this product
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {tCommon('quantity')} *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('sellingPricePerUnit')} *
              </label>
              <input
                type="number"
                name="sellingPricePerUnit"
                value={formData.sellingPricePerUnit}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('customer')}
              </label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Payment Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('paymentMethod')} *
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="cash">{t('paymentMethods.cash')}</option>
                <option value="bank_transfer">{t('paymentMethods.bank_transfer')}</option>
                <option value="credit">{t('paymentMethods.credit')}</option>
                <option value="installment">{t('paymentMethods.installment')}</option>
                <option value="other">{t('paymentMethods.other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('paymentStatus')} *
              </label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="paid">{t('paymentStatuses.paid')}</option>
                <option value="partial">{t('paymentStatuses.partial')}</option>
                <option value="pending">{t('paymentStatuses.pending')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('amountPaid')}
              </label>
              <input
                type="number"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                min="0"
                step="0.01"
                max={calculatedValues.totalRevenue}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
              />
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
            </div>
          </div>
        </div>

        {/* Calculated Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Sale Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalRevenue')}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(calculatedValues.totalRevenue, locale === 'ar' ? 'ج.م' : 'EGP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('cogs')}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(calculatedValues.totalCOGS, locale === 'ar' ? 'ج.م' : 'EGP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('grossProfit')}</p>
              <p className={`text-xl font-bold ${calculatedValues.grossProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(calculatedValues.grossProfit, locale === 'ar' ? 'ج.م' : 'EGP')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('grossMargin')}</p>
              <p className={`text-xl font-bold ${calculatedValues.grossMarginPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {calculatedValues.grossMarginPercent.toFixed(1)}%
              </p>
            </div>
          </div>

          {calculatedValues.amountDue > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('amountDue')}:</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(calculatedValues.amountDue, locale === 'ar' ? 'ج.م' : 'EGP')}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={createSale.isPending || !selectedBatch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {createSale.isPending ? tCommon('loading') : tCommon('save')}
          </button>
          <Link
            href={`/${locale}/sales`}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {tCommon('cancel')}
          </Link>
        </div>
      </form>
    </div>
  );
}
