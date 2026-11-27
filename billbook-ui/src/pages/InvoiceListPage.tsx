import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileSpreadsheet, FileText, Plus, Search } from 'lucide-react'
import { deleteInvoice, exportInvoicesCsv, getInvoices } from '@/api/invoices'
import { ConfirmDialog, EmptyState } from '@/components/common'
import { InvoiceListItem } from '@/components/invoices/InvoiceListItem'
import { PageContainer } from '@/components/layout'
import {
  Button,
  Card,
  CardContent,
  Input,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
} from '@/components/ui'
import { getApiErrorMessage } from '@/lib/api'
import type { InvoiceStatus } from '@/lib/constants'
import type { Document } from '@/types'

export function InvoiceListPage() {
  const [invoices, setInvoices] = useState<Document[]>([])
  const [counts, setCounts] = useState<Record<'all' | InvoiceStatus, number>>({
    all: 0,
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
  })
  const [activeStatus, setActiveStatus] = useState<'all' | InvoiceStatus>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invoiceToDelete, setInvoiceToDelete] = useState<Document | null>(null)

  const loadInvoices = (statusFilter: 'all' | InvoiceStatus, searchTerm: string) => {
    return getInvoices({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: searchTerm || undefined,
    })
  }

  useEffect(() => {
    let cancelled = false

    loadInvoices(activeStatus, search)
      .then((res) => {
        if (cancelled) return
        setInvoices(res.data)
        setCounts(res.meta.counts)
        setError(null)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load invoices.'))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [activeStatus, search])

  const handleConfirmDelete = async () => {
    if (!invoiceToDelete) return
    try {
      await deleteInvoice(invoiceToDelete.id)
      const refreshed = await loadInvoices(activeStatus, search)
      setInvoices(refreshed.data)
      setCounts(refreshed.meta.counts)
      setInvoiceToDelete(null)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete invoice.'))
      setInvoiceToDelete(null)
    }
  }

  const statusTabs = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'draft', label: 'Draft', count: counts.draft },
    { id: 'sent', label: 'Sent', count: counts.sent },
    { id: 'paid', label: 'Paid', count: counts.paid },
    { id: 'overdue', label: 'Overdue', count: counts.overdue },
  ]

  return (
    <PageContainer
      title="Invoices"
      actions={
        <>
          <Button
            variant="outline"
            onClick={() =>
              void exportInvoicesCsv({
                status: activeStatus === 'all' ? undefined : activeStatus,
                search: search || undefined,
              })
            }
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
          <Link to="/invoices/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            items={statusTabs}
            activeId={activeStatus}
            onChange={(tabId) => setActiveStatus(tabId as 'all' | InvoiceStatus)}
          />
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        {error && (
          <Card>
            <CardContent className="text-sm text-red-600 dark:text-red-400">{error}</CardContent>
          </Card>
        )}

        {loading ? (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Loading invoices...
            </CardContent>
          </Card>
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-5 w-5" />}
            title="No invoices found"
            description="Create a new invoice or change your current status filter."
            action={
              <Link to="/invoices/new">
                <Button>
                  <Plus className="h-4 w-4" />
                  New Invoice
                </Button>
              </Link>
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-28" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <InvoiceListItem
                    key={invoice.id}
                    invoice={invoice}
                    onDelete={setInvoiceToDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <ConfirmDialog
        open={invoiceToDelete !== null}
        onClose={() => setInvoiceToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice"
        description={`Delete invoice ${invoiceToDelete?.number ?? ''}?`}
        confirmLabel="Delete"
        destructive
      />
    </PageContainer>
  )
}
