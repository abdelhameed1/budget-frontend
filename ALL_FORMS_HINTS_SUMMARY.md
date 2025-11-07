# All Forms Hints Implementation Summary

## Status Overview

### ✅ Completed
1. **Product Form** - Fully implemented with all hints and translations
2. **Batch Form** - Fully implemented with all hints and translations

### 🔄 In Progress
3. **Sales Form** - Translations added, form update pending
4. **Budget Form** - Pending
5. **Overhead Rate Form** - Pending

---

## Completed Forms

### 1. Product Form ✅
**File:** `app/[locale]/products/new/page.tsx`

**Sections:**
- Basic Information (with hint)
- Pricing & Standard Costs (with hint)
- Development & Projections (with hint)

**Fields with Hints:** 13 fields
- name, sku, description, category, lifecycleStage
- targetPrice, materialCost, laborCost, overheadCost
- developmentCost, expectedSales, isActive, notes

**Translation Keys Added:**
- `products.sections.*` (3 sections)
- `products.hints.*` (13 hints)

---

### 2. Batch Form ✅
**File:** `app/[locale]/batches/new/page.tsx`

**Sections:**
- Batch Information (with hint)
- Direct Costs (Optional) (with hint)

**Fields with Hints:** 9 fields
- batchNumber, product, plannedQuantity, actualQuantity
- status, startDate, productionHours, productionDays, notes

**Translation Keys Added:**
- `batches.sections.*` (2 sections)
- `batches.hints.*` (13 hints including direct cost fields)

---

## Remaining Translations to Add

### 3. Sales Form (Arabic translations needed)

Add to `messages/ar.json`:

```json
"sales": {
  "sections": {
    "saleInfo": "معلومات البيع",
    "saleInfoHint": "سجل تفاصيل معاملة البيع واربطها بدفعة المنتج",
    "paymentInfo": "معلومات الدفع",
    "paymentInfoHint": "تتبع طريقة الدفع والحالة والمبالغ المستلمة",
    "summary": "ملخص البيع",
    "summaryHint": "القيم المحسوبة تلقائياً بناءً على الكمية والتسعير"
  },
  "hints": {
    "invoiceNumber": "معرف فريد للفاتورة لهذا البيع (مثل 'INV-001'، 'SALE-2025-001')",
    "saleDate": "تاريخ حدوث معاملة البيع",
    "product": "المنتج المباع - تظهر المنتجات النشطة فقط",
    "batch": "دفعة إنتاج مكتملة - يتم حساب تكلفة البضاعة المباعة من تكلفة الوحدة للدفعة",
    "quantity": "عدد الوحدات المباعة - يجب ألا يتجاوز المخزون المتاح",
    "sellingPricePerUnit": "السعر لكل وحدة المحمل على العميل - يستخدم لحساب إجمالي الإيرادات",
    "customer": "اسم العميل أو الشركة - اختياري لحفظ السجلات",
    "paymentMethod": "كيف دفع العميل أو سيدفع مقابل هذا البيع",
    "paymentStatus": "حالة الدفع الحالية - تؤثر على الحسابات المدينة",
    "amountPaid": "المبلغ المستلم بالفعل من العميل",
    "notes": "تفاصيل بيع إضافية أو معلومات التسليم أو شروط خاصة"
  }
}
```

### 4. Budget Form Translations

Add to `messages/en.json`:

```json
"budgets": {
  "sections": {
    "basicInfo": "Basic Information",
    "basicInfoHint": "Define the budget period and status",
    "budgetedValues": "Budgeted Values",
    "budgetedValuesHint": "Set target values for revenue, costs, and units",
    "actualValues": "Actual Values (Optional)",
    "actualValuesHint": "Record actual performance - can be updated throughout the period"
  },
  "hints": {
    "name": "Descriptive name for this budget (e.g., 'Q1 2025 Budget', 'Annual Budget 2025')",
    "period": "Budget timeframe - determines reporting and analysis period",
    "status": "Draft: planning phase | Active: current tracking | Closed: period ended",
    "startDate": "First day of the budget period",
    "endDate": "Last day of the budget period",
    "budgetedRevenue": "Target revenue for the period - used for variance analysis",
    "budgetedUnits": "Target number of units to produce/sell",
    "budgetedDirectMaterial": "Planned spending on raw materials",
    "budgetedDirectLabor": "Planned spending on direct labor costs",
    "budgetedFixedOverhead": "Planned fixed overhead costs (rent, salaries, etc.)",
    "budgetedVariableOverhead": "Planned variable overhead costs (utilities, supplies, etc.)",
    "actualRevenue": "Actual revenue achieved - updated as sales occur",
    "actualUnits": "Actual units produced/sold - updated from batches and sales",
    "notes": "Budget assumptions, goals, or special considerations"
  }
}
```

Add to `messages/ar.json`:

```json
"budgets": {
  "sections": {
    "basicInfo": "المعلومات الأساسية",
    "basicInfoHint": "حدد فترة الميزانية والحالة",
    "budgetedValues": "القيم المدرجة في الميزانية",
    "budgetedValuesHint": "حدد القيم المستهدفة للإيرادات والتكاليف والوحدات",
    "actualValues": "القيم الفعلية (اختياري)",
    "actualValuesHint": "سجل الأداء الفعلي - يمكن التحديث طوال الفترة"
  },
  "hints": {
    "name": "اسم وصفي لهذه الميزانية (مثل 'ميزانية الربع الأول 2025'، 'الميزانية السنوية 2025')",
    "period": "الإطار الزمني للميزانية - يحدد فترة إعداد التقارير والتحليل",
    "status": "مسودة: مرحلة التخطيط | نشط: التتبع الحالي | مغلق: انتهت الفترة",
    "startDate": "اليوم الأول من فترة الميزانية",
    "endDate": "آخر يوم من فترة الميزانية",
    "budgetedRevenue": "الإيرادات المستهدفة للفترة - تستخدم لتحليل الانحرافات",
    "budgetedUnits": "العدد المستهدف من الوحدات للإنتاج/البيع",
    "budgetedDirectMaterial": "الإنفاق المخطط على المواد الخام",
    "budgetedDirectLabor": "الإنفاق المخطط على تكاليف العمالة المباشرة",
    "budgetedFixedOverhead": "التكاليف العامة الثابتة المخططة (الإيجار، الرواتب، إلخ)",
    "budgetedVariableOverhead": "التكاليف العامة المتغيرة المخططة (المرافق، اللوازم، إلخ)",
    "actualRevenue": "الإيرادات الفعلية المحققة - يتم التحديث مع حدوث المبيعات",
    "actualUnits": "الوحدات الفعلية المنتجة/المباعة - يتم التحديث من الدفعات والمبيعات",
    "notes": "افتراضات الميزانية أو الأهداف أو الاعتبارات الخاصة"
  }
}
```

### 5. Overhead Rate Form Translations

Add to `messages/en.json`:

```json
"settings": {
  "sections": {
    "rateInfo": "Rate Information",
    "rateInfoHint": "Configure overhead rate details and applicability"
  },
  "hints": {
    "rateName": "Descriptive name for this rate (e.g., 'Launch Phase Rate', 'Standard Production Rate')",
    "rateType": "High: launch phase | Medium: growth | Low/Standard: maturity - determines cost allocation",
    "ratePerUnit": "Overhead cost allocated per unit produced - used in batch cost calculation",
    "ratePerHour": "Overhead cost allocated per production hour - used in batch cost calculation",
    "applicableStage": "Product lifecycle stage where this rate applies - system auto-selects based on product",
    "effectiveFrom": "Date when this rate becomes active",
    "effectiveTo": "Date when this rate expires - leave empty for no end date",
    "description": "Brief explanation of what this rate covers",
    "isActive": "Only active rates are used in cost calculations",
    "notes": "Additional details about rate calculation or usage"
  }
}
```

Add to `messages/ar.json`:

```json
"settings": {
  "sections": {
    "rateInfo": "معلومات المعدل",
    "rateInfoHint": "تكوين تفاصيل معدل التكاليف العامة وقابلية التطبيق"
  },
  "hints": {
    "rateName": "اسم وصفي لهذا المعدل (مثل 'معدل مرحلة الإطلاق'، 'معدل الإنتاج القياسي')",
    "rateType": "مرتفع: مرحلة الإطلاق | متوسط: النمو | منخفض/قياسي: النضج - يحدد تخصيص التكلفة",
    "ratePerUnit": "تكلفة عامة مخصصة لكل وحدة منتجة - تستخدم في حساب تكلفة الدفعة",
    "ratePerHour": "تكلفة عامة مخصصة لكل ساعة إنتاج - تستخدم في حساب تكلفة الدفعة",
    "applicableStage": "مرحلة دورة حياة المنتج حيث ينطبق هذا المعدل - يختار النظام تلقائياً بناءً على المنتج",
    "effectiveFrom": "التاريخ الذي يصبح فيه هذا المعدل نشطاً",
    "effectiveTo": "التاريخ الذي ينتهي فيه هذا المعدل - اتركه فارغاً لعدم وجود تاريخ انتهاء",
    "description": "شرح موجز لما يغطيه هذا المعدل",
    "isActive": "تستخدم المعدلات النشطة فقط في حسابات التكلفة",
    "notes": "تفاصيل إضافية حول حساب المعدل أو الاستخدام"
  }
}
```

---

## Implementation Pattern

Each form follows this pattern:

### 1. Section Headers
```tsx
<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
  {t('sections.sectionName')}
</h2>
<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
  {t('sections.sectionNameHint')}
</p>
```

### 2. Field Hints
```tsx
<input ... />
<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
  {t('hints.fieldName')}
</p>
```

### 3. Checkbox Hints
```tsx
<label>
  <input type="checkbox" ... />
  <span>{t('fieldLabel')}</span>
</label>
<p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ms-6">
  {t('hints.fieldName')}
</p>
```

---

## Next Steps

### Immediate
1. ✅ Add Arabic translations for Sales form
2. ⏳ Update Sales form component with hints
3. ⏳ Add Budget form translations (both languages)
4. ⏳ Update Budget form component with hints
5. ⏳ Add Overhead Rate form translations (both languages)
6. ⏳ Update Overhead Rate form component with hints

### Testing
- [ ] Verify all hints display correctly in English
- [ ] Verify all hints display correctly in Arabic
- [ ] Test language toggle on all forms
- [ ] Check dark mode appearance
- [ ] Validate hint text accuracy and helpfulness

---

## Benefits Achieved

### For Product & Batch Forms (Completed)
✅ **Self-documenting** - Users understand each field's purpose  
✅ **Business context** - Explains how fields affect calculations  
✅ **Examples provided** - Shows correct format for inputs  
✅ **Fully bilingual** - Works seamlessly in English and Arabic  
✅ **Professional UX** - Clean, consistent, accessible design  

### Expected for All Forms
- Reduced user errors
- Faster onboarding
- Less support needed
- Better data quality
- Improved user confidence

---

## Summary

**Completed:** 2/5 forms (Product, Batch)  
**In Progress:** 1/5 forms (Sales - translations ready)  
**Pending:** 2/5 forms (Budget, Overhead Rate)  

All translation keys are documented above for easy copy-paste implementation.
