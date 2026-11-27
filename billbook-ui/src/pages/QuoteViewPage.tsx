import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRightLeft,
  Check,
  Copy,
  Download,
  Pencil,
  Send,
  Trash2,
  X,
} from 'lucide-react'
import {
  convertQuoteToInvoice,
  deleteQuote,
  duplicateQuote,
  getQuote,
  updateQuoteStatus,
} from '@/api/quotes'
import { ConfirmDialog, StatusBadge } from '@/components/common'
import { PageContainer } from '@/components/layout'
import { QuotePreview } from '@/components/quotes/QuotePreview'
import { Button, Card, CardContent } from '@/components/ui'
import { getApiErrorMessage } from '@/lib/api'
import type { QuoteStatus } from '@/lib/constants'
import type { Document, SettingsData } from '@/types'

interface QuoteViewPageProps {
  settings: SettingsData | null
}

export function QuoteViewPage({ settings }: QuoteViewPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quote, setQuote] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    getQuote(id)
      .then((data) => {
        if (!cancelled) {
          setQuote(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load quote.'))
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
    if (!quote) return
    setBusy(true)
    try {
      const copy = await duplicateQuote(quote.id)
      navigate(`/quotes/${copy.id}/edit`)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to duplicate quote.'))
    } finally {
      setBusy(false)
    }
  }

  const handleConvert = async () => {
    if (!quote) return
    setBusy(true)
    try {
      const invoice = await convertQuoteToInvoice(quote.id)
      navigate(`/invoices/${invoice.id}`)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to convert quote to invoice.'))
      setBusy(false)
    }
  }

  const handleStatusChange = async (nextStatus: QuoteStatus) => {
    if (!quote) return
    setBusy(true)
    try {
      const updated = await updateQuoteStatus(quote.id, nextStatus)
      setQuote(updated)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update quote status.'))
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!quote) return
    setBusy(true)
    try {
      await deleteQuote(quote.id)
      navigate('/quotes')
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete quote.'))
      setConfirmDeleteOpen(false)
      setBusy(false)
    }
  }

  return (
    <PageContainer title="Quote Preview">
      <div className="space-y-6">
        <Link
          to="/quotes"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 print:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotes
        </Link>

        {error && (
          <Card className="print:hidden">
            <CardContent className="text-sm text-red-600 dark:text-red-400">{error}</CardContent>
          </Card>
        )}

        {loading ? (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Loading quote...
            </CardContent>
          </Card>
        ) : !quote ? (
          <Card>
            <CardContent className="text-sm text-slate-500 dark:text-slate-400">
              Quote not found.
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
              <div className="flex items-center gap-3">
                <StatusBadge status={quote.status} />
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {quote.number}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link to={`/quotes/${quote.id}/edit`}>
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
                {quote.status === 'draft' && (
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
                {quote.status === 'sent' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleStatusChange('accepted')}
                      disabled={busy}
                    >
                      <Check className="h-3.5 w-3.5" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleStatusChange('declined')}
                      disabled={busy}
                    >
                      <X className="h-3.5 w-3.5" />
                      Decline
                    </Button>
                  </>
                )}
                {quote.convertedInvoiceId ? (
                  <Link to={`/invoices/${quote.convertedInvoiceId}`}>
                    <Button variant="primary" size="sm">
                      <ArrowRightLeft className="h-3.5 w-3.5" />
                      View Invoice
                    </Button>
                  </Link>
                ) : (
                  <Button variant="primary" size="sm" onClick={handleConvert} disabled={busy}>
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    Convert to Invoice
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete quote"
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={busy}
                >
                  <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                </Button>
              </div>
            </Card>

            <QuotePreview quote={quote} businessProfile={settings?.businessProfile} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Quote"
        description={`Delete quote ${quote?.number ?? ''}?`}
        confirmLabel="Delete"
        destructive
      />
    </PageContainer>
  )
}
