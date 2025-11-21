'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { MetricCard } from '@/components/dashboard/metric-card';
import { RecentBatches } from '@/components/dashboard/recent-batches';
import { useDashboardStats } from '@/lib/hooks/useDashboard';
import { formatCurrency } from '@/lib/utils';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">{tCommon('loading')}</p>
      </div>
    );
  }

  const currency = locale === 'ar' ? 'ج.م' : 'EGP';
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Prepare data for charts
  const productionCostData = stats?.productionCostBreakdown ? [
    { name: t('material'), value: stats.productionCostBreakdown.material },
    { name: t('labor'), value: stats.productionCostBreakdown.labor },
    { name: t('overhead'), value: stats.productionCostBreakdown.overhead },
  ] : [];

  const directCostData = stats?.cashflowDirectCostSplit ? [
    { name: t('material'), amount: stats.cashflowDirectCostSplit.material },
    { name: t('labor'), amount: stats.cashflowDirectCostSplit.labor },
  ] : [];

  const remainingBudget = (stats?.totalCapital || 0) - (stats?.totalCashflowDirectCosts || 0); // Simplified for now

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{t('overview')}</p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Capital */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalCapital')}</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {formatCurrency(stats?.totalCapital || 0, currency)}
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{t('utilization')}</span>
              <span>{stats?.capitalUtilization?.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${Math.min(stats?.capitalUtilization || 0, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Production Costs */}
        <MetricCard
          title={t('totalProductionCosts')}
          value={formatCurrency(stats?.totalProductionCosts || 0, currency)}
        />

        {/* Total Cashflow Direct Costs */}
        <MetricCard
          title={t('totalCashflowDirectCosts')}
          value={formatCurrency(stats?.totalCashflowDirectCosts || 0, currency)}
        />

        {/* Remaining Budget */}
        <MetricCard
          title={t('remainingBudget')}
          value={formatCurrency(remainingBudget, currency)}
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Cost Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{t('productionCostBreakdown')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productionCostData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {productionCostData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: number) => formatCurrency(value, currency)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Direct Cost Split */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{t('directCostSplit')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={directCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip formatter={(value: number) => formatCurrency(value, currency)} />
                <Bar dataKey="amount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <RecentBatches />
      </div>
    </div>
  );
}
