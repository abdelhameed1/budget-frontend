import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Inventory, StrapiResponse } from '../types';

export function useInventory() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Inventory[]>>('/inventories?populate=product,batch&sort=product.name:asc');
      return data.data;
    },
  });
}

export function useInventoryItem(id: number) {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Inventory>>(`/inventories/${id}?populate=product,batch`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useLowStockItems(threshold: number = 10) {
  return useQuery({
    queryKey: ['inventory', 'low-stock', threshold],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Inventory[]>>(
        `/inventories?populate=product,batch&filters[quantityOnHand][$lte]=${threshold}&sort=quantityOnHand:asc`
      );
      return data.data;
    },
  });
}
