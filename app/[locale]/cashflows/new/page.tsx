'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCreateCashflow } from '@/lib/hooks/useCashflows';
import { useOwners } from '@/lib/hooks/useOwners';
import type { Cashflow } from '@/lib/types';

export default function NewCashflowPage() {
  const router = useRouter();
  const locale = useLocale();
  const createMutation = useCreateCashflow();
  const { data: owners } = useOwners();

  const [form, setForm] = useState<{
    transactionDate: string;
    type: Cashflow['type'];
    category: Cashflow['category'];
    ownerId?: string;
    description: string;
    amount: number;
    paymentMethod: Cashflow['paymentMethod'];
    isPaid: boolean;
    reference?: string;
    supplier?: string;
    invoiceNumber?: string;
    dueDate?: string;
    notes?: string;
  }>({
    transactionDate: new Date().toISOString().slice(0, 10),
    type: 'owner_investment',
    category: 'owner_investment',
    ownerId: '',
    description: '',
    amount: 0,
    paymentMethod: 'cash',
    isPaid: true,
    reference: '',
    supplier: '',
    invoiceNumber: '',
    dueDate: undefined,
    notes: '',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { ownerId, ...rest } = form;
    await createMutation.mutateAsync({
      ...rest,
      amount: Number(form.amount),
      owner: ownerId ? Number(ownerId) : undefined,
    });
    router.push(`/${locale}/cashflows`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">New Cash Flow Entry</h1>
      <form onSubmit={onSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-sm">
            <span className="text-gray-600 dark:text-gray-400 mb-1">Date</span>
            <input type="date" value={form.transactionDate} onChange={e => setForm(f => ({ ...f, transactionDate: e.target.value }))} className="input" required />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-600 dark:text-gray-400 mb-1">Type</span>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as Cashflow['type'] }))} className="input">
              <option value="owner_investment">Owner Investment</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-600 dark:text-gray-400 mb-1">Owner (optional)</span>
            <select
              value={form.ownerId || ''}
              onChange={e => setForm(f => ({ ...f, ownerId: e.target.value }))}
              className="input"
            >
              <option value="">No specific owner</option>
              {owners?.map((owner) => (
                <option key={owner.id} value={owner.id}>{owner.ownerName || `Owner #${owner.id}`}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="text-gray-600 dark:text-gray-400 mb-1">Category</span>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Cashflow['category'] }))} className="input">
              <optgroup label="Owner">
                <option value="owner_investment">Owner Investment</option>
              </optgroup>
              <optgroup label="Operating">
                <option value="material_purchase">Material Purchase</option>
                <option value="labor_payment">Labor Payment</option>
                <option value="overhead_fixed">Overhead Fixed</option>
                <option value="overhead_variable">Overhead Variable</option>
              </optgroup>
              <optgroup label="Other">
                <option value="zakat">Zakat</option>
                <option value="sadaqat">Sadaqat</option>
                <option value="owner_draw">Owner Draw</option>
                <option value="other">Other</option>
              </optgroup>
            </select>
          </label>
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="text-gray-600 dark:text-gray-400 mb-1">Description</span>
            <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input" required />
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-600 dark:text-gray-400 mb-1">Amount</span>
            <input type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} className="input" required />
          </label>
          <label className="flex items-center gap-2 text-sm mt-6">
            <input type="checkbox" checked={form.isPaid} onChange={e => setForm(f => ({ ...f, isPaid: e.target.checked }))} />
            <span className="text-gray-700 dark:text-gray-300">Paid</span>
          </label>
          <label className="flex flex-col text-sm">
            <span className="text-gray-600 dark:text-gray-400 mb-1">Payment Method</span>
            <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value as Cashflow['paymentMethod'] }))} className="input">
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit">Credit</option>
              <option value="other">Other</option>
            </select>
          </label>
          {/* <label className="flex flex-col text-sm">
            <span className="text-gray-600 dark:text-gray-400 mb-1">Supplier</span>
            <input type="text" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} className="input" />
          </label> */}
          {/* <label className="flex flex-col text-sm">
            <span className="text-gray-600 dark:text-gray-400 mb-1">Invoice #</span>
            <input type="text" value={form.invoiceNumber} onChange={e => setForm(f => ({ ...f, invoiceNumber: e.target.value }))} className="input" />
          </label> */}
          <label className="flex flex-col text-sm">
            <span className="text-gray-600 dark:text-gray-400 mb-1">Due Date</span>
            <input type="date" value={form.dueDate || ''} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="input" />
          </label>
          <label className="flex flex-col text-sm md:col-span-2">
            <span className="text-gray-600 dark:text-gray-400 mb-1">Notes</span>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="input" rows={3} />
          </label>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="px-4 py-2 border rounded-lg" onClick={() => router.push(`/${locale}/cashflows`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
