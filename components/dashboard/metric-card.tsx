'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import { formatCurrency } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  isCurrency?: boolean;
}

export function MetricCard({ title, value, trend, trendUp, isCurrency = true }: MetricCardProps) {
  const locale = useLocale();
  
  const displayValue = isCurrency && typeof value === 'number' 
    ? formatCurrency(value, locale === 'ar' ? 'ج.م' : 'EGP')
    : value;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        {trend && (
          <span className={`flex items-center gap-1 text-sm font-medium ${
            trendUp ? 'text-green-600' : 'text-red-600'
          }`}>
            {trendUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{displayValue}</p>
    </div>
  );
}
