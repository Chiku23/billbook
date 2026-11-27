import { api, downloadBlob } from '@/lib/api'

export interface BackupImportResult {
  mode: string
  imported: {
    clients: number
    items: number
    invoices: number
    quotes: number
    expenses: number
  }
}

export async function exportBackupJson(): Promise<void> {
  const response = await api.get<Blob>('/backup/export', {
    params: { download: 1 },
    responseType: 'blob',
  })
  const date = new Date().toISOString().slice(0, 10)
  downloadBlob(response.data, `billbook-backup-${date}.json`)
}

export async function importBackupJson(
  file: File,
  mode: 'replace' | 'merge',
): Promise<BackupImportResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('mode', mode)

  const response = await api.post<{ data: BackupImportResult }>('/backup/import', formData)
  return response.data.data
}
