import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { ZakatSadaqat, StrapiResponse } from '../types';

export function useZakatRecords() {
  return useQuery({
    queryKey: ['zakat'],
    queryFn: async () => {
      const { data} = await apiClient.get<StrapiResponse<ZakatSadaqat[]>>('/zakat-sadaqats?sort=calculationDate:desc');
      return data.data;
    },
  });
}

export function useZakatRecord(id: number) {
  return useQuery({
    queryKey: ['zakat', id],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<ZakatSadaqat>>(`/zakat-sadaqats/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCalculateZakat() {
  return useQuery({
    queryKey: ['zakat', 'calculate'],
    queryFn: async () => {
      const { data } = await apiClient.post('/zakat-sadaqats/calculate');
      return data;
    },
    enabled: false, // Only run when manually triggered
  });
}
