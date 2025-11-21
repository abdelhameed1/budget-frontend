import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { StrapiResponse, Owner, OwnerInvestmentSummary, InvestmentDashboardStats, Cashflow } from '../types';

export function useOwners(activeOnly = false) {
  return useQuery({
    queryKey: ['owners', { activeOnly }],
    queryFn: async () => {
      const query = activeOnly ? '?filters[isActive][$eq]=true' : '';
      const { data } = await apiClient.get<StrapiResponse<Owner[]>>(`/owners${query}`);
      return data.data;
    },
  });
}

export function useOwner(id: number) {
  return useQuery({
    queryKey: ['owners', id],
    queryFn: async () => {
      const { data } = await apiClient.get<StrapiResponse<Owner>>(`/owners/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateOwner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Owner>) => {
      const { data } = await apiClient.post<StrapiResponse<Owner>>('/owners', { data: payload });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      queryClient.invalidateQueries({ queryKey: ['investment-dashboard'] });
    },
  });
}

export function useUpdateOwner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Owner> & { id: number }) => {
      const { data } = await apiClient.put<StrapiResponse<Owner>>(`/owners/${id}`, { data: payload });
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      queryClient.invalidateQueries({ queryKey: ['owners', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['investment-dashboard'] });
    },
  });
}

export function useDeleteOwner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/owners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      queryClient.invalidateQueries({ queryKey: ['investment-dashboard'] });
    },
  });
}

// Get investment summary for all owners
export function useInvestmentDashboard() {
  return useQuery({
    queryKey: ['investment-dashboard'],
    queryFn: async () => {
      // Fetch active owners (with totalInvestment maintained by backend) and expense cashflows
      const [ownersRes, cashflowsRes] = await Promise.all([
        apiClient.get<StrapiResponse<Owner[]>>('/owners?filters[isActive][$eq]=true'),
        apiClient.get<StrapiResponse<Cashflow[]>>(
          '/cashflows?filters[type][$eq]=expense'
        ),
      ]);

      const owners = ownersRes.data.data;
      const cashflows = cashflowsRes.data.data;

      // Calculate totals
      const totalCapital = owners.reduce((sum, owner) => sum + (owner.totalInvestment || 0), 0);
      
      // Calculate cost breakdown
      const costBreakdown = {
        materials: 0,
        labor: 0,
        overheadFixed: 0,
        overheadVariable: 0,
        other: 0,
      };

      let totalCostsIncurred = 0;

      cashflows.forEach((cf) => {
        // All fetched cashflows are expenses (type = 'expense')
        totalCostsIncurred += cf.amount;
        
        switch (cf.category) {
          case 'material_purchase':
            costBreakdown.materials += cf.amount;
            break;
          case 'labor_payment':
            costBreakdown.labor += cf.amount;
            break;
          case 'overhead_fixed':
            costBreakdown.overheadFixed += cf.amount;
            break;
          case 'overhead_variable':
            costBreakdown.overheadVariable += cf.amount;
            break;
          default:
            costBreakdown.other += cf.amount;
        }
      });

      const remainingCapital = totalCapital - totalCostsIncurred;
      const utilizationRate = totalCapital > 0 ? (totalCostsIncurred / totalCapital) * 100 : 0;

      // Calculate per-owner summaries
      const ownerSummaries: OwnerInvestmentSummary[] = owners.map(owner => {
        const totalInvested = owner.totalInvestment || 0;

        // Allocate costs proportionally based on how much each owner actually invested
        const allocatedCosts = totalCapital > 0 && totalInvested > 0
          ? (totalCostsIncurred * totalInvested) / totalCapital
          : 0;
        
        const remainingBudget = totalInvested - allocatedCosts;
        const utilizationPercentage = totalInvested > 0 ? (allocatedCosts / totalInvested) * 100 : 0;

        return {
          owner,
          totalInvested,
          allocatedCosts,
          remainingBudget,
          utilizationPercentage,
        };
      });

      const stats: InvestmentDashboardStats = {
        totalCapital,
        totalCostsIncurred,
        remainingCapital,
        utilizationRate,
        ownerSummaries,
        costBreakdown,
      };

      return stats;
    },
  });
}
