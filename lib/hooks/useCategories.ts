import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { StrapiResponse } from '@/lib/types';

export interface Category {
  id: number;
  name: string;
  nameAr: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Category[]>>('/categories?filters[isActive][$eq]=true&sort=name:asc');
      return data.data;
    },
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Category>>(`/categories/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: Partial<Category>) => {
      const { data } = await apiClient.post<StrapiResponse<Category>>('/categories', {
        data: categoryData,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
