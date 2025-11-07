import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { OverheadRate, StrapiResponse } from '../types';

export function useOverheadRates() {
  return useQuery({
    queryKey: ['overhead-rates'],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<OverheadRate[]>>('/overhead-rates?sort=effectiveFrom:desc');
      return data.data;
    },
  });
}

export function useOverheadRate(id: number) {
  return useQuery({
    queryKey: ['overhead-rates', id],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<OverheadRate>>(`/overhead-rates/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateOverheadRate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (rateData: Partial<OverheadRate>) => {
      const { data } = await apiClient.post<StrapiResponse<OverheadRate>>('/overhead-rates', { data: rateData });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overhead-rates'] });
    },
  });
}

export function useUpdateOverheadRate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...rateData }: Partial<OverheadRate> & { id: number }) => {
      const { data } = await apiClient.put<StrapiResponse<OverheadRate>>(`/overhead-rates/${id}`, { data: rateData });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['overhead-rates'] });
      queryClient.invalidateQueries({ queryKey: ['overhead-rates', variables.id] });
    },
  });
}

export function useDeleteOverheadRate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/overhead-rates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overhead-rates'] });
    },
  });
}
