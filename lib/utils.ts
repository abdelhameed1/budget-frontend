import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'EGP'): string {
  // Always use English numerals regardless of locale
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' ' + currency;
}

export function formatDate(date: Date | string, locale: string = 'ar'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  // Use locale for month/day names but force English numerals with numberingSystem
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    numberingSystem: 'latn', // Force Latin (English) numerals
  }).format(dateObj);
}

export function formatNumber(num: number, locale: string = 'ar'): string {
  // Always use English numerals
  return new Intl.NumberFormat('en-US').format(num);
}
