import { api } from '@/lib/api'

export interface HealthResponse {
  status: string
  app: string
  database: string
  timestamp: string
}

export interface CurrencyOption {
  code: string
  symbol: string
  name: string
}

export interface MetaResponse {
  currencies: CurrencyOption[]
  expenseCategories: string[]
  invoiceStatuses: string[]
  quoteStatuses: string[]
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>('/health')
  return response.data
}

export async function getMeta(): Promise<MetaResponse> {
  const response = await api.get<{ data: MetaResponse }>('/meta')
  return response.data.data
}
