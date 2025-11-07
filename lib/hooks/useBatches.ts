import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Batch, StrapiResponse } from '@/lib/types';

export function useBatches() {
  return useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Batch[]>>('/batches?populate=product,directCosts');
      return data.data;
    },
  });
}

export function useBatch(id: number) {
  return useQuery({
    queryKey: ['batches', id],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Batch>>(`/batches/${id}?populate=product,directCosts`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchData: Partial<Batch>) => {
      const { data } = await apiClient.post<StrapiResponse<Batch>>('/batches', {
        data: batchData,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function useCalculateBatchCosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchId: number) => {
      const { data } = await apiClient.post(`/batches/${batchId}/calculate-costs`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function useCompleteBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchId: number) => {
      const { data } = await apiClient.post(`/batches/${batchId}/complete`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
