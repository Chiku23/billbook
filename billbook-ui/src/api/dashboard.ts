import { api } from '@/lib/api'
import type { DashboardData } from '@/types'

export async function getDashboard(params?: {
  month?: string
  months?: number
}): Promise<DashboardData> {
  const response = await api.get<{ data: DashboardData }>('/dashboard', { params })
  return response.data.data
}
