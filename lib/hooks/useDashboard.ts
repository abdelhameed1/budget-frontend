import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { DashboardStats, StrapiResponse } from '../types';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      // Fetch all necessary data for dashboard
      const [salesRes, batchesRes, inventoryRes] = await Promise.all([
        apiClient.get<StrapiResponse<any[]>>('/sales?populate[product]=*&populate[batch]=*&sort=saleDate:desc&pagination[limit]=5'),
        apiClient.get<StrapiResponse<any[]>>('/batches?populate[product]=*&sort=startDate:desc&pagination[limit]=5'),
        apiClient.get<StrapiResponse<any[]>>('/inventories?populate[product]=*&filters[quantityOnHand][$lte]=10&sort=quantityOnHand:asc'),
      ]);

      const sales = salesRes.data.data;
      const batches = batchesRes.data.data;
      const lowStockItems = inventoryRes.data.data;

      // Calculate totals
      const totalRevenue = sales.reduce((sum: number, sale: any) => sum + (sale.totalRevenue || 0), 0);
      const totalCosts = batches.reduce((sum: number, batch: any) => sum + (batch.totalCost || 0), 0);
      const grossProfit = sales.reduce((sum: number, sale: any) => sum + (sale.grossProfit || 0), 0);
      const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

      const stats: DashboardStats = {
        totalRevenue,
        totalCosts,
        grossProfit,
        profitMargin,
        recentBatches: batches,
        recentSales: sales,
        lowStockItems,
      };

      return stats;
    },
  });
}
