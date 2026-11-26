import { Link } from 'react-router-dom'
import { ArrowLeft, Download, FileSpreadsheet, Upload } from 'lucide-react'
import { PageContainer } from '@/components/layout'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

export function BackupPage() {
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

        <Card>
          <CardHeader>
            <CardTitle>JSON Full Backup</CardTitle>
            <CardDescription>
              Download a single JSON snapshot of all invoices, quotes, clients, items, expenses, and
              settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Download className="h-4 w-4" />
              Export JSON Backup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Restore from Backup</CardTitle>
            <CardDescription>
              Upload a BillBook JSON backup file to restore or migrate your data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 px-6 py-8 text-center dark:border-slate-700">
              <Upload className="h-6 w-6 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Drop JSON backup file here or click to browse
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Validates JSON structure before restoring to the API database
              </p>
            </div>
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
            <Button variant="outline">
              <FileSpreadsheet className="h-4 w-4" />
              Export Invoices CSV
            </Button>
            <Button variant="outline">
              <FileSpreadsheet className="h-4 w-4" />
              Export Expenses CSV
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
