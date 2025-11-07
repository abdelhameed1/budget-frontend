// Strapi Response Types
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// Product Types
export interface Product extends StrapiEntity {
  name: string;
  sku: string;
  description?: string;
  category: 'clothing' | 'accessories' | 'home' | 'other';
  targetSellingPrice: number;
  standardMaterialCost: number;
  standardLaborCost: number;
  standardOverheadCost: number;
  lifecycleStage: 'development' | 'launch' | 'growth' | 'maturity' | 'decline';
  developmentCost: number;
  expectedLifetimeSales: number;
  isActive: boolean;
  notes?: string;
}

// Batch Types
export interface Batch extends StrapiEntity {
  batchNumber: string;
  product?: Product;
  plannedQuantity: number;
  actualQuantity: number;
  status: 'planned' | 'in_production' | 'quality_check' | 'completed' | 'cancelled';
  startDate?: string;
  completionDate?: string;
  productionHours: number;
  productionDays: number;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalOverheadCost: number;
  totalCost: number;
  costPerUnit: number;
  overheadRateApplied: 'high' | 'medium' | 'low' | 'standard';
  directCosts?: DirectCost[];
  notes?: string;
}

// Direct Cost Types
export interface DirectCost extends StrapiEntity {
  batch?: Batch;
  costType: 'material' | 'labor';
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  purchaseDate?: string;
  invoiceNumber?: string;
  notes?: string;
}

// Overhead Cost Types
export interface OverheadCost extends StrapiEntity {
  description: string;
  category: 'packaging' | 'logistics' | 'rent' | 'utilities' | 'salaries' | 'marketing' | 'admin' | 'other';
  costType: 'fixed' | 'variable';
  amount: number;
  date: string;
  isPrepaid: boolean;
  prepaidAssetValue: number;
  amortizationPeriod: number;
  amortizedAmount: number;
  remainingValue: number;
  supplier?: string;
  invoiceNumber?: string;
  allocatedToBatch: boolean;
  notes?: string;
}

// Overhead Rate Types
export interface OverheadRate extends StrapiEntity {
  name: string;
  rateType: 'high' | 'medium' | 'low' | 'standard';
  ratePerUnit: number;
  ratePerHour: number;
  applicableStage: 'launch' | 'growth' | 'maturity' | 'all';
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  description?: string;
  notes?: string;
}

// Budget Plan Types
export interface BudgetPlan extends StrapiEntity {
  name: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  budgetedRevenue: number;
  actualRevenue: number;
  budgetedDirectMaterial: number;
  actualDirectMaterial: number;
  budgetedDirectLabor: number;
  actualDirectLabor: number;
  budgetedFixedOverhead: number;
  actualFixedOverhead: number;
  budgetedVariableOverhead: number;
  actualVariableOverhead: number;
  budgetedUnits: number;
  actualUnits: number;
  status: 'draft' | 'active' | 'closed';
  notes?: string;
}

// Transaction Types
export interface Transaction extends StrapiEntity {
  transactionDate: string;
  type: 'revenue' | 'expense';
  category: 'sales' | 'material_purchase' | 'labor_payment' | 'overhead_fixed' | 'overhead_variable' | 'zakat' | 'sadaqat' | 'other';
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'credit' | 'other';
  reference?: string;
  supplier?: string;
  customer?: string;
  invoiceNumber?: string;
  isPaid: boolean;
  dueDate?: string;
  notes?: string;
}

// Inventory Types
export interface Inventory extends StrapiEntity {
  product?: Product;
  batch?: Batch;
  quantityOnHand: number;
  quantitySold: number;
  unitCost: number;
  totalValue: number;
  valuationMethod: 'fifo' | 'weighted_average' | 'specific_identification';
  location: string;
  lastUpdated?: string;
  notes?: string;
}

// Sale Types
export interface Sale extends StrapiEntity {
  saleDate: string;
  invoiceNumber: string;
  product?: Product;
  batch?: Batch;
  quantity: number;
  sellingPricePerUnit: number;
  totalRevenue: number;
  costPerUnit: number;
  totalCOGS: number;
  grossProfit: number;
  grossMarginPercent: number;
  customer?: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'credit' | 'installment' | 'other';
  paymentStatus: 'paid' | 'partial' | 'pending';
  amountPaid: number;
  amountDue: number;
  notes?: string;
}

// Zakat & Sadaqat Types
export interface ZakatSadaqat extends StrapiEntity {
  type: 'zakat' | 'sadaqat';
  calculationMethod: 'net_assets' | 'net_profit' | 'fixed_amount';
  hijriYear?: string;
  gregorianYear: number;
  calculationDate: string;
  zakatableAssets: number;
  cash: number;
  receivables: number;
  inventory: number;
  liabilities: number;
  netZakatableAssets: number;
  nisabThreshold: number;
  isAboveNisab: boolean;
  zakatRate: number;
  calculatedAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentDate?: string;
  status: 'calculated' | 'partially_paid' | 'fully_paid';
  notes?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  profitMargin: number;
  recentBatches: Batch[];
  recentSales: Sale[];
  lowStockItems: Inventory[];
}
