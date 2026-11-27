import { api } from '@/lib/api'
import type { InvoiceDefaults, SettingsData } from '@/types'

export async function getSettings(): Promise<SettingsData> {
  const response = await api.get<{ data: SettingsData }>('/settings')
  return response.data.data
}

export async function updateBusinessProfile(payload: FormData): Promise<SettingsData> {
  const response = await api.post<{ data: SettingsData }>('/settings/business-profile', payload)
  return response.data.data
}

export async function updateInvoiceDefaults(
  payload: Partial<InvoiceDefaults>,
): Promise<SettingsData> {
  const response = await api.put<{ data: SettingsData }>('/settings/invoice-defaults', payload)
  return response.data.data
}

export async function updateTheme(theme: 'light' | 'dark'): Promise<SettingsData> {
  const response = await api.patch<{ data: SettingsData }>('/settings/theme', { theme })
  return response.data.data
}
