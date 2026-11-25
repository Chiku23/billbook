export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
] as const

export const EXPENSE_CATEGORIES = [
  'Travel',
  'Software',
  'Office Supplies',
  'Hardware',
  'Marketing',
  'Meals',
  'Utilities',
  'Rent',
  'Insurance',
  'Miscellaneous',
] as const

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined'
