import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileCheck2, Plus, Search } from 'lucide-react'
import { deleteQuote, getQuotes } from '@/api/quotes'
import { ConfirmDialog, EmptyState } from '@/components/common'
import { PageContainer } from '@/components/layout'
import { QuoteListItem } from '@/components/quotes/QuoteListItem'
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
import type { QuoteStatus } from '@/lib/constants'
import type { Document } from '@/types'

export function QuoteListPage() {
  const [quotes, setQuotes] = useState<Document[]>([])
  const [counts, setCounts] = useState<Record<'all' | QuoteStatus, number>>({
    all: 0,
    draft: 0,
    sent: 0,
    accepted: 0,
    declined: 0,
  })
  const [activeStatus, setActiveStatus] = useState<'all' | QuoteStatus>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quoteToDelete, setQuoteToDelete] = useState<Document | null>(null)

  const loadQuotes = (statusFilter: 'all' | QuoteStatus, searchTerm: string) => {
    return getQuotes({
      status: statusFilter === 'all' ? undefined : statusFilter,
      search: searchTerm || undefined,
    })
  }

  useEffect(() => {
    let cancelled = false

    loadQuotes(activeStatus, search)
      .then((res) => {
        if (cancelled) return
        setQuotes(res.data)
        setCounts(res.meta.counts)
        setError(null)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load quotes.'))
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
    if (!quoteToDelete) return
    try {
      await deleteQuote(quoteToDelete.id)
      const refreshed = await loadQuotes(activeStatus, search)
      setQuotes(refreshed.data)
      setCounts(refreshed.meta.counts)
      setQuoteToDelete(null)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete quote.'))
      setQuoteToDelete(null)
    }
  }

  const statusTabs = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'draft', label: 'Draft', count: counts.draft },
    { id: 'sent', label: 'Sent', count: counts.sent },
    { id: 'accepted', label: 'Accepted', count: counts.accepted },
    { id: 'declined', label: 'Declined', count: counts.declined },
  ]

  return (
    <PageContainer
      title="Quotes"
      actions={
        <Link to="/quotes/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Quote
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            items={statusTabs}
            activeId={activeStatus}
            onChange={(tabId) => setActiveStatus(tabId as 'all' | QuoteStatus)}
          />
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search quotes..."
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
              Loading quotes...
            </CardContent>
          </Card>
        ) : quotes.length === 0 ? (
          <EmptyState
            icon={<FileCheck2 className="h-5 w-5" />}
            title="No quotes found"
            description="Create a quote or change your current status filter."
            action={
              <Link to="/quotes/new">
                <Button>
                  <Plus className="h-4 w-4" />
                  New Quote
                </Button>
              </Link>
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Quote #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-28" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <QuoteListItem
                    key={quote.id}
                    quote={quote}
                    onDelete={setQuoteToDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <ConfirmDialog
        open={quoteToDelete !== null}
        onClose={() => setQuoteToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Quote"
        description={`Delete quote ${quoteToDelete?.number ?? ''}?`}
        confirmLabel="Delete"
        destructive
      />
    </PageContainer>
  )
}
