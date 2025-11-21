import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { DashboardStats } from '../types';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      // Fetch aggregated stats from backend
      // The backend returns the exact DashboardStats structure
      const { data } = await apiClient.get<DashboardStats>('/dashboard/stats');
      return data;
    },
  });
}
