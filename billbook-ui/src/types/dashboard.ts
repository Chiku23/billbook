import type { InvoiceStatus, QuoteStatus } from '@/lib/constants'

export interface DashboardOverview {
  totalInvoiced: number
  totalPaid: number
  totalOutstanding: number
  totalExpenses: number
  allTimeExpenses: number
  draftTotal: number
}

export interface MonthlyRevenuePoint {
  month: string
  monthKey: string
  label: string
  revenue: number
  count: number
}

export interface ExpenseCategoryPoint {
  name: string
  value: number
  count: number
}

export interface RecentActivityItem {
  id: string
  type: 'invoice' | 'quote'
  number: string
  clientId: string | null
  clientName: string
  issueDate: string | null
  dueDate: string | null
  validUntil: string | null
  status: InvoiceStatus | QuoteStatus
  currency: string
  grandTotal: number
  updatedAt: string
}

export interface DashboardData {
  currency: string
  month: string
  overview: DashboardOverview
  monthlyRevenue: MonthlyRevenuePoint[]
  expensesByCategory: ExpenseCategoryPoint[]
  recentActivity: RecentActivityItem[]
}
