import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Cashflow, StrapiResponse } from '../types';

export function useCashflows(params?: {
  startDate?: string;
  endDate?: string;
  type?: 'owner_investment' | 'expense';
  category?: string;
  isPaid?: boolean;
  ownerId?: number;
}) {
  const query = new URLSearchParams();
  if (params?.startDate || params?.endDate) {
    if (params.startDate) query.append('filters[transactionDate][$gte]', params.startDate);
    if (params.endDate) query.append('filters[transactionDate][$lte]', params.endDate);
  }
  if (params?.type) query.append('filters[type][$eq]', params.type);
  if (params?.category) query.append('filters[category][$eq]', params.category);
  if (params?.ownerId !== undefined) query.append('filters[owner][id][$eq]', String(params.ownerId));
  if (params?.isPaid !== undefined) query.append('filters[isPaid][$eq]', String(params.isPaid));
  query.append('sort', 'transactionDate:desc');

  return useQuery({
    queryKey: ['cashflows', Object.fromEntries(query)],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Cashflow[]>>(`/cashflows?${query.toString()}`);
      return data.data;
    },
  });
}

export function useCashflow(id: number) {
  return useQuery({
    queryKey: ['cashflows', id],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Cashflow>>(`/cashflows/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateCashflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Cashflow>) => {
      const { data } = await apiClient.post<StrapiResponse<Cashflow>>('/cashflows', { data: payload });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashflows'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateCashflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Cashflow> & { id: number }) => {
      const { data } = await apiClient.put<StrapiResponse<Cashflow>>(`/cashflows/${id}`, { data: payload });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cashflows'] });
      queryClient.invalidateQueries({ queryKey: ['cashflows', variables.id] });
    },
  });
}

export function useDeleteCashflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/cashflows/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashflows'] });
    },
  });
}
