import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Batch, StrapiResponse } from '@/lib/types';

export function useBatches() {
  return useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Batch[]>>('/batches?populate[product]=true&populate[directCosts]=true');
      return data.data;
    },
  });
}

export function useBatch(id: number) {
  return useQuery({
    queryKey: ['batches', id],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Batch>>(`/batches/${id}?populate[product]=true&populate[directCosts]=true`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ batchData, directCosts }: { batchData: Partial<Batch>, directCosts?: any[] }) => {
      // 1. Create the Batch
      const { data: batchRes } = await apiClient.post<StrapiResponse<Batch>>('/batches', {
        data: batchData,
      });
      const newBatch = batchRes.data;

      // 2. Create Direct Costs if any
      if (directCosts && directCosts.length > 0) {
        await Promise.all(directCosts.map(cost =>
          apiClient.post('/direct-costs', {
            data: {
              ...cost,
              batch: newBatch.documentId, // Link to the new batch
            }
          })
        ));
      }

      return newBatch;
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
