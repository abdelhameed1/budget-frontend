import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Sale, StrapiResponse } from '../types';

export function useSales() {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Sale[]>>('/sales?populate[product]=*&populate[batch]=*&sort=saleDate:desc');
      return data.data;
    },
  });
}

export function useSale(id: number) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Sale>>(`/sales/${id}?populate[product]=*&populate[batch]=*`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (saleData: Partial<Sale>) => {
      const { data } = await apiClient.post<StrapiResponse<Sale>>('/sales', { data: saleData });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...saleData }: Partial<Sale> & { id: number }) => {
      const { data } = await apiClient.put<StrapiResponse<Sale>>(`/sales/${id}`, { data: saleData });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['sales', variables.id] });
    },
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/sales/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
  });
}
