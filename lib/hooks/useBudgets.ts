import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { BudgetPlan, StrapiResponse } from '../types';

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<BudgetPlan[]>>('/budget-plans?sort=startDate:desc');
      return data.data;
    },
  });
}

export function useBudget(id: number) {
  return useQuery({
    queryKey: ['budgets', id],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<BudgetPlan>>(`/budget-plans/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (budgetData: Partial<BudgetPlan>) => {
      const { data } = await apiClient.post<StrapiResponse<BudgetPlan>>('/budget-plans', { data: budgetData });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...budgetData }: Partial<BudgetPlan> & { id: number }) => {
      const { data } = await apiClient.put<StrapiResponse<BudgetPlan>>(`/budget-plans/${id}`, { data: budgetData });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budgets', variables.id] });
    },
  });
}

export function useCalculateVariances(id: number) {
  return useQuery({
    queryKey: ['budgets', id, 'variances'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/budget-plans/${id}/calculate-variances`);
      return data;
    },
    enabled: !!id,
  });
}
