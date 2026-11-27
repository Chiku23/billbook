export interface Expense {
  id: string
  date: string
  category: string
  amount: number
  currency: string
  vendor: string
  notes: string
  receiptBase64: string | null
  receiptUrl?: string | null
  createdAt: string
  updatedAt: string
}
