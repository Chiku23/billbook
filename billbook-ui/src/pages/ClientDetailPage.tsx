import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Mail, MapPin, Pencil, Phone } from 'lucide-react'
import { getClient } from '@/api/clients'
import { CurrencyDisplay, StatusBadge } from '@/components/common'
import { PageContainer } from '@/components/layout'
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
} from '@/components/ui'
import { getApiErrorMessage } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Client } from '@/types'

export function ClientDetailPage() {
  const { id } = useParams()
  const [client, setClient] = useState<Client | null>(null)
  const [activeTab, setActiveTab] = useState<'invoices' | 'quotes'>('invoices')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    getClient(id)
      .then((data) => {
        if (!cancelled) {
          setClient(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getApiErrorMessage(err, 'Failed to load client details.'))
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

  if (loading) {
    return (
      <PageContainer>
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading client...</p>
      </PageContainer>
    )
  }

  if (error || !client) {
    return (
      <PageContainer>
        <div className="space-y-4">
          <Link
            to="/clients"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Link>
          <Card>
            <CardContent className="text-sm text-red-600 dark:text-red-400">
              {error ?? 'Client not found.'}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    )
  }

  const invoices = client.invoices ?? []
  const quotes = client.quotes ?? []
  const activeDocuments = activeTab === 'invoices' ? invoices : quotes

  const documentTabs = [
    { id: 'invoices', label: 'Invoices', count: invoices.length },
    { id: 'quotes', label: 'Quotes', count: quotes.length },
  ]

  return (
    <PageContainer
      actions={
        <Link to={`/clients/${client.id}/edit`}>
          <Button variant="outline">
            <Pencil className="h-4 w-4" />
            Edit Client
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <Link
          to="/clients"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>

        <Card>
          <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {client.initials ?? 'CL'}
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {client.name}
                </h1>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                  {client.email && (
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {client.email}
                    </span>
                  )}
                  {client.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {client.phone}
                    </span>
                  )}
                  {client.address && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {client.address}
                    </span>
                  )}
                </div>
                {client.taxId && <p className="text-xs text-slate-400">GSTIN: {client.taxId}</p>}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-right dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Invoiced</p>
              <p className="mt-0.5 text-lg font-bold text-slate-900 dark:text-slate-100">
                <CurrencyDisplay amount={formatCurrency(client.totalInvoiced ?? 0, 'INR', 0)} />
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tabs
              items={documentTabs}
              activeId={activeTab}
              onChange={(tabId) => setActiveTab(tabId as 'invoices' | 'quotes')}
            />
            <Link to={`/invoices/new?clientId=${client.id}`}>
              <Button variant="outline" size="sm">
                <FileText className="h-3.5 w-3.5" />
                New Invoice for Client
              </Button>
            </Link>
          </div>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Number</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>{activeTab === 'invoices' ? 'Due Date' : 'Valid Until'}</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-slate-500 dark:text-slate-400"
                    >
                      No {activeTab} linked to this client yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  activeDocuments.map((doc) => {
                    const detailPath =
                      activeTab === 'invoices' ? `/invoices/${doc.id}` : `/quotes/${doc.id}`
                    const targetDate = activeTab === 'invoices' ? doc.dueDate : doc.validUntil

                    return (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                          <Link to={detailPath} className="hover:text-blue-600 hover:underline">
                            {doc.number}
                          </Link>
                        </TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400">
                          {formatDate(doc.issueDate)}
                        </TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400">
                          {formatDate(targetDate)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={doc.status} />
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
                          <CurrencyDisplay
                            amount={formatCurrency(doc.grandTotal ?? 0, doc.currency, 0)}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
