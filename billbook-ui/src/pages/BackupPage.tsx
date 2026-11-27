import { useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Download, FileSpreadsheet, Upload } from 'lucide-react'
import { exportBackupJson, importBackupJson, type BackupImportResult } from '@/api/backup'
import { exportExpensesCsv } from '@/api/expenses'
import { exportInvoicesCsv } from '@/api/invoices'
import { PageContainer } from '@/components/layout'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
} from '@/components/ui'
import { getApiErrorMessage } from '@/lib/api'

export function BackupPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [mode, setMode] = useState<'replace' | 'merge'>('replace')
  const [busyAction, setBusyAction] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [importResult, setImportResult] = useState<BackupImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportJson = async () => {
    setBusyAction('json')
    setError(null)
    try {
      await exportBackupJson()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to export JSON backup.'))
    } finally {
      setBusyAction(null)
    }
  }

  const handleExportInvoicesCsv = async () => {
    setBusyAction('invoices-csv')
    setError(null)
    try {
      await exportInvoicesCsv()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to export invoices CSV.'))
    } finally {
      setBusyAction(null)
    }
  }

  const handleExportExpensesCsv = async () => {
    setBusyAction('expenses-csv')
    setError(null)
    try {
      await exportExpensesCsv()
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to export expenses CSV.'))
    } finally {
      setBusyAction(null)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
    setImportResult(null)
    setError(null)
  }

  const handleRestore = async () => {
    if (!selectedFile) return
    setBusyAction('restore')
    setError(null)
    setImportResult(null)

    try {
      const result = await importBackupJson(selectedFile, mode)
      setImportResult(result)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to restore backup file.'))
    } finally {
      setBusyAction(null)
    }
  }

  return (
    <PageContainer title="Backup & Export">
      <div className="max-w-3xl space-y-6">
        <Link
          to="/settings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>

        {error && (
          <Card>
            <CardContent className="text-sm text-red-600 dark:text-red-400">{error}</CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>JSON Full Backup</CardTitle>
            <CardDescription>
              Download a single JSON snapshot of all invoices, quotes, clients, items, expenses, and
              settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExportJson} disabled={busyAction !== null}>
              <Download className="h-4 w-4" />
              {busyAction === 'json' ? 'Exporting...' : 'Export JSON Backup'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restore from Backup</CardTitle>
            <CardDescription>
              Upload a BillBook JSON backup file to restore or merge into your database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 px-6 py-8 text-center transition-colors hover:border-slate-400 hover:bg-slate-50/70 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800/40"
            >
              <Upload className="h-6 w-6 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {selectedFile ? selectedFile.name : 'Click to browse for a JSON backup file'}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Validates JSON structure before restoring to the API database
              </p>
            </button>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full sm:w-64">
                <Select
                  label="Restore Mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'replace' | 'merge')}
                  options={[
                    { value: 'replace', label: 'Replace existing data' },
                    { value: 'merge', label: 'Merge with existing data' },
                  ]}
                />
              </div>
              <Button
                onClick={handleRestore}
                disabled={!selectedFile || busyAction !== null}
              >
                {busyAction === 'restore' ? 'Restoring...' : 'Restore Backup'}
              </Button>
            </div>

            {importResult && (
              <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-medium">Backup restored ({importResult.mode} mode).</p>
                  <p className="mt-0.5 text-xs">
                    Clients: {importResult.imported.clients}, Items: {importResult.imported.items},
                    Invoices: {importResult.imported.invoices}, Quotes:{' '}
                    {importResult.imported.quotes}, Expenses: {importResult.imported.expenses}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV Export</CardTitle>
            <CardDescription>
              Export tabular data for spreadsheets and accounting tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleExportInvoicesCsv}
              disabled={busyAction !== null}
            >
              <FileSpreadsheet className="h-4 w-4" />
              {busyAction === 'invoices-csv' ? 'Exporting...' : 'Export Invoices CSV'}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExpensesCsv}
              disabled={busyAction !== null}
            >
              <FileSpreadsheet className="h-4 w-4" />
              {busyAction === 'expenses-csv' ? 'Exporting...' : 'Export Expenses CSV'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
