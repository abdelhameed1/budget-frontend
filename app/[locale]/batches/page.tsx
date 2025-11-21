'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';

import { useTranslations } from 'next-intl';
import { useBatches, useCalculateBatchCosts, useCompleteBatch, useUpdateBatchStatus } from '@/lib/hooks/useBatches';
import {
  Plus, Calculator, CheckCircle, Search, Filter,
  ChevronDown, ChevronUp, TrendingUp, Package, CheckSquare, Edit2, X
} from 'lucide-react';
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
  const updateBatchStatus = useUpdateBatchStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedBatchId, setExpandedBatchId] = useState<number | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  // KPI Calculations
  const kpis = useMemo(() => {
    if (!batches || batches.length === 0) return { active: 0, planned: 0, completed: 0 };

    const active = batches.filter(b => ['in_production', 'quality_check'].includes(b.status));
    const completedThisMonth = batches.filter(b => {
      if (b.status !== 'completed') return false;
      // Use completionDate if available, otherwise fall back to updatedAt
      const dateStr = b.completionDate || b.updatedAt;
      if (!dateStr) return false;
      const date = new Date(dateStr);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    return {
      active: active.length,
      planned: active.reduce((sum, b) => sum + (b.plannedQuantity || 0), 0),
      completed: completedThisMonth.length
    };
  }, [batches]);

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    if (!batches) return [];
    return batches.filter(batch => {
      const productName = typeof batch.product === 'object' && batch.product ? batch.product.name : '';
      const matchesSearch =
        batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        productName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [batches, searchQuery, statusFilter]);

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

  const toggleExpand = (id: number) => {
    setExpandedBatchId(expandedBatchId === id ? null : id);
  };

  const openStatusModal = (batch: any, event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    setModalPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX - 250, // Position to the left of button
    });

    setSelectedBatch(batch);
    setStatusModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedBatch) return;
    try {
      await updateBatchStatus.mutateAsync({ batchDocumentId: selectedBatch.documentId, status: newStatus });
      setStatusModalOpen(false);
      setSelectedBatch(null);
      alert(tCommon('success'));
    } catch (error) {
      alert(tCommon('error'));
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusModalOpen && !(event.target as Element).closest('.status-dropdown')) {
        setStatusModalOpen(false);
      }
    };

    if (statusModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [statusModalOpen]);

  // Helper to safely get product details
  const getProductDetails = (product: any) => {
    if (typeof product === 'object' && product !== null) {
      return product;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{t('batchList')}</p>
        </div>
        <Link
          href={`/${locale}/batches/new`}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          {t('createBatch')}
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Batches</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kpis.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Planned Output</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kpis.planned}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed (Month)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kpis.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {/* <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Batch # or Product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">All Statuses</option>
            <option value="planned">{t('status.planned')}</option>
            <option value="in_production">{t('status.in_production')}</option>
            <option value="quality_check">{t('status.quality_check')}</option>
            <option value="completed">{t('status.completed')}</option>
          </select>
        </div>
      </div> */}

      {/* Batches Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">{tCommon('loading')}</div>
      ) : !filteredBatches || filteredBatches.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">{tCommon('noData')}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="w-10 px-6 py-3"></th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('batchNumber')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('product')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('startDate')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('plannedQuantity')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tCommon('status')}</th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{tCommon('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBatches.map((batch) => (
                <React.Fragment key={batch.id}>
                  <tr key={batch.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleExpand(batch.id)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {expandedBatchId === batch.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/${locale}/batches/${batch.id}`}
                        className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {batch.batchNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                      {typeof batch.product === 'object' && batch.product ? batch.product.name : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{batch.startDate ? formatDate(batch.startDate) : '-'}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{batch.plannedQuantity}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${batch.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        batch.status === 'in_production' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          batch.status === 'quality_check' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                        {t(`status.${batch.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => openStatusModal(batch, e)}
                          className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                          title="Edit Status"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {batch.status !== 'completed' && (
                          <button
                            onClick={() => handleCalculateCosts(batch.id)}
                            disabled={calculateCosts.isPending}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title={t('calculateCosts')}
                          >
                            <Calculator className="w-4 h-4" />
                          </button>
                        )}
                        {batch.status === 'quality_check' && (
                          <button
                            onClick={() => handleCompleteBatch(batch.id)}
                            disabled={completeBatch.isPending}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            title={t('completeBatch')}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Details Section */}
                  {expandedBatchId === batch.id && (
                    <tr className="bg-gray-50 dark:bg-gray-800/30">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Cost Comparison */}
                          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Cost Analysis</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Standard Cost (Per Unit)</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {(() => {
                                    const p = getProductDetails(batch.product);
                                    return p
                                      ? formatCurrency(
                                        (Number(p.standardMaterialCost) || 0) +
                                        (Number(p.standardLaborCost) || 0) +
                                        (Number(p.standardOverheadCost) || 0),
                                        locale === 'ar' ? 'ج.م' : 'EGP'
                                      )
                                      : '-';
                                  })()}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Actual Cost (Per Unit)</span>
                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                  {formatCurrency(batch.costPerUnit, locale === 'ar' ? 'ج.م' : 'EGP')}
                                </span>
                              </div>
                              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between text-sm font-semibold">
                                <span className="text-gray-900 dark:text-gray-100">Total Batch Cost</span>
                                <span className="text-green-600 dark:text-green-400">
                                  {formatCurrency(batch.totalCost, locale === 'ar' ? 'ج.م' : 'EGP')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Direct Costs List */}
                          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Direct Costs Breakdown</h4>
                            {batch.directCosts && batch.directCosts.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                      <th className="pb-2">Type</th>
                                      <th className="pb-2">Description</th>
                                      <th className="pb-2 text-right">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {batch.directCosts.map((cost, idx) => (
                                      <tr key={idx}>
                                        <td className="py-2 capitalize text-gray-600 dark:text-gray-300">{cost.costType}</td>
                                        <td className="py-2 text-gray-600 dark:text-gray-300">{cost.description}</td>
                                        <td className="py-2 text-right font-medium text-gray-900 dark:text-gray-100">
                                          {formatCurrency(Number(cost.totalCost) || 0, locale === 'ar' ? 'ج.م' : 'EGP')}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400 italic">No direct costs recorded.</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Status Update Dropdown */}
      {statusModalOpen && selectedBatch && (
        <div
          className="status-dropdown fixed bg-white dark:bg-gray-900 rounded-lg p-4 w-64 border border-gray-200 dark:border-gray-700 shadow-xl z-[9999]"
          style={{
            top: `${modalPosition.top}px`,
            left: `${modalPosition.left}px`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Update Status
            </h4>
            <button
              onClick={() => setStatusModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {selectedBatch.batchNumber}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Current: <span className="font-medium">{t(`status.${selectedBatch.status}`)}</span>
            </p>
          </div>

          <div className="space-y-1">
            {['planned', 'in_production', 'quality_check', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                disabled={updateBatchStatus.isPending || status === selectedBatch.status}
                className={`w-full px-3 py-2 rounded text-sm text-left transition-colors ${status === selectedBatch.status
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-900 dark:text-gray-100'
                  }`}
              >
                {t(`status.${status}`)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

