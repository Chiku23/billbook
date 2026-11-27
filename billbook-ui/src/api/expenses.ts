import { api, downloadBlob } from '@/lib/api'
import type { Expense } from '@/types'

export interface ExpenseSummaryCategory {
  category: string
  total: number
  count: number
}

export interface ExpenseListResponse {
  data: Expense[]
  meta: {
    summary: {
      total: number
      count: number
      byCategory: ExpenseSummaryCategory[]
    }
    availableMonths: string[]
    categories: string[]
  }
}

export async function getExpenses(params?: {
  month?: string
  category?: string
  search?: string
}): Promise<ExpenseListResponse> {
  const response = await api.get<ExpenseListResponse>('/expenses', { params })
  return response.data
}

export async function getExpense(id: string): Promise<Expense> {
  const response = await api.get<{ data: Expense }>(`/expenses/${id}`)
  return response.data.data
}

export async function createExpense(payload: FormData): Promise<Expense> {
  const response = await api.post<{ data: Expense }>('/expenses', payload)
  return response.data.data
}

export async function updateExpense(id: string, payload: FormData): Promise<Expense> {
  const response = await api.post<{ data: Expense }>(`/expenses/${id}`, payload)
  return response.data.data
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`)
}

export async function exportExpensesCsv(params?: {
  month?: string
  category?: string
  search?: string
}): Promise<void> {
  const response = await api.get<Blob>('/expenses/export/csv', {
    params,
    responseType: 'blob',
  })
  const date = new Date().toISOString().slice(0, 10)
  downloadBlob(response.data, `billbook-expenses-${date}.csv`)
}
