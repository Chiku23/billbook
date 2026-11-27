import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Copy, Download, Pencil, Send, Trash2 } from 'lucide-react'
import {
  deleteInvoice,
  duplicateInvoice,
  getInvoice,
  updateInvoiceStatus,
} from '@/api/invoices'
import { ConfirmDialog, StatusBadge } from '@/components/common'
import { InvoicePreview } from '@/components/invoices/InvoicePreview'
import { PageContainer } from '@/components/layout'
import { Button, Card, CardContent } from '@/components/ui'
import { getApiErrorMessage } from '@/lib/api'
import type { InvoiceStatus } from '@/lib/constants'
import type { Document, SettingsData } from '@/types'

interface InvoiceViewPageProps {
  settings: SettingsData | null
}

export function InvoiceViewPage({ settings }: InvoiceViewPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [invoice, setInvoice] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    getInvoice(id)
      .then((data) => {
        if (!cancelled) {
          setInvoice(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load invoice.'))
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
  }, [id])

  const handleDuplicate = async () => {
    if (!invoice) return
    setBusy(true)
    try {
      const copy = await duplicateInvoice(invoice.id)
      navigate(`/invoices/${copy.id}/edit`)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to duplicate invoice.'))
    } finally {
      setBusy(false)
    }
  }

  const handleStatusChange = async (nextStatus: InvoiceStatus) => {
    if (!invoice) return
    setBusy(true)
    try {
      const updated = await updateInvoiceStatus(invoice.id, nextStatus)
      setInvoice(updated)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update status.'))
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!invoice) return
    setBusy(true)
    try {
      await deleteInvoice(invoice.id)
      navigate('/invoices')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete invoice.'))
      setConfirmDeleteOpen(false)
      setBusy(false)
    }
  }

  return (
    <PageContainer title="Invoice Preview">
      <div className="space-y-6">
        <Link
          to="/invoices"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 print:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Link>

        {error && (
          <Card className="print:hidden">
            <CardContent className="text-sm text-red-600 dark:text-red-400">{error}</CardContent>
          </Card>
        )}

        {loading ? (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Loading invoice...
            </CardContent>
          </Card>
        ) : !invoice ? (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Invoice not found.
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
              <div className="flex items-center gap-3">
                <StatusBadge status={invoice.status} />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {invoice.number}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link to={`/invoices/${invoice.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={busy}>
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Download className="h-3.5 w-3.5" />
                  Print / PDF
                </Button>
                {invoice.status === 'draft' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleStatusChange('sent')}
                    disabled={busy}
                  >
                    <Send className="h-3.5 w-3.5" />
                    Mark as Sent
                  </Button>
                )}
                {invoice.status !== 'paid' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => void handleStatusChange('paid')}
                    disabled={busy}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark as Paid
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete invoice"
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={busy}
                >
                  <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                </Button>
              </div>
            </Card>

            <InvoicePreview invoice={invoice} businessProfile={settings?.businessProfile} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        description={`Delete invoice ${invoice?.number ?? ''}?`}
        confirmLabel="Delete"
        destructive
      />
    </PageContainer>
  )
}
